/* Import faunaDB sdk */
const faunadb = require("faunadb");
const q = faunadb.query;

exports.handler = (event, context, callback) => {
  console.log("Function `meet-read` invoked");
  /* configure faunaDB Client with our secret */
  const client = new faunadb.Client({
    secret: process.env.FAUNADB_SERVER_SECRET,
  });
  const id = event.body
  console.log(`Function 'users-read' invoked. read id: ${id}`)
  return client
    .query(q.Get(q.Ref(q.Collection("users"), id)))
    .then((response) => {
      console.log("user found", response);
      return {
        statusCode: 200,
        body: JSON.stringify({ ...response.data, id: response.ref.id }),
      };
    })
    .catch((error) => {
      console.log("error", error);
      return {
        statusCode: 400,
        body: JSON.stringify(error),
      };
    });
};
