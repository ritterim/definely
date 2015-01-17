drop index if exists terms_weightedVector_index;
drop trigger terms_insert_update_weighted_vector_trigger on terms;
drop function if exists terms_build_weighted_vector();
alter table terms drop column if exists weightedVector;
