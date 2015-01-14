import ApiController from './ApiController'

export
default class TermApiController extends ApiController {
	constructor(router) {
		super(router, '/terms')
		this.get('/', this.all)
		this.get('/{id}', this.byId)
	}


	all(request, reply) {
		reply('(siren+json) all terms')
	}

	byId(request, reply) {
		var id = request.params.id
		reply('(siren+json) one term matching id=' + id)
	}

}