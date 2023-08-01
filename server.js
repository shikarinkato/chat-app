import { app } from "./app.js";
import { connectToMongo } from "./data/db.js";

const port = process.env.PORT;

connectToMongo();

app.listen(port, () => {
  console.log(`Server is working on http://localhost:${port}`);
});
