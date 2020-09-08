require('./config/config');
const express = require('express')
const mongoose = require('mongoose')
const app = express()
const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

//parse aplication/json
app.use(bodyParser.json())

// app.use(require('./routes/usuario'));
//reemplazamos el codigo anterior por el siguiente para importar todoas las rutas de una vez
//configuración global de rutas
app.use(require('./routes/index'));
mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}, (err, res) => {
    if (err) throw err;
    console.log('Base de datos online');
})

app.listen(process.env.PORT, () => {
    console.log('Escuchando en el puerto 3000');
})
