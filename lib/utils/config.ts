import IConfig from './interface-config';
import { IContributors, IEnvironment, IRepository, IStack, ITag } from './type';
import { NoSuchParameterValueError } from '../error/error';
import { App } from 'aws-cdk-lib';

/**
 * @summary
 *
 * ``Config`` specifies configuration parameters for the CDK app. Static
 * configuration parameters can be specified in static configuration
 * files like ``package.json``, ``cdk.json``, ``cdk.context.json``, etc.
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
     *
     * @default {} The environments are either defined (``n-1`` takes
     * precedence over ``n``):
     *
     * 1. passed as environment variables (@todo)
     * 2. passed as CLI arguments (@todo)
     * 3 globally
     * 4. per stack (@todo)
     *
     * @example
     *
     * // environments defined globally
     * {
     *    "context": {
     *       "environments": {
     *           "dev": [
     *               {
     *                   "account": "12345678",
     *                   "name": "AWS-ACC-DEV",
     *                   "region": "eu-central-1"
     *               }
     *           ],
     *           "release": [
     *               {
     *                   "account": "789456123",
     *                   "name": "AWS-ACC-RELEASE",
     *                   "region": "eu-central-1"
     *               }
     *           ],
     *           "latest": [
     *               {
     *                   "account": "123789456",
     *                   "name": "AWS-ACC-LATEST",
     *                   "region": "eu-central-1"
     *               }
     *           ]
     *       }
     *    }
     * }
     *
     * // environments defined by stack
     * {
     *    "context": {
     *       "stacks": {
     *          "storage-stack": {
     *             "dev": [
     *                 {
     *                     "account": "12345678",
     *                     "name": "AWS-ACC-DEV",
     *                     "region": "eu-central-1"
     *                 }
     *             ],
     *             "release": [
     *                 {
     *                     "account": "789456123",
     *                     "name": "AWS-ACC-RELEASE",
     *                     "region": "eu-central-1"
     *                 }
     *             ],
     *             "latest": [
     *                 {
     *                     "account": "123789456",
     *                     "name": "AWS-ACC-LATEST",
     *                     "region": "eu-central-1"
     *                 }
     *           ]
     *          }
     *       }
     *    }
     * }
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
        this.stacks = stacks
        this.environments = this.getEnvironments(app, environments)
        // generate default project tags
        this.tags = this.getAllTags(tags)
    }
    /**
     * Get the project's deployment environments
     *
     * Apply rules of precedence:
     * 
     * 1. passed as environment variables (@todo)
     * 2. passed as CLI arguments:
     *      1. ``environment``
     *      2. ``account``
     *      3. ``name``
     *      4. ``region``
     * 3. globally ({ "context": { "environments" } })
     * 4. per stack ({ "context": { "stacks": { "environments" } } }) (@todo)
     *
     * It is required that the deployment host has the environments credentials.
     * 
     * @returns The CDK app deployment environments
     */
    public getEnvironments(app: App, environments: Array<IEnvironment>): Array<IEnvironment> {
        let finalEnv: Array<IEnvironment> = []
        let environment: string = app.node.tryGetContext("environment")
        let account: string = app.node.tryGetContext("account")
        let name: string = app.node.tryGetContext("name")
        let region: string = app.node.tryGetContext("region")

        // environment specification passed through CLI args
        if (environment && account && name && region)
            finalEnv = [{ environment, account, name, region }]
        // environment name specified at ``cdk.json`` passed through CLI args
        else if (environment)
            finalEnv = environments.filter((env: IEnvironment) => {
                env.environment == environment
            })
        // no environment specified by the CLI, deploy to all specified 
        // environments in ``cdk.json``
        else
            finalEnv = environments

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
