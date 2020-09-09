//===============
//Puerto
//===============
process.env.PORT = process.env.PORT || 3000;

//===============
// Enviromento
//===============
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'


//===============
// Vencimiento del token
//===============
// 60 segundos, 60minutos, 24 horas, 30 días
process.env.expiresIn = 60 * 60 * 24 * 30

//===============
// Seed de autenticación
//===============
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo'

//===============
// Data Base
//===============


let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

// ===============
// google client id
//===============
process.env.CLIENT_ID = process.env.CLIENT_ID || '940899324344-72hiq0te30bq09mt4ijfnbpgnbke4238.apps.googleusercontent.com';
process.env.URLDB = urlDB;