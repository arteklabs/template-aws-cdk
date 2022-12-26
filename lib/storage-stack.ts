import { Construct } from 'constructs';
import IConfig from './utils/interface-config';
import BaseStack from './utils/base-stack';
import { EnvironmentProps, IStackProps, S3ConstructProps } from './utils/type';
import StackProps from "./utils/stack-props";
import * as s3 from 'aws-cdk-lib/aws-s3';
import { BucketProps } from 'aws-cdk-lib/aws-s3';

export default class StorageStack extends BaseStack {
  public static getStackName() : string {
    return "storage-stack"
  }
  /**
   * 
   * @param scope 
   * @param props 
   */
  constructor(scope: Construct, props: StackProps) {
    super(scope,  props)

    // S3 buckets
    let source: S3ConstructProps = (props.getConstruct("aws::s3", "source") as S3ConstructProps)
    let id: string = source.getId()
    let sourceBucketProps: BucketProps = source.getBucketProps()

    // @ts-ignore
    let sourceBucket: s3.Bucket = new s3.Bucket(this, id, sourceBucketProps)

    let target: S3ConstructProps = (props.getConstruct("aws::s3", "target") as S3ConstructProps)
    id = target.getId()
    let targetBucketProps: BucketProps = target.getBucketProps()

    // @ts-ignore
    let targetBucket: s3.Bucket = new s3.Bucket(this, id, targetBucketProps)
  }

  public static deploy(scope: Construct, config: IConfig): void {
    let props: IStackProps = config.getStackProps(StorageStack.getStackName()) 
    props.environments.forEach((environment: EnvironmentProps): void => {
      let newProps: StackProps = props.clone()
      newProps.account = environment.account
      newProps.region = environment.region
      new StorageStack(scope, newProps)
    })
  }
}
