import config_static from '../assets/config.json'

/**
 * An ``IConfig`` is a config object containing all static values that
 * configure a CDK app. The config values include:
 *
 * * values declared as-is in a config source file;
 * * combination of values declared as-is in a config source file;
 * * values extracted from the cdk app build environment;
 * * combination of values declared as-is in a config source file and values
 * extracted from the cdk app build environment;
 *
 */
interface IConfig {

    // the bucket name
    getBucketName(): string

    // the bucket properties
    getBucketProps(): Object

    getStackId(stack: string): string
}

/**
 * The ``ConfigJSON`` class initializes an ``IConfig`` from a JSON file.
 */
class ConfigJSON implements IConfig {

    private config: any

    constructor() {
        this.config = config_static
    }

    /**
     *
     * @returns The bucket name
     */
    public getBucketName(): string {
        let name: string = this.config['resource']["s3"]["name"]
        let stack: string = this.config['stack']["storage"]["deployment_id"]
        let project: string = this.config['project']["name_internal"]
        let version: string = this.config['project']["version"]

        let bucketName: string = `${name}-${stack}-${project}-${version}`
        bucketName = bucketName.toLowerCase()

        return bucketName
    }

    /**
     *
     * @returns The bucket properties
     */
    public getBucketProps(): Object {
        let props: Object = {
            "bucketName": this.getBucketName(),
            "versioned": this.config['resource']['s3']["props"]["versioned"]
        }

        return props
    }


    /**
     * Stacks
     * ------
     *
     * * ``storage`` The stack containing storage infrastructure
     *
     * @param stack The stack name (see options)
     * @returns The stack deployment ID
     */
    public getStackId(stack: string): string {
        return this.config['stack'][stack]["deployment_id"]
    }
}

let config: IConfig = new ConfigJSON()

export default config;