const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
let Schema = mongoose.Schema;


//personalmente creo que el nombre de este Schema debería estar en mayusculas, después de todos es un tipo de objeto
let categoriaSchema = new Schema({
    descripcion: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    usuario: {
        type: String,
        required: [true, 'El correo es necesario']
    },

});

/*quitamos la contraseña del schema antes de realizar la impresión, de esta manera el campo no aparecerá para el usuarios
// final*/

//le decimos al eschema que utilice un pluggin
categoriaSchema.plugin(uniqueValidator, {message: '{PATH} Debe ser único'});

module.exports = mongoose.model('Categoria', categoriaSchema)