/**
 * Normalizes a string by replacing multiple-instances
 * of parameter `s` with the singular-instance.
 * ex. "///path//to/my//endpoint//".normalize('/') => "/path/to/my/endpoint/"
 */
String.prototype.normalize = function(s) {
    return this.replace(new RegExp(s + "+", "gm"), s);
};

String.prototype.trimBoth = function(s) {
	return this.replace(new RegExp("^" + s + "+|" + s + "+$", "gm"), "");
}

String.prototype.trimStart = function(s) {
	return this.replace(new RegExp("^" + s + "+", "gm"), "");
}

String.prototype.trimEnd = function(s) {
	return this.replace(new RegExp(s + "+$", "gm"), "");
}
