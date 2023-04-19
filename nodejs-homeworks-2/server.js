const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const morgan = require('morgan');
const bp = require('body-parser');
const connect = require('./src/db/connections');
const cors = require('cors');
app.use(cors());
app.use(bp.json());
app.use(bp.urlencoded({extended: true}));
app.use(morgan('dev'));

const usersRouter = require('./src/routes/userRoutes');
const notesRouter = require('./src/routes/noteRoutes');
const authRouter = require('./src/routes/credentialRoutes');

app.use('/', usersRouter);
app.use('/', notesRouter);
app.use('/', authRouter);

connect();

app.listen(port);
