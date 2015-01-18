import pg from 'pg';

export default class Database{
    constructor(connectionUri){
        this.connectionUri = connectionUri;
    };

    add(term, tags, definition, callback) {
        pg.connect(this.connectionUri, function(err, client, done) {
            if(err) {
                return console.error('Could not connect to postgres', err);
                done(client);
            }

            client.query('insert into terms (term, tags, definition) values ($1, $2, $3) returning id;', [ term, tags, definition ], function(err, result) {
                if(err) {
                    return console.error('Error running query', err);
                    done(client);
                }

                done();
                callback(result.rows[0].id);
            });
        });
    };

    find(id, callback) {
        pg.connect(this.connectionUri, function(err, client, done) {
            if(err) {
                return console.error('Could not connect to postgres', err);
                done(client);
            }

            client.query('select id, term, tags, definition from terms where id = $1;', [ id ],
                              function(err, result) {
                                  if(err) {
                                      return console.error('Error running query', err);
                                      done(client);
                                  }

                                  done();
                                  callback(result.rows[0]);
                              });
        });
    };

    search(searchTerm, callback) {
        pg.connect(this.connectionUri, function(err, client, done) {
            if(err) {
                return console.error('Could not connect to postgres', err);
                done(client);
            }

            client.query('select id, term, tags from terms, to_tsquery($1) as query where weightedVector @@ query order by ts_rank_cd(weightedVector, query) desc;', [ searchTerm ],
                              function(err, result) {
                                  if(err) {
                                      return console.error('Error running query', err);
                                      done(client);
                                  }

                                  done();
                                  callback(result);
                              });
        });
    };

    update(id, term, tags, definition, callback) {
        pg.connect(this.connectionUri, function(err, client, done) {
            if(err) {
                return console.error('Could not connect to postgres', err);
                done(client);
            }

            client.query('update terms set term = $1, tags = $2, definition = $3 where id = $4;', [ term, tags, definition, id ], function(err, result) {
                if(err) {
                    return console.error('Error running query', err);
                    done(client);
                }

                done();
                callback(result);
            });
        });
    };
}
