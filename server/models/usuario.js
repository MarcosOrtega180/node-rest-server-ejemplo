const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
let Schema = mongoose.Schema;

//ENUM ROLES
let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} NO es un rol válido'
}

//personalmente creo que el nombre de este Schema debería estar en mayusculas, después de todos es un tipo de objeto
let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        unique: true,
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
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: true,
        required: false
    }
});

/*quitamos la contraseña del schema antes de realizar la impresión, de esta manera el campo no aparecerá para el usuario
// final*/
usuarioSchema.methods.toJSON = function () {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject
}

//le decimos al eschema que utilice un pluggin
usuarioSchema.plugin(uniqueValidator, {message: '{PATH} Debe ser único'});

module.exports = mongoose.model('Usuario', usuarioSchema)