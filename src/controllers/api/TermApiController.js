import ApiController from './ApiController'
import Term from '../../models/Term'
import Lazy from 'lazy.js'
import Database from '../../database'

export
default class TermApiController extends ApiController {
    constructor(router) {
        super(router, '/terms')
        this.get('/', this.index.bind(this));
        this.get('/{id}', this.show.bind(this));
        this.post('/new', this.new.bind(this));
        this.put('/{id}', this.update.bind(this));

        this.database = new Database(process.env['DATABASE_URL']);
    }

    index(request, reply) {
        var searchTerm = request.url.query['search-term'];
        this.database.search(searchTerm).then(terms => {
            var siren = super.siren(terms)
            reply(siren).type('application/vnd.siren+json')
        })
    }

    new(request, reply) {
        var term = new Term(request.payload.id, request.payload.term, request.payload.definition, request.payload.tags)
        this.database.add(term)
        then(id => {
            term.id = id
            var siren = super.siren(term)
            reply(siren).type('application/vnd.siren+json')
        })
    }

    show(request, reply) {
        this.database.find(request.params.id)
            .then(term => {
                var siren = super.siren(term)
                reply(siren).type('application/vnd.siren+json')
            })
    }

    update(request, reply) {
        var id = request.params.id
        var term = new Term(id, request.payload.term, request.payload.definition, request.payload.tags)
        this.database.update(term).then(() => reply())
    }
}
