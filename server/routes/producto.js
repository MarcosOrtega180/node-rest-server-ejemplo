const express = require('express')

const {verificaToken} = require('../middlewares/authenticacion');

let app = express();

let Producto = require('../models/producto')

//===================================
// Obtener todos los productos
//===================================
app.get('/productos', (req, res) => {
    //traer todos los productos
    //poppulate: usuarios categoria
    //paginado
});
//=========================================
//Obtener un producto por ID
//=========================================
app.get('/productos:id', (req, res) => {
    //populate:usuarios categoria
    //paginado
});

//=========================================
// Crear un nuevo producto
//=========================================
app.post('/productos', verificaToken, (req, res) => {
    //grabar el usuarios
    //grabar una categoria del listado
    let body = req.body;
    let producto = new Producto({
        usuarios: req.usuario._id
    });
});

//=========================================
//actualizar un registro
//=========================================
app.put('/productos:id', (req, res) => {
    //populate:usuarios categoria
    //paginado
});


//=========================================
//borrar un producto
//=========================================
app.delete('/productos:id', (req, res) => {
    //en lugar de borrarlo cambiamos su estdo, hay que cambiar el estado disponible a falso
});
module.exports = app;