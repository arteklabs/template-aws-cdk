import { App } from 'aws-cdk-lib';
import StorageStack from '../lib/storage-stack';
import config from '../lib/utils/config';
import { tagStack } from '../lib/utils/utils';

const app = new App();

// init stacks
let storageStack : StorageStack = new StorageStack(app, config.getStackId("storage"))

// tag stacks
tagStack(storageStack)
