//===============
//Puerto
//===============
process.env.PORT = process.env.PORT || 3000;

//===============
// Enviromento
//===============
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

//===============
// Data Base
//===============

let urlDB;
if(process.env.NODE_ENV==='dev'){
    urlDB = 'mongodb://localhost:27017/cafe';
}else{
    urlDB='mongodb+srv://marcosOrtega180:5eFCZTEVFig8zWb@cluster0.ez4vd.mongodb.net/cafe'
}

process.env.URLDB=urlDB;