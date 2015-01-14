import * as chai from 'chai'
var should = chai.should

import {Siren} from './Siren'

describe('siren:', function() {
	
	describe('class:', function() {
		it('should be an array', function() {
			var test = {}
			var siren = new Siren(test)
			siren.root.class.should.be.an('array')
		})
		
		it('root should exactly contain entity type', function() {
			var test = {}
			var siren = new Siren(test)
			siren.root.class.should.equal(['test'])
		})
		   
		it('subentity should contain exactly property name of parent followed by type', function() {
			var test = {prop: {}}
			var siren = new Siren(test)
			siren.root.entities[0].class.should.equal(['prop', 'prop'])
		})
	})
})