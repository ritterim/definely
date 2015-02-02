import ApiController from './ApiController'
import Term from '../../models/Term'
import Lazy from 'lazy.js'
import Database from '../../database'
import {Get, Post, Put, Patch, Delete} from '../../attributes'

@Get("api/terms")
export default class TermApiController extends ApiController {
    constructor() {
        this.database = new Database(process.env['DATABASE_URL'])
    }

    @Get()
    index(request, reply) {
        var searchTerm = request.url.query['search-term'];
        this.database.search(searchTerm)
            .then(terms => {
                var siren = super.siren(terms)
                reply(siren).type('application/vnd.siren+json')
            })
    }

    @Post('new')
    new(request, reply) {
        var term = new Term(request.payload.id, request.payload.term, request.payload.definition, request.payload.tags)
        this.database.add(term)
            .then(id => {
                term.id = id
                var siren = super.siren(term)
                reply(siren).type('application/vnd.siren+json')
            })
    }

    @Get('{id}')
    show(request, reply) {
        this.database.find(request.params.id)
            .then(term => {
                var siren = super.siren(term)
                reply(siren).type('application/vnd.siren+json')
            })
    }

    @Put('{id}')
    update(request, reply) {
        var id = request.params.id
        var term = new Term(id, request.payload.term, request.payload.definition, request.payload.tags)
        this.database.update(term).then(() => reply())
    }
}
