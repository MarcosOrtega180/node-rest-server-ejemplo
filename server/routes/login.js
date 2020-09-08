const express = require('express');
const bcrypt = require('bcrypt'); //para encriptar mis contraseñas antes de guardarlas en la base de datos
const jwt = require('jsonwebtoken');//generan los tokens que dan acceso una vez que se ha logeado el usuario
const _ = require('underscore');
const Usuario = require('../models/usuario');
const app = express();

//entramos a la parte del loggin y los hach

//para las autenticaciones utilizaremos post
app.post('/login', (req, res) => {
    let body = req.body;
    Usuario.findOne({email: body.email}, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "(Usuario) o contraseña incorrectos"
                }
            });
        }

        //verificamos la contraseña
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o (contraseña) incorrectos'
                }
            });
        }
        let token = jwt.sign({usuario: usuarioDB}, process.env.SEED, {expiresIn: process.env.expiresIn});
        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });
    });

});


module.exports = app;