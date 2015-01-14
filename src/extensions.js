String.prototype.trimBoth = function(s) {
	return this.replace(new RegExp("^" + s + "+|" + s + "+$", "gm"), "");
}

String.prototype.trimStart = function(s) {
	return this.replace(new RegExp("^" + s + "+", "gm"), "");
}

String.prototype.trimEnd = function(s) {
	return this.replace(new RegExp(s + "+$", "gm"), "");
}