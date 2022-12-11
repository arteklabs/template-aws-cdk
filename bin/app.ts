import * as cdk from 'aws-cdk-lib';
import StorageStack from '../lib/storage-stack';
import config from '../lib/utils/Config';

const app = new cdk.App();

new StorageStack(app, config.getStackId("storage"))