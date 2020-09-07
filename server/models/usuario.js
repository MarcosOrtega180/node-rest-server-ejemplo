const mongoose = require('mongoose');

let Schema = mongoose.Schema;
let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        required: [true, 'El coemaio  rreo es necesario']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img: {
        type: String,
        required: false
    },
    roles: {
        default: 'USER_ROLE'
    },
    estado: {
        type: Boolean,
        required: true
    },
    google: {
        type: Boolean,
        required: false
    }
});

module.exports = mongoose.model('Usuario', usuarioSchema)