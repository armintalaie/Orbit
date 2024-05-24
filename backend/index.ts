import express from 'express';
import bodyParser from 'body-parser';
var { ruruHTML } = require("ruru/server")
import { createHandler } from 'graphql-http/lib/use/express';
import { getDb } from './utils/db';
import { schema } from './schema';

const app = express();
app.use(bodyParser.json());

const port = 3000;
const db = await getDb();

app.get("/", (_req, res) => {
    res.type("html")
    res.end(ruruHTML({ endpoint: "/graphql" }))
  })

app.get('/status', (_req, res) => {
    res.json({ status: 'ok' });
});

app.all('/graphql', createHandler({ schema: schema , context: async () => ({db: db}) }));
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

