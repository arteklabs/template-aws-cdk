import { NoSuchParameterValueError } from "../error/error"
import * as s3 from 'aws-cdk-lib/aws-s3';
import { RemovalPolicy, StackProps } from "aws-cdk-lib";
import { BucketProps } from "aws-cdk-lib/aws-s3";

type Dictionary = { [key: string]: Object }
type CDKContext = string | Array<Dictionary> | Dictionary | Array<{
    name: string,
    email: string,
    url: string
}> | { node: string } | Array<string> | { type: string, url: string } | never

/**
 * Values in ``cdk.json``
 */
export type AWSService = "aws::s3" | "aws::lambda" | "aws::vpc"
export type S3PropsBlockPublicAccess = "BLOCK_ALL"
export type S3PropsRemovalPolicy = "DESTROY" | "RETAIN" | "SNAPSHOT"
export type S3PropsAutoDeleteObjects = boolean
export type S3PropsObjectOwnership = "BUCKET_OWNER_ENFORCED" | "BUCKET_OWNER_PREFERRED" | "OBJECT_WRITER"
export type S3PropsVersioned = boolean

/** used to deploy the app to a single environment */
export type CDKParamEnvironment = "environment"

type IRepositoryProps = {
    readonly type: string
    readonly url: string
}

class RepositoryProps implements IRepositoryProps {
    public readonly type: string
    public readonly url: string
    constructor(type: string, url: string) {
        this.type = type
        this.url = url
    }
}

type IContributorsProps  = {
    readonly name: string
    readonly email: string
    readonly url: string
}

class ContributorsProps implements IContributorsProps {
    public readonly name: string
    public readonly email: string
    public readonly url: string
    constructor(name: string, email: string, url: string) {
        this.name = name
        this.email = email
        this.url = url
    }
}

type ITagProps = {
    readonly name: string,
    readonly value: string,
    /**
     * Return a new ``ITagProps`` with the same ``name`` and ``value``.
     */
    clone(): ITagProps
}

class TagProps implements ITagProps {
    public readonly name: string
    public readonly value: string
    constructor(name: string, value: string) {
        this.name = name
        this.value =value
    }
    clone(): TagProps {
        return new TagProps(
            this.name,
            this.value
        )
    }
}

/**
 * Valid values/data types for ``cdk.json``
 */
type IConstructProps = {
    readonly id: string,
    readonly service: AWSService,
    readonly bucketName?: string,
    readonly blockPublicAccess?: S3PropsBlockPublicAccess,
    readonly removalPolicy?: S3PropsRemovalPolicy,
    readonly autoDeleteObjects?: S3PropsAutoDeleteObjects,
    readonly objectOwnership?: S3PropsObjectOwnership,
    readonly versioned?: S3PropsVersioned,
    getId(): string,
    getService(): string,
    toS3Construct(): ConstructsProps,
    clone(): IConstructProps
}

class ConstructProps implements IConstructProps {
    public readonly id: string
    public readonly service: AWSService
    public readonly bucketName?: string
    public readonly blockPublicAccess?: S3PropsBlockPublicAccess
    public readonly removalPolicy?: S3PropsRemovalPolicy
    public readonly autoDeleteObjects?: S3PropsAutoDeleteObjects
    public readonly objectOwnership?: S3PropsObjectOwnership
    public readonly versioned?: S3PropsVersioned
    constructor(id: string, service: AWSService, bucketName: string, blockPublicAccess: S3PropsBlockPublicAccess,  removalPolicy: S3PropsRemovalPolicy, autoDeleteObjects: S3PropsAutoDeleteObjects, objectOwnership: S3PropsObjectOwnership,  versioned: S3PropsVersioned) {
        this.id = id
        this.service = service
        this.bucketName = bucketName
        this.blockPublicAccess = blockPublicAccess
        this.removalPolicy = removalPolicy
        this.autoDeleteObjects = autoDeleteObjects
        this.objectOwnership = objectOwnership
        this.versioned = versioned
    }
    getId(): string {
        return this.id
    }
    getService(): string {
        return this.service.toString()
    }

    /**
     * Convert this Construct to an S3Construct
     * @returns
     */
    toS3Construct(): S3ConstructProps {
        return new S3ConstructProps(
            this.id,
            this.service,
            this.bucketName!,
            this.blockPublicAccess!,
            this.removalPolicy!,
            this.autoDeleteObjects!,
            this.objectOwnership!,
            this.versioned!
        )
    }
    clone(): ConstructProps {
        let newConstruct: ConstructProps = new ConstructProps(
            this.id,
            this.service,
            this.bucketName!,
            this.blockPublicAccess!,
            this.removalPolicy!,
            this.autoDeleteObjects!,
            this.objectOwnership!,
            this.versioned!
        )
        return newConstruct
    }
}

