# definely ![Travis CI Build Status](https://travis-ci.org/ritterim/definely.svg)

This project is intended to allow the creation of words and abbreviations and connecting to definitions.

## Dev. Stack
 - [node.js](http://nodejs.org/) as language library
 - [hapi.js](http://hapijs.com/) as node.js framework
 - [postgreSQL](http://www.postgresql.org/) for data-store
 - http://www.elasticsearch.org/blog/client-for-node-js-and-the-browser/ -- maybe... as a future-feature

## Schema
 - `terms` and `definitions` (1:*)
 - `terms` represent both words (ex. 'balloon') and abbreviations (ex. 'bal.' or 'bal').
 - while each term can connect to a definition, a term can also link to another term.
