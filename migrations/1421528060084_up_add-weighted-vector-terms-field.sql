alter table terms add column weightedVector tsvector default '0'::tsvector not null;

create function terms_build_weighted_vector() returns trigger as $$
    begin
        new.weightedVector :=
            setweight(to_tsvector('pg_catalog.english', new.term), 'A') ||
            setweight(to_tsvector('pg_catalog.english', coalesce(new.tags, '')), 'B') ||
            setweight(to_tsvector('pg_catalog.english', coalesce(new.definition, '')), 'B');
        return new;
    end
$$ language plpgsql;

create trigger terms_insert_update_weighted_vector_trigger before insert or update
    on terms
      for each row execute procedure terms_build_weighted_vector();

update terms set weightedVector =
    setweight(to_tsvector('pg_catalog.english', term), 'A') ||
    setweight(to_tsvector('pg_catalog.english', coalesce(tags, '')), 'B') ||
    setweight(to_tsvector('pg_catalog.english', coalesce(definition, '')), 'C');

create index terms_weightedVector_index on terms using gin(weightedVector);
