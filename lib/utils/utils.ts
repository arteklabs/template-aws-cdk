import { Tags, Stack } from 'aws-cdk-lib';
import config from './config';

/**
 * Tag a stack
 * @param stack 
 */
function tagStack(stack: Stack) {
    let tags: Object = config.getStackTags()
    Object.entries(tags).forEach(([tag, value], _) => {
        Tags.of(stack).add(tag, value);
        
    })
}

export { tagStack }