type Dictionary = { [key: string]: Object }
type CDKContext = string | Array<Dictionary> | Dictionary | Array<{
    name: string,
    email: string,
    url: string
}> | { node: string } | Array<string> | { type: string, url: string } | never

// TODO
// type CDKDeploymentEnvironment = 'dev' | 'release' | 'latest'
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


type IConstruct = {
    readonly service: string,
    readonly bucketName?: string
}

class Construct implements IConstruct {
    public readonly service: string
    public readonly bucketName?: string
    constructor(service: string, bucketName?: string) {
        this.service = service
        this.bucketName = bucketName
    }
}

/**
 * Specification for `cdk.json` and `package.json` static configuration fields 
 * regarding the project's stacks information.
 */
type IStack = {
    readonly stackName: string,
    readonly id: string,
    readonly description: string,
    readonly tags: Array<ITag>,
    readonly constructs: Array<IConstruct>,
    readonly environments: Array<IEnvironment>,
}

class Stack implements IStack {
    public readonly stackName: string
    public readonly id: string
    public readonly description: string
    public readonly tags: Array<ITag>
    public readonly constructs: Array<IConstruct>
    public readonly environments: Array<IEnvironment>
    constructor(stackName: string, id: string, description: string, tags: Array<ITag>, constructs: Array<IConstruct>, environments: Array<IEnvironment>) {
        this.stackName = stackName
        this.id = id
        this.description = description
        this.tags = tags
        this.constructs = constructs
        this.environments = environments
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
