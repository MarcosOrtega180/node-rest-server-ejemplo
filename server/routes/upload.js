const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Usuario = require('../models/usuario');
const Producto = require('../models/producto')
const fs = require('fs');
const path = require('path');

//default options
app.use(fileUpload({useTempFiles: true}));
app.put('/upload/:tipo/:id', function (req, res) {
    let tipo = req.params.tipo;
    let id = req.params.id;
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccinado ningún archivo'
            }
        })
    }
    //validar tipos
    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidos son ' + tiposValidos.join(', ')
            }
        })
    }
    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];
    //validación de extensiones
    let extensionesValidad = ['png', 'jpg', 'gif', 'jpeg'];
    if (extensionesValidad.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son ' + extensionesValidad.join(', ')
            }
        })
    }

    // Cambiar nombre al archivo
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;
    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        // Aqui, imagen cargada
        if (tipo == 'productos') {
            imagenProducto(id, res, nombreArchivo)
        } else if (tipo == 'usuarios') {
            imagenUsuario(id, res, nombreArchivo);
        }

    });

});

function imagenUsuario(id, res, nombreArchivo) {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borraArchivo(usuarioDB.img, 'usuarios');
            return res.status(500).json({
                res: false,
                err
            });
        }
        if (!usuarioDB) {
            borraArchivo(usuarioDB.img, 'usuarios');
            return res.status(400).json({
                res: false,
                err: {
                    message: 'El usuario no existe'
                }
            });
        }

        borraArchivo(usuarioDB.img, 'usuarios');
        usuarioDB.img = nombreArchivo;
        usuarioDB.save((err, usuarioGuardado) => {
            res.json({
                ok: true,
                img: `Archivo ${nombreArchivo} cargado!`,
                eusuario: usuarioGuardado
            });
        });

    });
}

function imagenProducto(id, res, nombreArchivo) {
    Producto.findById(id, (err, productoBD) => {
        if (err) {
            borraArchivo(productoBD.img, 'productos');
            return res.status(500).json({
                res: false,
                err
            });
        }
        if (!productoBD) {
            borraArchivo(productoBD.img, 'productos');
            return res.status(400).json({
                res: false,
                err: {
                    message: 'El producto no existe'
                }
            });
        }

        borraArchivo(productoBD.img, 'productos');
        productoBD.img = nombreArchivo;
        productoBD.save((err, productoGuardado) => {
            res.json({
                ok: true,
                img: `Archivo ${nombreArchivo} cargado!`,
                producto: productoGuardado
            });
        });

    });
}

function borraArchivo(nombreImagen, tipo) {
    //borra la imágen anterior en caso que no exista
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app;