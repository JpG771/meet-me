const faunadb = require('faunadb')
const q = faunadb.query

exports.handler = (event, context) => {
  /* configure faunaDB Client with our secret */
  const client = new faunadb.Client({
    secret: process.env.FAUNADB_SERVER_SECRET
  }) 
  const data = JSON.parse(event.body)
  console.log(`Function 'meet-update' invoked. update id: ${data.id}`)
  return client.query(q.Update(q.Ref(q.Collection(`meets`), data.id), {data}))
    .then((response) => {
      console.log('success', response)
      return {
        statusCode: 200,
        body: JSON.stringify(response.data)
      }
    }).catch((error) => {
      console.log('error', error)
      return {
        statusCode: 400,
        body: JSON.stringify(error)
      }
    })
}
