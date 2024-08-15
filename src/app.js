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

const express = require('express');
const app = express();
const productRoutes = require('./routes/product');
const userRoutes = require('./routes/user');

app.use(express.json());

// Configuração das rotas
app.use('/v1/product', productRoutes);
app.use('/v1/user', userRoutes);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
