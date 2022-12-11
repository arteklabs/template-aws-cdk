import { Stack, StackProps, aws_s3 as s3 } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import config from './utils/Config'
class StorageStack extends Stack {

  public readonly bucket: s3.Bucket
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.bucket = new s3.Bucket(this, config.getBucketName(), config.getBucketProps());
  }
}

export default StorageStack;