import { App } from 'aws-cdk-lib';
import { CDKContext } from './type';
import { NoSuchParameterValueError } from '../error/error'

/**
 * Capitalize the first letter of the ``str``
 *
 * @param string The string
 * @returns The ``str`` with the first letter in upper case.
 */
function upperCaseFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Get the AWS CLI profile Account ID
 *
 * Gets the AWS profile account ID from ``~/.aws/config``
 *
 * @param profile The AWS CLI profile name
 * @returns Get the AWS CLI profile Account ID
 */
function getAWSProfileAccountId(profile: string ): string {
    let accountId : string = "TODO: get account id from ``~/.aws/config``"
    profile
    return accountId
}
/**
 * Get the CDK deployment environment properties
 *
 * @param app The CDK deployment app
 * @param prop The CDK deployment context property
 */
// @ts-ignore
function _getCDKCtxDeploymentEnvProps(app: App, prop: string): CDKContext {
    let propValue: CDKContext
    let env: string = app.node.tryGetContext(prop).toString()
    if (['dev', 'release', 'latest'].includes(env)) {
        let upEnv: string = upperCaseFirstLetter(env)
        propValue = app.node.tryGetContext(`env${upEnv}`)
    } else {
        throw new NoSuchParameterValueError(prop, env)
    }
    return propValue
}

export { getAWSProfileAccountId }






