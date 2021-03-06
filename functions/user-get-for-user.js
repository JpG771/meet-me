/* Import faunaDB sdk */
const faunadb = require("faunadb");
const q = faunadb.query;

exports.handler = (event, context, callback) => {
  console.log("Function `user-get-for-user` invoked");
  /* configure faunaDB Client with our secret */
  const client = new faunadb.Client({
    secret: process.env.FAUNADB_SERVER_SECRET,
  });
  const data = event.body
  console.log(`Function 'user-get-for-user' invoked. data : ${data}`)
  return client
    .query(q.Get(q.Match(q.Index("user_detail_for_user"), data)))
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
