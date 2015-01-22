exports.up = function(pgm, run) {
    pgm.sql("create index idx_terms on terms using gin((setweight(to_tsvector('english', term), 'A')||     setweight(to_tsvector('english', tags), 'B') || setweight(to_tsvector('english', definition), 'C')))");
    run();
};

exports.down = function(pgm, run) {
    pgm.sql("drop index idx_terms");
    run();
};
