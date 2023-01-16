const express = require('express');
const cors = require('cors');
const databaseConnection = require('./database');
const userRoutes = require('./routes/user');

const app = express();

app.use(express.json());
app.use(cors());

app.use('/auth', userRoutes);

app.listen(process.env.PORT || 3001, databaseConnection());
