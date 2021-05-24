/* bootstrap database in your FaunaDB account */
const faunadb = require('faunadb')
const chalk = require('chalk')
const insideNetlify = insideNetlifyBuildContext()
const q = faunadb.query

console.log(chalk.cyan('Creating your FaunaDB Database...\n'))

if (!process.env.FAUNADB_SERVER_SECRET) {
  console.log(chalk.yellow('Required FAUNADB_SERVER_SECRET enviroment variable not found.'))
  console.log(`Make sure you have created your Fauna databse with "netlify addons:create fauna"`)
  console.log(`Then run "npm run bootstrap" to setup your database schema`)
  if (insideNetlify) {
    process.exit(1)
  }
}

// Has var. Do the thing
if (process.env.FAUNADB_SERVER_SECRET) {
  createFaunaDB(process.env.FAUNADB_SERVER_SECRET).then(() => {
    console.log('Fauna Database schema has been created')
    console.log('Claim your fauna database with "netlify addons:auth fauna"')
  })
}

/* idempotent operation */
function createFaunaDB(key) {
  console.log('Creating the fauna database schema!')
  const client = new faunadb.Client({
    secret: key
  })

  /* Based on your requirements, change the schema here */
  return client.query(q.CreateDatabase({ name: 'meet-up-db' }))
    .then(() => {
      console.log('Database created!')
    }).catch((e) => {
      // Database already exists
      if (e.requestResult.statusCode === 400 && e.message === 'instance not unique') {
        console.log('Fauna already setup! Good to go')
        console.log('Claim your fauna database with "netlify addons:auth fauna"')
      }
    })
    .then(createCollections(client))
    .then(createIndexes(client))
}

function createCollections(client) {
  return client.query(q.CreateCollection({ name: 'meets'}))
    .then(() => console.log('Collection `meets` created'))
    .catch((e) => {
      console.log('Error creating the collection `meets`', e)
    })
    .then(() => client.query(q.CreateCollection({ name: 'messages'})))
    .then(() => console.log('Collection `messages` created'))
    .catch((e) => {
      console.log('Error creating the collection `messages`', e)
    })
    .then(() => client.query(q.CreateCollection({ name: 'users'})))
    .then(() => console.log('Collection `users` created'))
    .catch((e) => {
      console.log('Error creating the collection `users`', e)
    })
}

function createIndexes(client) {
  return client.query(q.CreateIndex({ 
      name: 'all_meets',
      source: q.Collection('meets'),
      terms: [{ field: ['data', 'dateStart'] }],
    }))
    .then(() => console.log('Index `all_meets` created'))
    .catch((e) => {
      console.log('Error creating the index `all_meets`')
    })
    .then(client.query(q.CreateIndex({ 
      name: 'user_messages',
      source: q.Collection('messages'),
      terms: [{ field: ['data', 'toUser'] }],
    })))
    .then(() => console.log('Index `user_messages` created'))
    .catch((e) => {
      console.log('Error creating the index `user_messages`')
    })
    .then(client.query(q.CreateIndex({ 
      name: 'user_detail_for_user',
      source: q.Collection('users'),
      terms: [{ field: ['data', 'user'] }],
    })))
    .then(() => console.log('Index `user_detail` created'))
    .catch((e) => {
      console.log('Error creating the index `user_detail`')
    })
}

/* util methods */

// Test if inside netlify build context
function insideNetlifyBuildContext() {
  if (process.env.DEPLOY_PRIME_URL) {
    return true
  }
  return false
}