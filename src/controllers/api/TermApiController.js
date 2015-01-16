import ApiController from './ApiController'
import Term from '../../models/Term'
import Lazy from 'lazy.js'
    
export default class TermApiController extends ApiController {
	constructor(router) {
		super(router, '/terms')
		this.get('/', this.all)
		this.get('/{id}', this.byId)
	}

    
    
    get mock() {
        return [new Term(1, 'FMO', 'Field Marketing Organization'),
               new Term(2, 'CMS', 'Center for Medicare and Medicaid Services'),
               new Term(3,  'NIPR', 'National Insurance Producer Registry'),
               new Term(4,  'NPN', 'National Producer Number'),
               new Term(5,  'NAIC', 'National Association of Insurance Commissioners')]
    }
    
	all(request, reply) {
            var mock = 
         [new Term(1,  'FMO', 'Field Marketing Organization'),
               new Term(2,  'CMS', 'Center for Medicare and Medicaid Services'),
               new Term(3,  'NIPR', 'National Insurance Producer Registry'),
               new Term(4,  'NPN', 'National Producer Number'),
               new Term(5,  'NAIC', 'National Association of Insurance Commissioners')]
        var siren = super.siren(mock)
        console.log(siren)
		reply(siren)
	}

	byId(request, reply) {
        var mock = 
         [new Term(1,  'FMO', 'Field Marketing Organization'),
               new Term(2,  'CMS', 'Center for Medicare and Medicaid Services'),
               new Term(3,  'NIPR', 'National Insurance Producer Registry'),
               new Term(4,  'NPN', 'National Producer Number'),
               new Term(5,  'NAIC', 'National Association of Insurance Commissioners')]
		var id = request.params.id
        var term = Lazy(mock).filter(e=>e.id == id).first() 
        var siren = super.siren(term)
		reply(siren)
	}

}