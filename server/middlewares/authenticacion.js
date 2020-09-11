const jwt = require('jsonwebtoken'); //imoprtamos el jwt para verificar la validez de nuestro tocken

//===============
// Derificar Token
//===============
let verificaToken = (req, res, next) => {
    let token = req.get('token');//capturo mi token desde el request
    jwt.verify(token,process.env.SEED,(err,decoded)=>{
        if(err){
            return res.status(401).json({
                ok:false,
                err:{
                    message:'Token no válido'
                }
            });
        }
        req.usuario=decoded.usuario;
        next();
    });
}
//===============
// Derificar AdminRole
//===============
let verificaAdmin_Role=(req,res,next)=>{
    let usuario = req.usuario;
    if(usuario.role ==='ADMIN_ROLE'){
        next();
    }else{
        return res.json({
            ok:false,
            err:{
                message: 'El usuario no es administrador'
            }
        })
    }
}

//===============
// Verifica token para llamada imagen desde la web
//===============
let verificaTokenImg=(req,res,next)=>{
    let token = req.query.token;
    jwt.verify(token,process.env.SEED,(err,decoded)=>{
        if(err){
            return res.status(401).json({
                ok:false,
                err:{
                    message:'Token no válido'
                }
            });
        }
        req.usuario=decoded.usuario;
        next();
    });
}
module.exports = {verificaToken,verificaAdmin_Role, verificaTokenImg}