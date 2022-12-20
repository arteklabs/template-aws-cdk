import { Construct } from 'constructs';
import IConfig from './utils/interface-config';
import BaseStack from './utils/base-stack';
import { IStack } from './utils/type';
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
  }
}
