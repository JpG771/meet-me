/* Import faunaDB sdk */
const faunadb = require('faunadb')
const q = faunadb.query

/* export our lambda function as named "handler" export */
exports.handler = async (event, context) => {
  /* configure faunaDB Client with our secret */
  const client = new faunadb.Client({
    secret: process.env.FAUNADB_SERVER_SECRET
  })  
  /* parse the string body into a useable JS object */
  const data = JSON.parse(event.body)
  console.log('Function `message-create` invoked', data)
  const messageDbItem = {
    data: data
  }
  /* construct the fauna query */
  return client.query(q.Create(q.Collection('messages'), messageDbItem))
    .then((response) => {
      console.log('success', response)
      /* Success! return the response with statusCode 200 */
      const bodyData = { ...response.data, id: response.ref.id }
      console.log('body data', bodyData)
      return {
        statusCode: 200,
        body: JSON.stringify(bodyData)
      }
    }).catch((error) => {
      console.log('error', error)
      /* Error! return the error with statusCode 400 */
      return {
        statusCode: 400,
        body: JSON.stringify(error)
      }
    })
}