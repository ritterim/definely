import {Get, Post, Put, Patch, Delete} from '../siren/attributes'
    
@Get('testApi/:id')
export default class TestApi {
    constructor(id=0,parmNumber=0,parmString='',parmFloat=0.0) {
        this.id = id
        this.parmNumber = parmNumber
        this.parmString = parmString
        this.parmFloat = parmFloat
    }
    
    get id() {return this.id_ = this.id_ || 0 }
    set id(value:number) { this.id_ = value }
    
    get parmNumber() { return this.parmNumber_ = this.parmNumber_ }
    set parmNumber(value:number) { this.parmNumber_ = value}
    
    get parmString() { return this.parmString_ = this.parmString_}
    set parmString(value:string) { this.parmString_ = value}
    
    get parmFloat() { return this.parmFloat_ = this.parmFloat_ }
    set parmFloat(value:number) { this.parmFloat_ = value}
    
    @Post('postUrl2')
    postMethod() {
    }
    
    @Put('putUrl2')
    putMethod(a) {
    }
    
    @Patch('patchUrl2')
    patchMethod(b,c) {
    }
    
    @Delete('deleteUrl2') 
    deleteMethod(d,e,f) {
    }
}
