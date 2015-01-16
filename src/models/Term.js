
export default class Term {
    constructor() {}
    
    get id() {return this.id_ = this.id_ || 0 }
    set id(value:number) { this.id_ = value }
    
    get term() { return this.term_ = this.term_ || '' }
    set term(value:string) { this.term_ = value}
    
    get tags() { return this.tags_ = this.tags_ || []}
    set tags(value:Array<string>) { this.tags_ = value}
    
    get definition() { return this.definition_ = this.definition_ || ''}
    set definition(value:string) { this.definition_ = value}
}