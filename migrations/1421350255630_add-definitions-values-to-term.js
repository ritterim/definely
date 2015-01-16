exports.up = function(pgm, run) {
    pgm.sql("update terms set definition = 'Field Marketing Organization' where id = 1;");
    pgm.sql("update terms set definition = 'Center for Medicare and Medicaid Services' where id = 2;");
    pgm.sql("update terms set definition = 'National Insurance Producer Registry' where id = 3;");
    pgm.sql("update terms set definition = 'National Producer Number' where id = 4;");
    pgm.sql("update terms set definition = 'National Association of Insurance Commissioners' where id = 5;");
    run();
};

exports.down = function(pgm, run) {
    pgm.sql("update terms set definition = null where id in (1, 2, 3, 4, 5);");

    run();
};
