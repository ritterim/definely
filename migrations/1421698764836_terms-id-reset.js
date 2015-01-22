exports.up = function(pgm, run) {
    pgm.sql("alter sequence terms_id_seq restart with 6");
    run();
};

exports.down = function(pgm, run) {
    pgm.sql("alter sequence term_id_seq restart with 1");
    run();
};
