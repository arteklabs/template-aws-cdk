import npm_data from '../../package.json'
import { App } from "aws-cdk-lib"
import Config from "./config"
import { IContributorsProps, IEnvironmentProps, IRepositoryProps, IStackProps, ITagProps } from "./type"

/**
 * @summary
 *
 * ``ConfigJSON`` specifies configuration parameters for the CDK app specified in the static configurations ``package.json`` and ``cdk.json``.
 */
export default class ConfigJSON extends Config {

    /**
     * @summary
     *
     * ``ConfigJSON`` specifies configuration parameters for the CDK app
     * specified in the static configurations ``package.json`` and ``cdk.json``.
     */
    // @ts-ignore
    constructor(app: App) {
        let projectAuthor: string = npm_data.author
        let projectContributors: Array<IContributorsProps> = npm_data.contributors
        let projectEngines: { node: string } = npm_data.engines
        let projectOS: Array<string> = npm_data.os
        let projectBugs: string = npm_data.bugs
        let projectKeywords: Array<string> = npm_data.keywords
        let projectName: string = npm_data.name
        let projectVersion: string = npm_data.version
        let projectDescription: string = npm_data.description
        let projectRepository: IRepositoryProps = npm_data.repository
        let projectDocs: string = npm_data.homepage
        let tags: Array<ITagProps> = app.node.tryGetContext("tags")
        let environments: Array<IEnvironmentProps> = app.node.tryGetContext("environments")
        let stacks: Array<IStackProps> = app.node.tryGetContext("stacks")

        super(
            app,
            projectAuthor,
            projectContributors,
            projectOS,
            projectBugs,
            projectKeywords,
            projectEngines,
            projectName,
            projectDescription,
            projectVersion,
            projectRepository,
            projectDocs,
            tags,
            stacks,
            environments
        )
    }
}
