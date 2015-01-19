exports.up = function(pgm, run) {
    pgm.sql("alter sequence terms_id_seq restart with 6");
  run();
};

exports.down = false;
