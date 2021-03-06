const express = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const {verificaToken, verificaAdmin_Role} = require('../middlewares/authenticacion')

const app = express();
app.get('/usuario', verificaToken, function (req, res) {
    // return res.json({//esto es solo para ver al usuario que está dentro del token
    //     usuario: req.usuario,
    //     nombre: req.usuario.nombre,
    //     email: req.usuario.email,
    // });
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);
    console.log('desde', desde);
    Usuario.find({estado: true}, 'nombre email role estado google img')//lo que va entre comillas define cuales son los campos que queremos ver, (evitamos recuperar todos)
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Usuario.estimatedDocumentCount({estado: true}, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    conteo
                });
            });

        });
});

app.post('/usuario', [verificaToken, verificaAdmin_Role], function (req, res) {
    let body = req.body;
    //recivimos los parámetros enviados desde la vista
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10), //aquí encriptamos la contraseña
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        // usuarioDB.password = null;
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });

    // if (body.nombre === undefined) { //de ejercicios anteriores
    //     res.status(400).json({
    //         ok: false,
    //         mensaje: 'El nombre es necesario.'
    //     })
    // } else {
    //     res.json({
    //         body
    //     })
    // }
})

//para actualizaciones
app.put('/usuario/:id', [verificaToken,verificaAdmin_Role], function (req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);//esto me permite recuperar solo las propiedades que quiero de un objeto

    Usuario.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, usuarioBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioBD
        });
    });
});
app.delete('/usuario/:id', [verificaToken,verificaAdmin_Role], function (req, res) {
    // let id = req.params.id;
    // eliminación física
    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    //     if (err) {
    //         return res.status((400).json({
    //             ok: false,
    //             err
    //         }));
    //     }

    // if (!usuarioBorrado) {
    //     return res.status(400).json({
    //         ok: false,
    //         err: {
    //             message: 'Usuario no encontrado'
    //         }
    //     });
    // }

    // res.json({
    //     ok: true,
    //     usuarioBorrado
    // });
    // });
    //para actualizar un solo campo, el cuál es el estado, esto en lugar de realizar la eliminacion
    let id = req.params.id;
    let cambiaEstado = {
        estado: false
    }
    Usuario.findByIdAndUpdate(id, cambiaEstado, {new: true}, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }
        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    });
});

module.exports = app;