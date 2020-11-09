const app = require("./index");
const port = process.env.PORT || 3030;
app.listen(port, () =>
  console.log(`Server running on ${port}, http://localhost:${port}`)
);
