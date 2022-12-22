import { NoSuchParameterValueError } from "../error/error"
import * as s3 from 'aws-cdk-lib/aws-s3';
import { RemovalPolicy } from "aws-cdk-lib";
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

type IRepository = {
    readonly type: string
    readonly url: string
}

class Repository implements IRepository {
    public readonly type: string
    public readonly url: string
    constructor(type: string, url: string) {
        this.type = type
        this.url = url
    }
}

type IContributors  = {
    readonly name: string
    readonly email: string
    readonly url: string
}

class Contributors implements IContributors {
    public readonly name: string
    public readonly email: string
    public readonly url: string
    constructor(name: string, email: string, url: string) {
        this.name = name
        this.email = email
        this.url = url
    }
}

type ITag = {
    readonly name: string,
    readonly value: string
}

class Tag implements ITag {
    public readonly name: string
    public readonly value: string
    constructor(name: string, value: string) {
        this.name = name
        this.value =value
    }
}

/**
 * Valid values/data types for ``cdk.json``
 */
type IConstruct = {
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
    toS3Construct(): Constructs
}

class Construct implements IConstruct {
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
    toS3Construct(): S3Construct {
        return new S3Construct(
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
}

export class S3Construct extends Construct {
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
     * The bucket name is defined according to the following expression:
     * 
     * {bucketName}-{accountId}
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
        if (!this.autoDeleteObjects)
            throw new NoSuchParameterValueError('autoDeleteObjects', '')
        return this.autoDeleteObjects
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
        if (!this.versioned)
            throw new NoSuchParameterValueError('versioned', '')
        return this.versioned
    }

    getBucketProps(): BucketProps {
        return {
            bucketName: this.getBucketName(),
            blockPublicAccess: this.getBlockPublicAccess(),
            removalPolicy: this.getRemovalPolicy(),
            autoDeleteObjects: this.getAutoDeleteObjects(),
            objectOwnership: this.getObjectOwnership(),
            versioned: this.getVersioned(),
        }
    }
}

export type Constructs = S3Construct

/**
 * Specification for `cdk.json` and `package.json` static configuration fields 
 * regarding the project's stacks information.
 */
type IStack = {
    readonly stackName: string,
    readonly id: string,
    readonly description: string,
    /**
     * The stack tags.
     * 
     * The stack tags are editable at runtime.
     */
    tags: Array<ITag>,
    readonly constructs: Array<IConstruct>,
    /**
     * The environments the stack is to be deployed to
     * 
     * The stack environments are editable at runtime.
    */
    environments: Array<IEnvironment>,
    /**
     * The AWS account of deployment for the stack
     */
    readonly account: string,
    /**
     * The region in the AWS account of deployment for the stack
     */
    readonly region: string,
    getConstruct(service: AWSService, name: string): S3Construct
}

class Stack implements IStack {
    public readonly stackName: string
    public readonly id: string
    public readonly description: string
    public tags: Array<ITag>
    public readonly constructs: Array<IConstruct>
    public environments: Array<IEnvironment>
    /**
     * The AWS account of deployment for the stack
     */
    public readonly account: string
    /**
     * The region in the AWS account of deployment for the stack
     */
    public readonly region: string
    constructor(stackName: string, id: string, description: string, tags: Array<ITag>, constructs: Array<IConstruct>, environments: Array<IEnvironment>, account: string, region: string) {
        this.stackName = stackName
        this.id = id
        this.description = description
        this.tags = tags
        this.constructs = constructs
        this.environments = environments
        this.account = account
        this.region = region
    }
    getConstruct(service: AWSService, id: string): Constructs {
        let construct: IConstruct
        let constructs: Array<IConstruct> = this.constructs.filter((constructData: IConstruct) => {
            constructData.service == service && constructData.id == id
        })

        if (constructs.length) {
            construct = constructs[0]
        } else {
            throw new NoSuchParameterValueError('service/id', `${service}/${id}`)
        }

        // cast to appropriate construct class
        let serviceConstruct: Constructs
        switch(construct.service) {
            case "aws::s3": {
                serviceConstruct = construct.toS3Construct()
                break;
            }
            default: {
                throw new NoSuchParameterValueError('service', service)
             }
        }
        return serviceConstruct
    }
}

type IEnvironment = {
    readonly environment: string,
    readonly account: string,
    readonly name: string,
    readonly region: string
}

class Environment implements IEnvironment {
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
}


export { Dictionary, CDKContext, IContributors, IRepository, ITag, IEnvironment, IConstruct, IStack, Stack, Construct, Tag, Environment, Repository, Contributors }
