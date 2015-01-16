export default function Errors() {}

Errors.invalidArg = format('invalid argument'),
Errors.nullArg = format('null argument'),
Errors.typeArg = expected('invalid argument type')

function expected(type) {
    return (variable, expected, actual) => type + ': var "' + variable + '", expected:' + expected + (actual ? ', actual:' + actual : '')
}

function format(type) {
    return variable => type + ': var ' + variable
}