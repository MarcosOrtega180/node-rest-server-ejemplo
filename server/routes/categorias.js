const express = require('express');
let Categoria = require('../models/categoria');
let {verificaToken, verificaAdmin_Role} = require('../middlewares/authenticacion');
let app = express();


// ============================================
// Mostrar todas las categorías
// ============================================
app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find()
        .sort('descripcion')
        .exec({}, (err, categorias) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                res
            });
        }
        Categoria.estimatedDocumentCount({}, (err, conteo) => {
            res.json({
                ok: true,
                categorias,
                conteo
            })
        });
    });
}); //listar todas las cateogorías

// ============================================
// Mostrar una categoría por ID
// ============================================
app.get('/categoria/:id', verificaToken, ((req, res) => {
    let id = req.params.id;
    // Categoria.findOne(id,{})
    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if(!categoriaDB){
            return res.status(500).json({
                ok: false,
                err:{
                    message: 'El ID no es correcto'
                }
            });
        }
        res.json({
            ok:true,
            categoria: categoriaDB
        });

    });

}))
// ============================================
// Crear una nueva categoría
// ============================================
app.post('/categoria', verificaToken, ((req, res) => {
    // inserta una nueva cateogría y regresa la nueva cateogría
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuarios: req.usuario._id
    });
    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'primer error',
                err,
            })
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                message: 'segundo error',
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
}))

// ============================================
// Actualizar una categoría
// ============================================
app.put('/categoria/:id', verificaToken, ((req, res) => {
    // actualizamos la categoría, solo hace falta actualizar el nombre
    let id = req.params.id;
    let body = req.body;
    let descCategoria = {
        descripcion: body.descripcion
    }
    Categoria.findByIdAndUpdate(id, descCategoria, {new: true, runValidators: true}, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
}))

// ============================================
// Crear una nueva categoría
// ============================================
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], ((req, res) => {
    // que solo un administrador pueda borrar la categorías
    // hay que elimarla físicamente
    let id = req.params.id;
    Categoria.findByIdAndRemove(id, (err, categoriaBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaBD) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            message: 'Categoría eliminada',
            categriaElimada: categoriaBD
        });
    })
}))
module.exports = app;