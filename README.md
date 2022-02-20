## Build Setup

```bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```

For detailed explanation on how things work, check out the [documentation](https://nuxtjs.org).

## Special Directories

You can create the following extra directories, some of which have special behaviors. Only `pages` is required; you can delete them if you don't want to use their functionality.

### `assets`

The assets directory contains your uncompiled assets such as Stylus or Sass files, images, or fonts.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/assets).

### `components`

The components directory contains your Vue.js components. Components make up the different parts of your page and can be reused and imported into your pages, layouts and even other components.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/components).

### `layouts`

Layouts are a great help when you want to change the look and feel of your Nuxt app, whether you want to include a sidebar or have distinct layouts for mobile and desktop.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/layouts).

### `pages`

This directory contains your application views and routes. Nuxt will read all the `*.vue` files inside this directory and setup Vue Router automatically.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/get-started/routing).

### `plugins`

The plugins directory contains JavaScript plugins that you want to run before instantiating the root Vue.js Application. This is the place to add Vue plugins and to inject functions or constants. Every time you need to use `Vue.use()`, you should create a file in `plugins/` and add its path to plugins in `nuxt.config.js`.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/plugins).

### `static`

This directory contains your static files. Each file inside this directory is mapped to `/`.

Example: `/static/robots.txt` is mapped as `/robots.txt`.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/static).

### `store`

This directory contains your Vuex store files. Creating a file in this directory automatically activates Vuex.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/store).

# Workers (Database & API)

In this section we will comment on architecture and design decisions of the frontend Workers, we use this only to show users related information and staled connections data for
past days.

## Database

Everything runs on S3-compatible services, we can use Backblaze, S3, Azure or any other service. This decision was made because we thought the frontend won't be used a lot
and we don't really require a database for database this small, plus we save a lot of money on replication costs and mantainance.

### Structure

How the database is organized.

#### User

Used to allow access to the platform, create organizations, manage applications and create them.

Filename for users needs to be: `[email].json`

```json
{
  "firstName": "string",
  "lastName": "string",
  "identifier": "UUIDv7",
  "password": "SHA256",
  "organizations": ["Orgnization identifier", "Organization identifier"]
}
```

#### Organizations

We need organizations in order to be able to provide access to multiple users to the same application.

Filename for organizations needs to be: `[orgIdentifier].json`

```json
{
  "name": "string",
  "members": ["User identifier UUIDv7", "User identifier  UUIDv7"]
}
```

#### Applications

We need applications to manage everything that has to do with connections.

Filename for applications needs to be: `[orgIdentifier].json`

NOTE: `hosts` is only used for public keys.

```json
[
  {
    "identifier": "UUIDv7",
    "name": "string",
    "keys": [
      {
        "token": "string",
        "type": "public/private",
        "hosts": ["https://www.example.com"],
        "expires": 1645379187
      },
      {
        "token": "string",
        "type": "public/private",
        "hosts": ["https://www.example.com"],
        "expires": 1645379187
      }
    ],
    "allowClientSend": "boolean",
    "allowClientSubscription": "boolean",
    "allowAnalytics": "boolean",
    "location": "eu-west-1"
  },
  {
    "identifier": "UUIDv7",
    "name": "string",
    "keys": [
      {
        "token": "string",
        "type": "public/private",
        "hosts": ["https://www.example.com"]
      },
      {
        "token": "string",
        "type": "public/private",
        "hosts": ["https://www.example.com"]
      }
    ],
    "allowClientSend": "boolean",
    "allowClientSubscription": "boolean",
    "allowAnalytics": "boolean",
    "location": "eu-west-1"
  }
]
```

#### Connections

Analytics about connections, we also use this for billing.

Filename for connections needs to be: `[applicationIdentifierYYYYMMDD].json`

NOTE: Remember that connections for today are not available in our database, we push them at the end of each day.

```
identifier;startDateTime;finishDateTime;ipAddress;userAgent
```
