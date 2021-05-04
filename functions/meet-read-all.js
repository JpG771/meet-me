/* Import faunaDB sdk */
const faunadb = require("faunadb");
const q = faunadb.query;

exports.handler = (event, context, callback) => {
  console.log("Function `meet-read-all` invoked");
  /* configure faunaDB Client with our secret */
  const client = new faunadb.Client({
    secret: process.env.FAUNADB_SERVER_SECRET,
  });
  return client
    .query(q.Paginate(q.Match(q.Ref("indexes/all_meets"))))
    .then((response) => {
      const meetsRefs = response.data;
      console.log("meets refs", meetsRefs);
      console.log(`${meetsRefs.length} meets found`);
      // create new query out of todo refs. http://bit.ly/2LG3MLg
      const getAllTodoDataQuery = meetsRefs.map((ref) => {
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
