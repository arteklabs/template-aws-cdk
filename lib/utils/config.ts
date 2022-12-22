import IConfig from './interface-config';
import { Environment, IContributors, IEnvironment, IRepository, IStack, ITag } from './type';
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
    public readonly projectContributors: Array<IContributors>
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
    public readonly projectRepository: IRepository
    /**
     * The project docs url
     */
    public readonly projectDocs: string
    public readonly tags: Array<ITag>
    /**
     * The project's CDK Stacks configuration
     */
    public readonly stacks: Array<IStack>
    /**
     * The project's CDK environments.
     */
    public readonly environments: Array<IEnvironment>

    constructor(
        app: App,
        projectAuthor: string,
        projectContributors: Array<IContributors>,
        projectOS: Array<string>,
        projectBugs: string,
        projectKeywords: Array<string>,
        projectEngines: { node: string },
        projectName: string,
        projectDescription: string,
        projectVersion: string,
        projectRepository: IRepository,
        projectDocs: string,
        tags: Array<ITag>,
        stacks: Array<IStack>,
        environments: Array<IEnvironment>
    ) {
        this.projectKeywords = projectKeywords
        this.projectBugs = projectBugs
        this.projectOS = projectOS
        this.projectEngines = projectEngines
        this.projectContributors = projectContributors
        this.projectAuthor = projectAuthor
        this.projectName = projectName
        this.projectDescription = projectDescription
        this.projectVersion = projectVersion
        this.projectRepository = projectRepository
        this.projectDocs = projectDocs
        this.environments = this.getEnvironments(app, environments)
        this.tags = this.getAllTags(tags)
        this.stacks = this.getStacks(stacks)
    }
    /**
     * Get the CDK app stacks
     *
     * Adds to each stack the environments and the tags configured to the cdk
     * app.
     *
     * @param stacks The cdk app stacks
     */
    getStacks(stacks: Array<IStack>): Array<IStack> {
        stacks.forEach((stack: IStack): void => {
            this.tags.forEach((tag: ITag): void => {
                stack.tags.push(tag)
            })
            stack.environments = this.environments
        });

        return stacks
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
    public getEnvironments(app: App, environments: Array<IEnvironment>): Array<IEnvironment> {
        /**
         * Having applied the rules of precedence to determine which
         * environments the stack is to be deployed to
         */
        let finalEnv: Array<IEnvironment> = []
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
        let cliEnvironment: IEnvironment
        let environment: string = app.node.tryGetContext("environment")
        let account: string = app.node.tryGetContext("account")
        let name: string = app.node.tryGetContext("name")
        let region: string = app.node.tryGetContext("region")
        ruleMet = [environment, account, name, region].every(e => e != undefined)
        if (ruleMet) {
            cliEnvironment = new Environment(environment, account, name, region)
            finalEnv.push(cliEnvironment)
            ruleMet = true
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
        let globalEnvironments: Array<IEnvironment> = environments
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
        let envvarsEnvironment: IEnvironment = new Environment(
            process.env.CDK_DEFAULT_ENVIRONMENT!,
            process.env.CDK_DEFAULT_ACCOUNT!,
            process.env.CDK_DEFAULT_NAME!,
            process.env.CDK_DEFAULT_REGION!
        )
        if (!ruleMet && envvarsEnvironment)
            finalEnv.push(envvarsEnvironment)

        return finalEnv
    }
    /**
     * Get the stack default tags
     *
     * @returns The stack default tags
     */
    public getAllTags(tags: Array<ITag>): Array<ITag> {
        let defaultTags: Array<ITag> = []
        defaultTags.push({name: 'author', value: this.projectAuthor })
        defaultTags.push({name: 'project', value: this.projectName })
        defaultTags.push({name: 'description', value: this.projectDescription })
        defaultTags.push({name: 'version', value: this.projectVersion })
        defaultTags.push({name: 'docs', value: this.projectDocs })
        defaultTags.push({name: 'src', value: this.projectRepository.url })
        return defaultTags.concat(tags)
    }
    /**
     * Get the CDK stack context properties
     *
     * @param name The CDK stack name
     * @returns The CDK stack context properties
     */
    public getStackProps(name: string): IStack {
        let contextProperties: IStack
        let stacks: Array<IStack> = this.stacks.filter((stackProps: IStack): boolean => stackProps.stackName == name)
        if (stacks.length) {
            contextProperties = stacks[0]
        } else {
            throw new NoSuchParameterValueError('name', name)
        }

        return contextProperties
    }
}
