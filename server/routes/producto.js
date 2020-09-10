const express = require('express')

const {verificaToken} = require('../middlewares/authenticacion');

let app = express();

let Producto = require('../models/producto')

//===================================
// Obtener todos los productos
//===================================
app.get('/producto', (req, res) => {
    //traer todos los productos
    //poppulate: usuarios categoria
    //paginado
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let hasta = req.query.hasta || 10;
    hasta = Number(hasta);
    Producto.find({disponible: true})
        .skip(desde)
        .limit(hasta)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productosBD) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productosBD
            })
        });
});
//=========================================
//Obtener un producto por ID
//=========================================
app.get('/producto/:id', verificaToken, (req, res) => {
    //populate:usuarios categoria
    //paginado
    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoBD) => {
            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if(!productoBD){
                return res.status(400).json({
                    ok:false,
                    err
                });
            }
            res.json({
                ok:true,
                producto:productoBD
            })
        });
    // ((err,productoBd)=>{
    // if(err){
    //     return res.status(500).json({
    //         ok:false,
    //         err
    //     });
    // });

});

//=========================================
// Crear un nuevo producto
//=========================================
app.get('/producto/buscar/:termino',verificaToken,(req,res)=>{
    let termino=req.params.termino;
    //para buscar like la i es para que sea insensible al temrino
    let regex = new RegExp(termino, 'i')
    Producto.find({nombre:regex}).populate('categoria','nombre').exec((err,productos)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }
        res.json({
            ok:true,
            producto:productos
        })
    });
});
// =========================================
// Crear un nuevo producto
//=========================================
app.post('/producto', verificaToken, (req, res) => {
    //grabar el usuarios
    //grabar una categoria del listado
    let body = req.body;
    let producto = new Producto({
        usuarios: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        res.status(201).json({
            ok: true,
            producto: productoDB
        });
    });
});

//=========================================
//actualizar un registro
//=========================================
app.put('/producto/:id', (req, res) => {
    //populate:usuarios categoria
    //paginado
    let id = req.params.id;
    let body = req.body;
    Producto.findById(id, (err, productoBD) => {
        console.log('llegó hasta aquí', productoBD);
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            });
        }
        console.log('llegó hasta aquí');

        productoBD.nombre = body.nombre;
        productoBD.precioUni = body.precioUni;
        productoBD.descripcion = body.descripcion;
        productoBD.disponible = body.disponible;
        productoBD.categoria = body.categoria;

        productoBD.save((err, productoGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                producto: productoGuardado
            });
        })
    })
});


//=========================================
//borrar un producto
//=========================================
app.delete('/producto/:id', (req, res) => {
    //en lugar de borrarlo cambiamos su estdo, hay que cambiar el estado disponible a falso
    let id = req.params.id;
    Producto.findById(id,(err,productoDB)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            });
        }
        if(!productoDB){
            return res.status(400).json({
                ok:false,
                err:{
                    message: 'ID no existe'
                }
            });
        }
        productoDB.disponible = false;
        productoDB.save((err,productoBorrado)=>{
            if(err){
                return res.status(500).json({
                    ok:false,
                    err
                });
            }
            res.json({
                ok:true,
                producto: productoBorrado,
                message:'Producto borrado'
            })
        })
    });
});
module.exports = app;