import Controller from './Controller'

export default class TermController extends Controller {
	constructor(router)
	{
		super(router, '/terms')
		this.get('/', this.all)
		this.get('/{id}', this.byId)
	}
	
	all(request, reply) {
		reply('all terms in siren format')
	}
	
	byId(request, reply) {
		var id = request.params.id
		reply('one term matching id=' + id)
	}
	
}