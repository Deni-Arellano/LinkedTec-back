// Importa el módulo express
const express = require('express');

// Crea una aplicación Express
const app = express();

// Define el puerto en el que el servidor escuchará
const PORT = process.env.PORT || 3000;

// Configura una ruta que responde con "Hola, Mundo"
app.get('/', (req, res) => {
  res.send('Hola, Mundo!');
});

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
