/* Import faunaDB sdk */
const faunadb = require("faunadb");
const q = faunadb.query;

exports.handler = (event, context, callback) => {
  console.log("Function `meet-read` invoked");
  /* configure faunaDB Client with our secret */
  const client = new faunadb.Client({
    secret: process.env.FAUNADB_SERVER_SECRET,
  });
  const data = JSON.parse(event.body)
  console.log(`Function 'message-read' invoked. data : ${data}`)
  return client
    .query(q.Get(q.Match(q.Index("user_messages"), data)))
    .then((response) => {
      console.log("messages found", response);
      return {
        statusCode: 200,
        body: JSON.stringify(response.data),
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
