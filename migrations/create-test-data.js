exports.up = function(pgm, run) {
    pgm.sql(insert into terms values(1, null, 'FMO'));
    pgm.sql(insert into terms values(2, null, 'CMS'));
    pgm.sql(insert into terms values(3, null, 'NIPR'));
    pgm.sql(insert into terms values(4, null, 'NPN'));
    pgm.sql(insert into terms values(5, null, 'NAIC'));
    
    pgm.sql(insert into definitions values(1, 1, 'Field Marketing Organization'));
    pgm.sql(insert into definitions values(2, 2, 'Center for Medicare and Medicaid Services'));
    pgm.sql(insert into definitions values(3, 3, 'National Insurance Producer Registry'));
    pgm.sql(insert into definitions values(4, 4, 'National Producer Number'));
    pgm.sql(insert into definitions values(5, 5, 'National Association of Insurance Commissioners'));
    run();
};

exports.down = false;
