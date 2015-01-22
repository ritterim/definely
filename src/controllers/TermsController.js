import Controller from './Controller'
import pg from 'pg'
import Database from '../database'
import Promise from 'bluebird'
import _request from 'request'
var Request = Promise.promisify(_request)

export
default class TermsController extends Controller {
    constructor(router) {
        super(router, '/terms');

        this.get('/', this.index.bind(this));
        this.get('/{id}', this.show.bind(this));
        this.get('/{id}/edit', this.edit.bind(this));
        this.get('/new', this.new);
        this.post('/new', this.create.bind(this));
        this.put('/{id}', this.update.bind(this));
    }

    index(request, reply) {
        var searchTerm = request.url.query['search-term']
        var url = this.absoluteUrl('api/terms?' + (searchTerm ? 'search-term=' + searchTerm : ''))

        Request(url).then(json => {
            var terms = super.siren(json)
            if (terms.length === 1)
                reply.redirect('/terms/' + dbResponse.rows[0].id)
            else {
                Lazy(terms).each(t => {
                    t.rankClass = t.rank >= .8 ? 'text-success' : t.rank >= .5 ? 'text-warning' : t.rank >= .1 ? 'text-info' : 'text-danger'
                })
                var title = searchTerm == null ? 'Terms' : 'Search results for: ' + searchTerm;
                reply.view('terms/index', {
                    searchTerm: searchTerm,
                    title: title,
                    terms: terms
                })
            }
        })
    }

    create(request, reply) {
        var url = this.absoluteUrl('api/terms/new')
        Request.postAsync(url, request.payload).then(id => {
            reply.redirect('/terms/' + id);
        })
    }

    edit(request, reply) {
        var url = this.absoluteUrl('api/terms/' + request.params.id)
        Request(url).then(term => {
            reply.view('terms/edit', {
                title: 'Edit term',
                term: term
            })
        })
    }

    show(request, reply) {
        var url = this.absoluteUrl('api/terms/' + request.params.id)
        Request(url).then(term =>
            reply.view('terms/show', {
                title: 'Show term',
                term: term
            }))
    }

    new(request, reply) {
        reply.view('terms/new', {
            title: 'New term',
            term: request.query.term
        });
    }

    update(request, reply) {
        var id = request.params.id
        var url = this.absoluteUrl('api/terms/' + id)
        Request
            .put(url, request.payload)
            .then(() => reply.redirect('/terms/' + id))
    }
}