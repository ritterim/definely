import pg from 'pg';
import Term from './models/Term'

export
default class Database {
    constructor(connectionUri) {
        this.connectionUri = connectionUri;
    };

    add(term, callback) {
        pg.connect(this.connectionUri, function (err, client, done) {
            if (err) {
                return console.error('Could not connect to postgres', err);
                done(client);
            }

            client.query('insert into terms (term, tags, definition) values ($1, $2, $3) returning id;', [term.term, term.tags.join(' '), term.definition], function (err, result) {
                if (err) {
                    return console.error('Error running query', err);
                    done(client);
                }

                done();
                callback(result.rows[0].id);
            });
        });
    };

    find(id, callback) {
        pg.connect(this.connectionUri, function (err, client, done) {
            if (err) {
                return console.error('Could not connect to postgres', err);
                done(client);
            }

            client.query('select id, term, tags, definition from terms where id = $1;', [id],
                function (err, result) {
                    if (err) {
                        return console.error('Error running query', err);
                        done(client);
                    }

                    done();
                    callback(result.rows[0]);
                });
        });
    };

    // returns {term, rank}
    search(searchTerm, callback) {
        pg.connect(this.connectionUri, function (err, client, done) {
            if (err) {
                return console.error('Could not connect to postgres', err);
                done(client);
            }

            searchTerm = searchTerm.replace(/\s+/g, ' | ');

            client.query('select id, term, tags, definition, rank from terms, to_tsquery($1) as query, ts_rank_cd(weightedVector, query) as rank where weightedVector @@ query order by rank desc;', [searchTerm],
                function (err, result) {
                    if (err) {
                        return console.error('Error running query', err);
                        done(client);
                    }

                    done();
                    var terms = result.rows.map(function (element) {
                        var term = new Term(element.id, element.term, element.definition)
                        term.rank = element.rank
                        return term
                    });
                    callback(terms);
                });
        });
    };

    update(term, callback) {
        pg.connect(this.connectionUri, function (err, client, done) {
            if (err) {
                return console.error('Could not connect to postgres', err);
                done(client);
            }
            client.query('update terms set term = $1, tags = $2, definition = $3 where id = $4;', [term.term, term.tags, term.definition, term.id], function (err, result) {
                if (err) {
                    return console.error('Error running query', err);
                    done(client);
                }
                done();
                callback();
            });
        });
    };
}
