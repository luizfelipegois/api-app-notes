const express = require('express');
const cors = require('cors');
const databaseConnection = require('./database');

const app = express();

app.use(express.json());
app.use(cors());

app.listen(process.env.PORT || 3001, databaseConnection());
