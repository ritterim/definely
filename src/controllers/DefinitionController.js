import Controller from './Controller'

export default class DefinitionController extends Controller {
	constructor(router)
	{
		super(router, '/definitions')
		this.get('/', this.all)
		this.get('/{id}', this.byId)
	}
	
	all(request, reply) {
		reply('all definitions in siren format')
	}
	
	byId(request, reply) {
		var id = request.params.id
		reply('one definition matching id=' + id)
	}
	
}