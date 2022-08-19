# graphql-ts-server-boilerplate

\* this repo is a clone of https://github.com/benawad/graphql-ts-server-boilerplate, but with latest packages *

## Tech stack
- TypeScript
- GraphQL Yoga & Express
- Redis
- Postgresql + TypeORM

## Installation

1. Clone project
```
git clone https://github.com/0xsuk/graphql-ts-server-boilerplate.git
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
6. [Add a user](https://medium.com/coding-blocks/creating-user-database-and-adding-access-on-postgresql-8bfcd2f4a91e) with the username `postgres` and password `postgres`. (You can change what these values are in the [data-source.ts](https://github.com/0xsuk/graphql-ts-server-boilerplate/blob/master/src/data-src.ts))

7. Install and start Redis

8. Set environtment variables in .env
FRONTEND_HOST: frontend host (eg. http://localhost:3000)
GMAIL_EMAIL: gmail to send "confirm email" email from  
GMAIL_PASSWORD: gmail "Application Specific Password". Read more: https://nodemailer.com/usage/using-gmail/  
SESSION_SECRET=somerandomstring to hash cookie


## Usage

You can start the server with `yarn start` then navigate to `http://localhost:4000` to use GraphQL Playground.

## Features

* Register - Send confirmation email
* Login
* Reset Password
* Logout  
* Cookies
* Authentication middleware
* Rate limiting
* ~~Locking accounts~~
* Testing (Jest)

## Watch how it was made

Playlist: https://www.youtube.com/playlist?list=PLN3n1USn4xlky9uj6wOhfsPez7KZOqm2V

## What's new
- TypeORM version 0.3.7 (latest)
  - ormconfig.json is no longer generated. see breaking changes https://github.com/typeorm/typeorm/releases/tag/0.3.0
  - configure database information in src/data-source.ts
- other latest dependencies 
- tslint is now deprecated, use eslint instead
- graphql-import is now deprecated, use graphql-tools
- node-fetch does not work well with ts jest https://github.com/node-fetch/node-fetch/issues/1289, so use axios instead
  - No need for fetch library anymore as node.js v18 (yet to come) has built-in fetch API
- request-promise is deprecated, so use axios + cookiejar instead
- use graphql-codegen instead of gql2ts as it is more popular (and ben awad recommends it)
- use nodemailer instead of sparkpost
- disable multiple session logout at once
- disable lock account when forgot password email is sent
- forgotPassword renamed to resetPassword, as it makes more sense

A GraphQL Server boilerplate made with Typescript, PostgreSQL, and Redis
