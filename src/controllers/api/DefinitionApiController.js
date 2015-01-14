import ApiController from './ApiController'
	
export default class DefinitionApiController extends ApiController {
	constructor(router)
	{
		super(router, '/definitions')
		this.get('/', this.all)
		this.get('/{id}', this.byId)
	}
	
	all(request, reply) {
		reply('(siren+json) all definitions in siren format')
	}
	
	byId(request, reply) {
		var id = request.params.id
		reply('(siren+json) one definition matching id=' + id)
	}
	
}