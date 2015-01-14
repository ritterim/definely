class Error {
	constructor(error) {
		this.error = error;
	}

	get error() {
		return this.constructor.name + ': ' + this._error
	}

	set error(value) {
		this._error = value;
	}

	toString() {
		return this.error;
	}
}

class ArgumentError extends Error {
	constructor(value) {
		super(value)
	}
}


export class TypeError extends Error {
	constructor(value) {
		super(value)
	}
}


export class NullError extends Error {
	constructor(value) {
		super(value)
	}
}