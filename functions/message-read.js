/* Import faunaDB sdk */
const faunadb = require("faunadb");
const q = faunadb.query;

exports.handler = (event, context, callback) => {
  console.log("Function `message-read` invoked");
  /* configure faunaDB Client with our secret */
  const client = new faunadb.Client({
    secret: process.env.FAUNADB_SERVER_SECRET,
  });
  const data = event.body
  console.log(`Function 'message-read' invoked. data : ${data}`)
  return client
    .query(q.Paginate(q.Match(q.Index("user_messages"), data)))
    .then((response) => {
      console.log("messages found", response);
      const messagesRefs = response.data;
      const getAllTodoDataQuery = messagesRefs.map((ref) => {
        return q.Get(ref);
      });
      // then query the refs
      return client.query(getAllTodoDataQuery).then((ret) => {
        return {
          statusCode: 200,
          body: JSON.stringify(ret.map(meet => {
            return { ...meet.data, id: meet.ref.id }
          })),
        };
      });
    })
    .catch((error) => {
      console.log("error", error);
      return {
        statusCode: 400,
        body: JSON.stringify(error),
      };
    });
};
