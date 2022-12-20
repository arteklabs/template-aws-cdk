import { Stack, Tags } from "aws-cdk-lib";
import { Construct } from "constructs";
import { IStack, ITag } from "./type";

export default abstract class BaseStack extends Stack {
    public readonly props: IStack
    constructor(scope: Construct, props: IStack) {
        super(scope)
        this.props = props
        this.tag()
    }
    /**
     * Tag stack according to the context properties in ``IConfig``
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
        let tags: Array<ITag> = this.props.tags
        tags.forEach((tag: ITag): void => {
            Tags.of(this).add(tag.name, tag.value);
        })
    }
}