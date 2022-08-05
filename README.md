# graphql-ts-server-boilerplate

* this repo is a clone of https://github.com/benawad/graphql-ts-server-boilerplate, but with latest packages *

# What's new
- TypeORM version 0.3.7 (latest)
 - ormconfig.json is no longer generated. see breaking changes https://github.com/typeorm/typeorm/releases/tag/0.3.0
 - configure database information in src/data-source.ts
- other latest dependencies 
- tslint is now deprecated, use eslint instead

A GraphQL Server boilerplate made with Typescript, PostgreSQL, and Redis

## Installation

1. Clone project
```
git clone https://github.com/benawad/graphql-ts-server-boilerplate.git
```
2. cd into folder
```
cd graphql-ts-server-boilerplate
```
3. Download dependencies 
```
yarn
```
4. Start PostgreSQL server
5. Create database called `graphql-ts-server-boilerplate`
```
createdb graphql-ts-server-boilerplate
```
6. [Add a user](https://medium.com/coding-blocks/creating-user-database-and-adding-access-on-postgresql-8bfcd2f4a91e) with the username `postgres` and and no password. (You can change what these values are in the [ormconfig.json](https://github.com/benawad/graphql-ts-server-boilerplate/blob/master/ormconfig.json))

7. Install and start Redis

## Usage

You can start the server with `yarn start` then navigate to `http://localhost:4000` to use GraphQL Playground.

## Features

* Register - Send confirmation email
* Login
* Forgot Password
* Logout  
* Cookies
* Authentication middleware
* Rate limiting
* Locking accounts
* Testing (probably Jest)

## Watch how it was made

Playlist: https://www.youtube.com/playlist?list=PLN3n1USn4xlky9uj6wOhfsPez7KZOqm2V
