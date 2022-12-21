import { Construct } from 'constructs';
import IConfig from './utils/interface-config';
import BaseStack from './utils/base-stack';
import { IStack, S3Construct } from './utils/type';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { BucketProps } from 'aws-cdk-lib/aws-s3';
/**
 * The storage stack deploys two S3 buckets
 */
export default class StorageStack extends BaseStack {
  /**
   * 
   * @param scope 
   * @param props 
   */
  constructor(scope: Construct, config: IConfig) {
    let stackName: string ="storage-stack"
    let props: IStack = config.getStackProps(stackName) 
    super(scope,  props)

    // S3 buckets
    let source: S3Construct = props.getConstruct("aws::s3", "source")
    let id: string = source.getId()
    let sourceBucketProps: BucketProps = source.getBucketProps()

    // @ts-ignore
    let sourceBucket: s3.Bucket = new s3.Bucket(this, id, sourceBucketProps)

    let target: S3Construct = props.getConstruct("aws::s3", "target")
    id = target.getId()
    let targetBucketProps: BucketProps = target.getBucketProps()

    // @ts-ignore
    let targetBucket: s3.Bucket = new s3.Bucket(this, id, targetBucketProps)
  }
}
