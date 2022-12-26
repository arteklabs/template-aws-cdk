import { NoSuchParameterValueError } from "../error/error";
import { IStackProps, ITagProps, IConstructProps, IEnvironmentProps, AWSService, ConstructProps, TagProps, EnvironmentProps } from "./type";
import { StackProps as CdkStackProps }  from 'aws-cdk-lib'

export default class StackProps implements IStackProps {
    public readonly stackName: string;
    public readonly id: string;
    public readonly description: string;
    public tags: Array<ITagProps>;
    public readonly constructs: Array<IConstructProps>;
    public environments: Array<IEnvironmentProps>;
    /**
     * The AWS account of deployment for the stack
     *
     * The stack account can only be known at runtime, as the same stack can be
     * deployed to multiple environments during runtime.
     */
    public account: string;
    /**
     * The region in the AWS account of deployment for the stack
     *
     * The stack account can only be known at runtime, as the same stack can be
     * deployed to multiple environments during runtime.
     */
    public region: string;
    constructor(stackName: string, id: string, description: string, tags: Array<ITagProps>, constructs: Array<IConstructProps>, environments: Array<IEnvironmentProps>, account: string, region: string) {
        this.stackName = stackName;
        this.id = id;
        this.description = description;
        this.tags = tags;
        this.constructs = constructs;
        this.environments = environments;
        this.account = account;
        this.region = region;
    }
    getConstruct(service: AWSService, id: string): IConstructProps {
        let construct: IConstructProps;
        let constructs: Array<IConstructProps> = this.constructs.filter((constructData: IConstructProps): boolean => constructData.service == service && constructData.id == id
        );

        if (constructs.length) {
            construct = constructs[0];
        } else {
            throw new NoSuchParameterValueError('service/id', `${service}/${id}`);
        }

        return construct;
    }
    public clone(): StackProps {
        let newConstructs: Array<ConstructProps> = this.constructs.map((construct: ConstructProps): ConstructProps => construct.clone());
        let newTags: Array<TagProps> = this.tags.map((tag: TagProps): TagProps => tag.clone());
        let newEnvironments = this.environments.map((environment: EnvironmentProps): EnvironmentProps => { return environment.clone(); });
        let newStack: StackProps = new StackProps(
            this.stackName,
            this.id,
            this.description,
            newTags,
            newConstructs,
            newEnvironments,
            this.account,
            this.region
        );
        return newStack;
    }
    /**
     * Convert the tags ``Array<ITagProps>`` to ``aws-cdk-lib.StackProps`` tags
     * so ``IStackProps`` can be passed to ``aws-cdk-lib.Stack``
     * 
     * @returns The stack properties as expected by the CDK lib
     */
    toCdkLibStackProps(): CdkStackProps {
        let tags: { [key: string]: string } = {}
        this.tags.forEach((tag: ITagProps): void => {
            tags[tag.name] = tag.value
        })
        let stackProps: CdkStackProps = {
            description: this.description,
            stackName: this.stackName,
            env: { account: this.account, region: this.region},
            tags: tags
        }
        return stackProps
    }
}
