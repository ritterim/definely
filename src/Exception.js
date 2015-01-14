export class Error {
	constructor(error)
	{
		this.error = error
	}
	
	set error(value) { 
		this.error_ = value 
	}
	get error = function() { return this.constructor.name + ': ' + this.error_ } 
	
	this.toString = () => this.error
}

export class ArgumentError extends Error {
	constructor(value) { super(value) }
}


export class TypeError extends Error {
	constructor(value) { super(value) }
}


export class NullError extends Error {
	constructor(value) { super(value) }
}
