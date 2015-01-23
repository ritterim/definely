import Controller from './Controller'
import pg from 'pg'
import Database from '../database'
import Promise from 'bluebird'
import _request from 'request'
var Request = Promise.promisifyAll(_request)
import Lazy from 'lazy.js'

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
        Request.getAsync(url).then(data => {
            var terms = super.siren(data[0].body)
            if (terms.length === 1)
                reply.redirect('/terms/' + terms[0].id)
            else {
                var terms = Lazy(terms).sortBy(term => !searchTerm ? term.term : term.rank)
                    .map(t => {
                        t.rankClass = !searchTerm || t.rank >= .8 ? 'text-success' : t.rank >= .5 ? 'text-warning' : t.rank >= .1 ? 'text-info' : 'text-danger'
                        t.tags = t.tags.join(' ')
                        return t
                    }).toArray()
                var title = searchTerm == null ? 'Terms' : 'Search results for: ' + searchTerm;
                reply.view('terms/index', {
                    searchTerm: searchTerm || '*',
                    title: title,
                    terms: terms
                })
            }
        })
    }

    create(request, reply) {
        var url = this.absoluteUrl('api/terms/new')
        Request.postAsync({
            url: url,
            form: request.payload
        }).then(data => {
            var term = super.siren(data[0].body)
            reply.redirect('/terms/' + term.id);
        })
    }

    edit(request, reply) {
        this._show(request.params.id).then(term => {
            reply.view('terms/edit', {
                title: 'Edit term',
                term: term
            })
        })
    }

    show(request, reply) {
        this._show(request.params.id).then(term =>
            reply.view('terms/show', {
                title: 'Show term',
                term: term
            }))
    }

    _show(id) {
        var url = this.absoluteUrl('api/terms/' + id)
        return Request.getAsync(url).then(data => {
            var term = super.siren(data[0].body)
            term.tags = term.tags.join(' ')
            return term
        })
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
            .putAsync({
                url: url,
                form: request.payload
            })
            .then(() => reply.redirect('/terms/' + id))
    }
}
