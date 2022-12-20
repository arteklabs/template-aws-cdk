import { App } from 'aws-cdk-lib';
import IConfig from '../lib/utils/interface-config';
import ConfigJSON from '../lib/utils/config-json';
import StorageStack from '../lib/storage-stack';

const app: App = new App();
const config: IConfig = new ConfigJSON(app);

new StorageStack(app, config)