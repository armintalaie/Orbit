import express from 'express';
import bodyParser from 'body-parser';
var { ruruHTML } = require("ruru/server")
import { createHandler } from 'graphql-http/lib/use/express';
import { getDb } from './utils/db';
import { schema } from './schema';
import cors from 'cors';
import { initsupabase } from './utils/supabase';

const app = express();
app.use(bodyParser.json());
app.use(cors());
const port = 3000;

const db = await getDb();
const supabase = initsupabase();

app.get("/playground", (_req, res) => {
    res.type("html")
    res.end(ruruHTML({ endpoint: "/graphql" }))
  })

app.get('/status', (_req, res) => {
    res.json({ status: 'ok' });
});

app.use('/graphql', async (req, res, next) => {
    if (!req.headers['authorization']) {
        if (req.headers.origin === 'http://localhost:3000' ) {
            req.context = { user: { id: '1' }};
            next();
            return;
        }
        res.status(401).json({ message: 'Unauthorized - header missing' });
        return;
    }

    const token = req.headers['authorization'];
    const { data, error } = await supabase.auth.getUser(token);

    if (error) {
        console.error(error);
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
    req.context = { user: data.user};
    next();
});

app.all('/graphql',  (req, res, next) => createHandler({ schema: schema , context: async () => ({db: db, user: req.context?.user}) })(req, res, next));

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
