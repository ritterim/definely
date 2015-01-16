import chai from 'chai'
var should = chai.should()

import Term from './Term'

var typeError = /has to be an instance of/i

describe('property types:', () => {
    it('setting id to string throws an error', () => {
        invalidType(t => t.id = 'a')
    })

    it('setting term to number throws an error', () => {
        invalidType(t => t.term = 1)
    })

    it('setting tags to number', () => {
        invalidType(t => t.tags = 1)
    })

    it('setting tags to string throws an error', () => {
        invalidType(t => t.tags = 'a')
    })

    it('adding a number to tags throws an error', () => {
        invalidType(t => t.tags = [1])
    })

    it('setting definition to number throws an error', () => {
        invalidType(t => t.definition = 1)
    })

    function invalidType(set) {
        var t = new Term()
        var typeErrorPattern = /has to be an instance of|expecting a function in instanceof check, but got/i
        should.throw(() => set(t), chai.AssertionError)
    }
})

describe('property setter/getter:', () => {
    it('get set id', () => {
        var t = new Term()
        t.id.should.be.zero
        t.id = 1
        t.id.should.equal(1)
    })
    it('get set term', () => {
        var t = new Term()
        t.term.should.equal('')
        t.term = 'term'
        t.term.should.equal('term')
    })

    it('get set tags', () => {
        var t = new Term()
        t.tags.should.deep.equal([])
        t.tags = ['tag']
        t.tags.should.deep.equal(['tag'])
    })
    
    it('add a tag', () => {
        var t = new Term()
        t.tags.push('tag')
        t.tags.should.deep.equal(['tag'])
    })
    it('get set definition', () => {
        var t = new Term()
        t.definition.should.equal('')
        t.definition = 'definition'
        t.definition.should.equal('definition')
    })
})