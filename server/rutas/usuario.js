const express = require('express')

const app = express();
app.get('/usuarios', function (req, res) {
    res.json('get usuarios')
})

app.post('/usuarios', function (req, res) {
    let body = req.body;
    if(body.nombre===undefined){
        res.status(400).json({
            ok:false,
            mensaje: 'El nombre es necesario.'
        })
    }else{
        res.json({
            body
        })
    }
})
app.put('/usuarios/:id', function (req, res) {
    let id = req.params.id;

    res.json({
        id:id
    });
})
app.delete('/usuarios', function (req, res) {
    res.json('delete usuarios')
})

module.exports = app;