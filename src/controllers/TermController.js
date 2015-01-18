import Controller from './Controller'
import pg from 'pg'
import Database from '../database'

export default class TermController extends Controller {
    constructor(router) {
        super(router, '/terms');

        this.get('/', this.index.bind(this));
        this.get('{id}', this.edit.bind(this));
        this.get('/new', this.new);
        this.post('/new', this.create.bind(this));
        this.put('/{id}', this.update.bind(this));

        this.database = new Database(process.env['DATABASE_URL']);
    }

    create(request, reply) {
        this.database.add(
            request.payload.term,
            request.payload.tags,
            request.payload.definition,
            function(id) {
                reply.redirect('/terms/' + id);
            });
    }

    edit(request, reply) {
        this.database.find(request.params.id, function(term) {
            reply.view('terms/edit', {
                title: 'Edit term',
                term: term
            });
        });
    }

    index(request, reply) {
        var searchTerm = request.url.query['search-term'];
        var title = searchTerm == null ? 'Terms' : 'Search results for: ' + searchTerm;

        this.database.search(searchTerm, function(dbResponse) {
            reply.view('terms/index', {
                title: title,
                terms: dbResponse.rows
            });
        });
    }

    new(request, reply) {
        reply.view('terms/new', {
            title: 'New term'
        });
    }

    update(request, reply) {
        var id = request.params.id;

        this.database.update(
            id,
            request.payload.term,
            request.payload.tags,
            request.payload.definition,
            function() {
                reply.redirect('/terms/' + id);
            });
    }
}
