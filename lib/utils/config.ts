import IConfig from './interface-config';
import { ConstructsProps, EnvironmentProps, IConstructProps, IContributorsProps, IEnvironmentProps, IRepositoryProps, IStackProps, ITagProps, S3ConstructProps, TagProps } from './type';
import StackProps from "./stack-props";
import { NoSuchParameterValueError } from '../error/error';
import { App } from 'aws-cdk-lib';

/**
 * ``Config`` specifies configuration parameters for the CDK app. Static
 * configuration parameters can be specified in static configuration
 * files like ``package.json``, ``cdk.json``, ``cdk.context.json``, *etc.*
 * Dynamic configuration parameters are induced from the build runtime.
 *
 * Extend ``Config`` depending on the static file format.
 *
 * @see
 *
 * ``ConfiJSON`` consumes the static configuration files ``package.json``, and
 * ``cdk.json``.
 */
export default abstract class Config implements IConfig {
    /**
     * The project author
     */
    public readonly projectAuthor: string
    /**
     * The project contributors
     */
    public readonly projectContributors: Array<IContributorsProps>
    /**
     * The project engines versions
     */
    public readonly projectEngines: { node: string }
    /**
     * The project running OS
     */
    public readonly projectOS: Array<string>
    /**
     * The project bugs/issue tracker page
     */
    public readonly projectBugs: string
    /**
     * The project keywords
     */
    public readonly projectKeywords: Array<string>
    /**
     * The project name
     */
    public readonly projectName: string
    /**
     * The project version
     */
    public readonly projectVersion: string
    /**
     * The project description
     */
    public readonly projectDescription: string
    /**
     * The project remote repository url
     */
    public readonly projectRepository: IRepositoryProps
    /**
     * The project docs url
     */
    public readonly projectDocs: string
    public readonly tags: Array<ITagProps>
    /**
     * The project's CDK Stacks configuration
     */
    public readonly stacks: Array<IStackProps>
    /**
     * The project's CDK environments.
     */
    public readonly environments: Array<IEnvironmentProps>

