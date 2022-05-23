const { Router } = require('express');
const router = Router();
const Usuario = require('../models/Usuario');
const { validarUser } = require('../helpers/validaruser');

router.post('/', async function(req, res){
    try {
        const validaciones = validarUser(req);
        if (validaciones.length > 0){
            return res.status(400).send(validaciones);
        }
        
        const existeUsuario = await Usuario.findOne({ email: req.body.email });
        console.log('Respuesta existe usuario', existeUsuario);
        if (existeUsuario) {
            return res.status(400).send('Email ya existe');
        }
    let usuario = new Usuario();
    usuario.nombre = req.body.nombre;
    usuario.email = req.body.email;
    usuario.estado = req.body.estado;
    usuario.fechaCreacion = new Date();
    usuario.fechaActualizacion = new Date();

    usuario = await usuario.save();

    res.send(usuario);
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrio un error');
    }
    
});

router.get('/', async function(req, res) {
    try {
        const usuarios = await Usuario.find(); // []
        res.send(usuarios);
    } catch (error) {
       console.log(error);
       res.status(500).send('Ocurrio un error en servidor');
    }
});

// PUT http://localhost:3000/usuario 
router.put('/:usuarioId', async function(req, res) {
    try {
        console.log(req.body, req.params.usuarioId);
       
        let usuario = await Usuario.findById(req.params.usuarioId);
        if (!usuario) {
            return res.status(400).send('Usuario no existe');
        }

        usuario.nombre = req.body.nombre;
        usuario.email = req.body.email;
        usuario.estado = req.body.estado;
        usuario.fechaActualizacion = new Date();
       // guardamos
       usuario = await usuario.save();
       res.send(usuario);
    } catch (error) {
       console.log(error);
       res.status(500).send('Ocurrio un error en servidor');
    }
});


module.exports = router;