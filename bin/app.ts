import { App } from 'aws-cdk-lib';
import IConfig from '../lib/utils/interface-config';
import ConfigJSON from '../lib/utils/config-json';
import StorageStack from '../lib/storage-stack';

const app: App = new App();
// @todo check if the config contains ``S3Construct``, begin by returning Stack instead of IStack in getStacks
const config: IConfig = new     ConfigJSON(app);

StorageStack.deploy(app, config)
