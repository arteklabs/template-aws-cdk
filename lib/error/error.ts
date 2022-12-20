/**
 * The error ``NoSuchParameterValueError`` means that a valid parameter has 
 * received an invalid parameter value.
 */
class NoSuchParameterValueError extends TypeError  {

    /**
     * The error ``NoSuchParameterValueError`` means that the valid ``param`` 
     * has received an invalid parameter ``value``.
     * 
     * @param param The CDK deployment parameter
     * @param value The CDK deployment parameter value
     */
    constructor(param: string, value: string) {
        super(`The parameter '${param}' doesn't admit the value '${value}'`);

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, NoSuchParameterValueError.prototype);
    }
}

export { NoSuchParameterValueError }