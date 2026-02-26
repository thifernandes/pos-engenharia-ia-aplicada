// Importa o Express
const express = require('express');
const app = express();

// Importa rotas
const routes = require('./src/routes');
app.use('/', routes);

// Faz o servidor escutar na porta 3000
app.listen(3000, () => {
  console.log('Servidor iniciado em http://localhost:3000');
});