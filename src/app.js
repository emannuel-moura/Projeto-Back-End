const express = require('express');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config();

const app = express();
app.use(express.json());

app.use('/api/users', userRoutes);

module.exports = app;

const express = require('express');
const userRoutes = require('./routes/user');

const app = express();

app.use(express.json());
app.use(userRoutes);

module.exports = app;
