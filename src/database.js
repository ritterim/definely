import Promise from 'bluebird'
import pg from 'pg';
Promise.promisifyAll(pg)
import Term from './models/Term'

export
default class Database {
    constructor(connectionUri) {
        this.connectionUri = connectionUri
    }

    add(term) {
        return Promise.using(this._connect(), client =>
                client.queryAsync('insert into terms (term, tags, definition) values ($1, $2, $3) returning id;', [term.term, term.tags.join(' '), term.definition])
                .then(result => result.rows[0].id))
            .error(err => console.error('Error running query', err))
    }

    find(id) {
        return Promise.using(this._connect(), client =>
                client.queryAsync('select id, term, tags, definition from terms where id = $1;', [id])
                .then(result => {
                    var term = null
                    if (result.rows.length > 0) {
                        var row = result.rows[0]
                        term = new Term(row.id, row.term, row.definition, row.tags || undefined)
                    }
                    return term
                }))
            .error(err => console.error('Error running query', err))
    }

    search(searchTerm) {
        return Promise.using(this._connect(), client => {
                searchTerm = (searchTerm || '').trim().replace(/\s+/g, ' | ');

                if (!searchTerm)
                    return client.queryAsync('select id, term, tags, definition from terms')
                        .then(result => result.rows.map(row => new Term(row.id, row.term, row.definition, row.tags || undefined)))
                else
                    return client.queryAsync('select id, term, tags, definition, rank, ts_headline(definition, query) as highlight_definition from terms, to_tsquery($1) as query, ts_rank_cd(weightedVector, query) as rank where weightedVector @@ query order by rank desc;', [searchTerm])
                        .then(result =>
                            result.rows.map(row => {
                                var term = new Term(row.id, row.term, row.definition, row.tags || undefined)
                                
                            /**
                             * This property is dynamically added since it's specific
                             * to this function and not part of the model.
                             */
                                term.rank = row.rank
                                term.highlightDefinition = row.highlight_definition
                                return term
                            })
                        )
            })
            .error(err => console.error('Error running query', err))
    }

    update(term) {
        return Promise.using(this._connect(), client =>
                client.queryAsync('update terms set term = $1, tags = $2, definition = $3 where id = $4;', [term.term, term.tags.join(' '), term.definition, term.id]))
            .error(err => console.error('Error running query', err))
    }

    _connect() {
        var close;
        return pg.connectAsync(this.connectionUri).spread(function (client, done) {
                close = done
                return client
            })
            .error(err => console.log('Could not connect to postgres', err))
            .disposer(function (client) {
                if (close) close(client)
            })
    }
}