    constructor(
        app: App,
        projectAuthor: string,
        projectContributors: Array<IContributorsProps>,
        projectOS: Array<string>,
        projectBugs: string,
        projectKeywords: Array<string>,
        projectEngines: { node: string },
        projectName: string,
        projectDescription: string,
        projectVersion: string,
        projectRepository: IRepositoryProps,
        projectDocs: string,
        tags: Array<ITagProps>,
        stacks: Array<IStackProps>,
        environments: Array<IEnvironmentProps>
    ) {
        this.projectKeywords = projectKeywords
        this.projectBugs = projectBugs
        this.projectOS = projectOS
        this.projectEngines = projectEngines
        this.projectContributors = projectContributors
        this.projectAuthor = this.getProjectAuthor(projectAuthor)
        this.projectName = projectName
        this.projectDescription = projectDescription
        this.projectVersion = projectVersion
        this.projectRepository = projectRepository
        this.projectDocs = projectDocs
        this.environments = this.getEnvironments(app, environments)
        this.tags = this.getAllTags(tags)
        this.stacks = this.getStacksProps(stacks)
    }
    /**
     * Get the project author
     * 
     * Strips illegal tag values (read the aws `docs <https://docs.aws.amazon.com/general/latest/gr/aws_tagging.html>`_).
     * 
     * @param projectAuthor
     * @returns The project author.
     */
    getProjectAuthor(projectAuthor: string): string {
        return projectAuthor.replace(/[<>()]/gi, "");
    }
    /**
     * Get the CDK app stacks properties
     *
     * Adds to each stack the environments, constructs and tags configured to 
     * the cdk app.
     *
     * @param stacks The cdk app stacks as parsed from static config files.
     */
    getStacksProps(stacks: Array<IStackProps>): Array<StackProps> {
        /**
         * The stack properties read from a static source, (read as type `stacks: Array<IStack>`) cast to `Array<Stack>`
         */
        let castStacks: Array<StackProps> = []
        /**
         * The mapping from `Stack` to `IStack`
         */
        let mappedStack: StackProps
        /**
         * Add the project tags to the stack tags.
         */
        let mappedStackTags: Array<ITagProps> = []
        /**
         * Overwrite the stack tags with the project tags, if any
         */
        let mappedStackEnvironments: Array<IEnvironmentProps> = []
        /**
         * Cast the stack constructs from ``IConstruct`` to the
         * corresponding ``Constructs``.
         */
        let mappedStackConstructs: Array<ConstructsProps> = []
        castStacks = stacks.map((stack: IStackProps): StackProps => {
            // enrich the stack tags with the project default tags
            this.tags.forEach((tag: ITagProps): void => {
                mappedStackTags.push(tag)
            })
            // enrich the stack deployment environments
            if (this.environments.length)
                mappedStackEnvironments = this.environments
            // convert the `IConstruct` to `Constructs`
            stack.constructs.forEach((construct: IConstructProps): void => {
                switch(construct.service) {
                    case "aws::s3": {
                        mappedStackConstructs.push(
                            new S3ConstructProps(
                                construct.id,
                                construct.service,
                                construct.bucketName!,
                                construct.blockPublicAccess!,
                                construct.removalPolicy!,
                                construct.autoDeleteObjects!,
                                construct.objectOwnership!,
                                construct.versioned!
                            )
                        )
                        break;
                    }
                    default: {
                        throw new NoSuchParameterValueError('service', construct.service)
                    }
                }
            })

            // convert the `IStack` to `Stack`
            mappedStack = new StackProps(
                stack.stackName,
                stack.id,
                stack.description,
                mappedStackTags,
                mappedStackConstructs,
                mappedStackEnvironments,
                stack.account,
                stack.region
            )
            return mappedStack
        });

        return castStacks
    }
    /**
     * The project's CDK environments.
     *
     * @default [] The environments are specified as:
     *
     * 1. CLI arguments
     * 2. Globally in ``cdk.json``
     * 3. Per stack in ``cdk.json`` (@todo)
     * 4. Environment variables
     *
     * CLI arguments
     * -------------
     *
     * The environment variables specify a deployment environment:
     *
     * + ``account``: The environment account ID, necessary to
     * configure the Stack deployment.
     * + ``region``: The environment account region, necessary to
     * configure the stack deployment.
     * + ``name``: The environment account name, used to tag the
     * stack.
     * + ``environment``: The environment name (``release``,
     * ``dex``, *etc.*) used to tag the stack.
     *
     * .. code:: shell
     *
     *    npx cdk deploy \
     *      -c environment=test \
     *      -c account=test \
     *      -c name=test \
     *      -c region=test
     *
     * Environment Variables
     * ---------------------
     *
     * The environment variables specify a deployment environment:
     *
     * + ``CDK_DEFAULT_ACCOUNT``: The environment account ID, necessary to
     * configure the Stack deployment.
     * + ``CDK_DEFAULT_REGION``: The environment account region, necessary to
     * configure the stack deployment.
     * + ``CDK_DEFAULT_NAME``: The environment account name, used to tag the
     * stack.
     * + ``CDK_DEFAULT_ENVIRONMENT``: The environment name (``release``,
     * ``dex``, *etc.*) used to tag the stack.
     *
     * Environment Specified Globally
     * ------------------------------
     *
     * @example
     *
     * {
     *    "context": {
     *      "environments": [
     *          {
     *              "environment": "dev",
     *              "account": "secret",
     *              "name": "secret",
     *              "region": "secret"
     *          },
     *          {
     *              "environment": "release",
     *              "account": "secret",
     *              "name": "secret",
     *              "region": "secret"
     *          },
     *          {
     *              "environment": "latest",
     *              "account": "secret",
     *              "name": "secret",
     *              "region": "secret"
     *          }
     *      ]
     *    }
     * }
     *
     * Environment Specified Per Stack
     * -------------------------------
     *
     * @example
     *
     * {
     *      "context": {
     *          "stacks": [
     *              {
     *                  "stackName": "network-stack",
     *                  "id": "NetworkStack",
     *                  "description": "VPC, EC2 Subnets",
     *                  "env": "",
     *                  "tags": [
     *                      {
     *                          "name": "",
     *                          "value": ""
     *                      }
     *                  ],
     *                  "constructs": [
     *                      {
     *                          "service": "aws::vpc",
     *                          "id": "vpc",
     *                          "prefix": "ARTEKLABS-",
     *                          "suffix": "-VPC"
     *                      }
     *                  ],
     *                  "environments": []
     *              }
     *          ]
     *      }
     *  }
     *
     * Rules Of Precedence
     * -------------------
     *
     * ``n`` takes precedence over ``n+1``.
     *
     * Authentication
     * --------------
     *
     * The stack needs to authenticate with the specified environments.
     *
     */
    public getEnvironments(app: App, environments: Array<IEnvironmentProps>): Array<IEnvironmentProps> {
        /**
         * Having applied the rules of precedence to determine which
         * environments the stack is to be deployed to
         */
        let finalEnv: Array<IEnvironmentProps> = []
        /**
         * If a rule is met, ``ruleMet`` is ``true``, ``false`` otherwise.
         */
        let ruleMet: boolean = false
        /**
         * Rule 1: CLI arguments
         * ---------------------
         *
         * Verify if CLI **all** arguments were passed with the cdk command. If
         * this is the case, specify this environment globally as the **sole**
         * stacks deployment environment.
         *
         * Warnings
         * ------------
         *
         * * If this rule executes, it overrides all other rules.
         *
         * Requirements
         * ------------
         *
         * * All parameters must be passed.
         * * The specified environment must be authenticated with.
         *
         */
        let cliEnvironment: IEnvironmentProps
        let environment: string = app.node.tryGetContext("environment")
        let account: string = app.node.tryGetContext("account")
        let name: string = app.node.tryGetContext("name")
        let region: string = app.node.tryGetContext("region")
        ruleMet = [environment, account, name, region].every(e => e != undefined)
        if (ruleMet) {
            cliEnvironment = new EnvironmentProps(environment, account, name, region)
            finalEnv.push(cliEnvironment)
        }

        /**
         * Rule 2: Global Specification
         * ----------------------------
         *
         * If ``Rule 1`` does not apply, apply the global specification of
         * environments.
         *
         * Warnings
         * ------------
         *
         * * If this rule executes, it overrides all other rules.
         * * The stacks will be deployed to **each and every** specified
         * environment.
         *
         * Requirements
         * ------------
         *
         * * The specified environments must be authenticated with.
         *
         */
        let globalEnvironments: Array<IEnvironmentProps> = environments
        if (!ruleMet && globalEnvironments.length){
            finalEnv = globalEnvironments
            ruleMet = true
        }
        /**
         * Rule 4: Environments Vars Specification
         * ---------------------------------------
         *
         * If no rule applies apply the environments vars specification of
         * the environment.
         *
         * Warnings
         * ------------
         *
         * * If this rule failes to execute, the CDK deployment will fail, the
         * environment will not have been defined.
         *
         * Requirements
         * ------------
         *
         * * The specified environment must be authenticated with.
         *
         */
        let envvarsEnvironment: IEnvironmentProps
        if (!ruleMet){
            envvarsEnvironment = new EnvironmentProps(
                process.env.CDK_DEFAULT_ENVIRONMENT!,
                process.env.CDK_DEFAULT_ACCOUNT!,
                process.env.CDK_DEFAULT_NAME!,
                process.env.CDK_DEFAULT_REGION!
            )
            finalEnv.push(envvarsEnvironment)
        }
        return finalEnv
    }
    /**
     * Get the stack default tags
     *
     * @returns The stack default tags
     */
    public getAllTags(tags: Array<ITagProps>): Array<ITagProps> {
        let defaultTags: Array<ITagProps> = []
        defaultTags.push(new TagProps('author',this.projectAuthor))
        defaultTags.push(new TagProps('project', this.projectName))
        defaultTags.push(new TagProps('description', this.projectDescription))
        defaultTags.push(new TagProps('version', this.projectVersion))
        defaultTags.push(new TagProps('docs', this.projectDocs))
        defaultTags.push(new TagProps('src', this.projectRepository.url))
        return defaultTags.concat(tags)
    }
    /**
     * Get the CDK stack context properties
     *
     * The method returns a ``Stack`` and not an ``IStack`` because ``IStack``
     * declares methods that need to be accessed from an ``IStack`` instance.
     *
     * @param name The CDK stack name
     * @returns The CDK stack context properties
     */
    public getStackProps(name: string): StackProps {
        let contextProperties: StackProps
        let stacks: Array<IStackProps> = this.stacks.filter((stackProps: IStackProps): boolean => stackProps.stackName == name)
        if (stacks.length) {
            contextProperties = new StackProps(
                stacks[0].stackName,
                stacks[0].id,
                stacks[0].description,
                stacks[0].tags,
                stacks[0].constructs,
                stacks[0].environments,
                stacks[0].account,
                stacks[0].region
            )
        } else {
            throw new NoSuchParameterValueError('name', name)
        }

        return contextProperties
    }
}
