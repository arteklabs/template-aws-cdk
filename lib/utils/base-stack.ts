import { Stack, Tags } from "aws-cdk-lib";
import { Construct } from "constructs";
import { IStackProps, ITagProps } from "./type";

export default abstract class BaseStack extends Stack {
    public readonly props: IStackProps
    constructor(scope: Construct, props: IStackProps) {
        super(scope, props.id, props.toCdkLibStackProps())
        this.props = props
        this.tag()
    }
    /**
     * Tag stack according to the context properties
     *
     * Stacks
     * ------
     *
     * @example
     *
     * {
     *    "stackName": "network-stack",
     *    "id": "NetworkStack",
     *    "description": "VPC, EC2 Subnets",
     *    "tags": {
     *        "tag": "unique to network-stack"
     *    }
     * }
     *
     * @param config The config with all the CDK deployment context parameters
     * @param stack The CDK stack
     */
    public tag() {
        let tags: Array<ITagProps> = this.props.tags
        tags.forEach((tag: ITagProps): void => {
            Tags.of(this).add(tag.name, tag.value);
        })
    }
}