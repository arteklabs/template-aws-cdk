import { App } from "aws-cdk-lib";
import { IContributorsProps, IEnvironmentProps, IRepositoryProps, IStackProps, ITagProps } from "./type";

/**
 * @summary
 *
 * ``IConfig`` specifies configuration parameters for the CDK app. Static
 * configuration parameters can be specified in static configuration
 * files like ``package.json``, ``cdk.json``, ``cdk.context.json``, etc.
 * Dynamic configuration parameters are induced from the build runtime.
 *
 * It is recommended to initialized a ``IConfig`` once from a module that all
 * components can access, *e.g.*: ``lib/utils/appconfig``
 */
export default interface IConfig {
    /**
     * The project author
     */
    readonly projectAuthor: string
    /**
     * The project contributors
     */
    readonly projectContributors: Array<IContributorsProps>
    /**
     * The project engines versions
     */
    readonly projectEngines: { node: string }
    /**
     * The project running OS
     */
    readonly projectOS: Array<string>
    /**
     * The project bugs/issue tracker page
     */
    readonly projectBugs: string
    /**
     * The project keywords
     */
    readonly projectKeywords: Array<string>
    /**
     * The project name
     */
    readonly projectName: string
    /**
     * The project version
     */
    readonly projectVersion: string
    /**
     * The project description
     */
    readonly projectDescription: string
    /**
     * The project remote repository url
     */
    readonly projectRepository: IRepositoryProps
    /**
     * The project docs url
     */
    readonly projectDocs: string
    /**
     * The project's CDK Stacks configuration
     */
    readonly stacks: Array<IStackProps>
    /**
     * The project's CDK Stacks tags
     */
    readonly tags: Array<ITagProps>
    /**
     * The project's CDK environments.
     */
    readonly environments: Array<IEnvironmentProps>
    /**
     * Get the CDK stack context properties
     *
     * @param name The CDK stack name
     * @returns The CDK stack context properties
     */
    getStackProps(name: string): IStackProps;
    getAllTags(tags: Array<ITagProps>): Array<ITagProps>;
    getEnvironments(app: App, environments: Array<IEnvironmentProps>): Array<IEnvironmentProps>
}