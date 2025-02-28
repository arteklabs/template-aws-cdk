import { Construct } from 'constructs';
import IConfig from './utils/interface-config';
import BaseStack from './utils/base-stack';
import { IStackProps } from './utils/type';
export default class NetworkStack extends BaseStack {
  /**
   * 
   * @param scope 
   * @param props 
   */
  constructor(scope: Construct, config: IConfig) {
    let stackName: string ="network-stack"
    let props: IStackProps = config.getStackProps(stackName) 
    super(scope,  props)
  }
}
