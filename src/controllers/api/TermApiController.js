import ApiController from './ApiController'
import Term from '../../models/Term'
import Lazy from 'lazy.js'
import Database from '../database'

var mock = [new Term(1, 'FMO', 'Field Marketing Organization', ['tag1', 'tag2']),
               new Term(2, 'CMS', 'Center for Medicare and Medicaid Services'),
               new Term(3, 'NIPR', 'National Insurance Producer Registry', ['tag1', 'tag3']),
               new Term(4, 'NPN', 'National Producer Number', ['tag2', 'tag3']),
               new Term(5, 'NAIC', 'National Association of Insurance Commissioners'), ['tag1', 'tag2', 'tag3']]

export default class TermApiController extends ApiController {
    constructor(router) {
        super(router, '/terms')
        this.get('/', this.index.bind(this));
        this.get('/{id}', this.show.bind(this));
        this.post('/new', this.new.bind(this));
        this.put('/{id}', this.update.bind(this));

        this.database = new Database(process.env['DATABASE_URL']);
        this.sirenType = 'application/vnd.siren+json'
    }

    index(request, reply) {
        var searchTerm = request.url.query['search-term'];
        this.database.search(searchTerm, function (dbResponse) {
            var terms = dbResponse.rows
            var siren = super.siren(terms)
            reply(siren).type(this.sirenType)
        })
    }

    new(request, reply) {
        this.database.add(
            request.payload.term,
            request.payload.tags,
            request.payload.definition,
            function (id) {
                var siren = super.siren(new Term(id))
                reply(siren).type(this.sirenType)
            })
    }

    show(request, reply) {
        this.database.find(request.params.id, function (term) {
            var siren = super.siren(term)
            reply(siren).type(this.sirenType)
        })
    }

    update(request, reply) {
        var id = request.params.id

        this.database.update(
            id,
            request.payload.term,
            request.payload.tags,
            request.payload.definition,
            function () {
                reply.redirect('/terms/' + id)
            })
    } << << << < HEAD

} === === =
} >>> >>> > Updated api with siren api logic