export class S3ConstructProps extends ConstructProps {
    constructor(id: string, service: AWSService, bucketName: string, blockPublicAccess: S3PropsBlockPublicAccess,  removalPolicy: S3PropsRemovalPolicy, autoDeleteObjects: S3PropsAutoDeleteObjects, objectOwnership: S3PropsObjectOwnership,  versioned: S3PropsVersioned) {
        super(id,
        service,
        bucketName,
        blockPublicAccess,
        removalPolicy,
        autoDeleteObjects,
        objectOwnership,
        versioned)
    }
    getId(): string {
        return this.id
    }
    getService(): string {
        return this.service.toString()
    }
    /**
     * Get the bucket name
     *
     * @returns The bucket name
     */
    getBucketName(): string {
        if (!this.bucketName) {
            throw new NoSuchParameterValueError('bucketName', '')
        }
        return this.bucketName
    }
    getBlockPublicAccess(): s3.BlockPublicAccess {
        if (!this.blockPublicAccess) {
            throw new NoSuchParameterValueError('blockPublicAccess', '')
        }
        let result: s3.BlockPublicAccess
        switch(this.blockPublicAccess) {
            case "BLOCK_ALL": {
               result = s3.BlockPublicAccess.BLOCK_ALL
               break;
            }
            default: {
               result = s3.BlockPublicAccess.BLOCK_ALL
               break;
            }
         }
         return result
    }
    getRemovalPolicy(): RemovalPolicy {
        if (!this.removalPolicy) {
            throw new NoSuchParameterValueError('removalPolicy', '')
        }
        let result: RemovalPolicy
        switch(this.removalPolicy) {
            case "DESTROY": {
               result = RemovalPolicy.DESTROY
               break;
            }
            case "RETAIN": {
               result = RemovalPolicy.RETAIN
               break;
            }
            case "SNAPSHOT": {
               result = RemovalPolicy.SNAPSHOT
               break;
            }
            default: {
               result = RemovalPolicy.DESTROY
               break;
            }
         }
         return result
    }
    getAutoDeleteObjects(): boolean {
        return this.autoDeleteObjects!
    }
    getObjectOwnership(): s3.ObjectOwnership {
        if (!this.objectOwnership)
            throw new NoSuchParameterValueError('objectOwnership', '')
        let result: s3.ObjectOwnership
        switch(this.objectOwnership) {
            case "BUCKET_OWNER_ENFORCED": {
               result = s3.ObjectOwnership.BUCKET_OWNER_ENFORCED
               break;
            }
            case "BUCKET_OWNER_PREFERRED": {
               result = s3.ObjectOwnership.BUCKET_OWNER_PREFERRED
               break;
            }
            case "OBJECT_WRITER": {
               result = s3.ObjectOwnership.OBJECT_WRITER
               break;
            }
            default: {
               result = s3.ObjectOwnership.BUCKET_OWNER_ENFORCED
               break;
            }
         }
         return result
    }
    getVersioned(): boolean {
        return this.versioned!
    }

    getBucketProps(): BucketProps {
        let bucketProps: BucketProps = {
            bucketName: this.getBucketName(),
            blockPublicAccess: this.getBlockPublicAccess(),
            removalPolicy: this.getRemovalPolicy(),
            autoDeleteObjects: this.getAutoDeleteObjects(),
            objectOwnership: this.getObjectOwnership(),
            versioned: this.getVersioned(),
        }
        return bucketProps
    }
    public clone(): S3ConstructProps {
        let newConstruct: S3ConstructProps = new S3ConstructProps(
            this.id,
            this.service,
            this.bucketName!,
            this.blockPublicAccess!,
            this.removalPolicy!,
            this.autoDeleteObjects!,
            this.objectOwnership!,
            this.versioned!
        )
        return newConstruct
    }
}

export type ConstructsProps = S3ConstructProps

/**
 * Specification for `cdk.json` and `package.json` static configuration fields
 * regarding the project's stacks information.
 */
type IStackProps = {
    readonly stackName: string,
    readonly id: string,
    readonly description: string,
    /**
     * The stack tags.
     *
     * The stack tags are editable at runtime and can be of types
     * ``Array<ITagProps>`` or ``{ [key: string]: string }``. The former is
     * used for the internal cdk app configuration, the latter is used to
     * initialize a new ``aws-cdk-lib.StackProps``. The type of ``tags``
     * can only be changed by the method ``tagsToCdkLibTags``.
     */
    tags: Array<ITagProps>,
    /**
     * The stack constructs.
     */
    readonly constructs: Array<IConstructProps>,
    /**
     * The environments the stack is to be deployed to
     *
     * The stack environments are editable at runtime.
    */
    environments: Array<IEnvironmentProps>,
    /**
     * The AWS account of deployment for the stack
     *
     * The stack account can only be known at runtime, as the same stack can be
     * deployed to multiple environments during runtime.
     */
    account: string,
    /**
     * The region in the AWS account of deployment for the stack
     *
     * The stack account can only be known at runtime, as the same stack can be
     * deployed to multiple environments during runtime.
     */
    region: string,
    getConstruct(service: AWSService, name: string): IConstructProps
    /**
     * Deep clone these stack props
     */
    clone(): IStackProps
    /**
     * Convert the ``StackProps`` to ``aws-cdk-lib.StackProps``.
     * 
     * Example
     * -------
     * 
     * Initializing a stack, convert the stack properties to the CDK lib 
     * ``StackProps``:
     * 
     * .. code:: typescript
     * 
     *    stackProps.toCdkLibStackProps()
     *
     * @returns The stack properties as expected by the CDK lib
     */
    toCdkLibStackProps(): StackProps
}

type IEnvironmentProps = {
    readonly environment: string,
    readonly account: string,
    readonly name: string,
    readonly region: string,
    clone(): IEnvironmentProps
}

class EnvironmentProps implements IEnvironmentProps {
    public readonly environment: string
    public readonly account: string
    public readonly name: string
    public readonly region: string
    constructor(environment: string, account: string, name: string, region: string) {
        this.environment = environment
        this.account = account
        this.name = name
        this.region = region
    }
    clone(): EnvironmentProps {
        return new EnvironmentProps(
            this.environment,
            this.account,
            this.name,
            this.region
        )
    }
}


export { Dictionary, CDKContext, IContributorsProps, IRepositoryProps, ITagProps, IEnvironmentProps, IConstructProps, IStackProps, ConstructProps, TagProps, EnvironmentProps, RepositoryProps, ContributorsProps }
