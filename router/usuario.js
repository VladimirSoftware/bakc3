const { Router } = require('express');
const { validationResult, check } = require('express-validator');
const router = Router();
const Usuario = require('../models/Usuario');

router.post('/',
[
    check('nombre', 'nombre.require').not().isEmpty(),
    check('email', 'email.require').isEmail(),
    check('estado', 'estado.require').isIn(['Activo', 'Inactivo']),
],

async function(req, res){
    try {
        console.log(req.body);
        
        const existeUsuario = await Usuario.findOne({ email: req.body.email });
        console.log('Respuesta existe usuario', existeUsuario);
        if (existeUsuario) {
            return res.status(400).send('Email ya existe');
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ messages: errors.array() });
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
router.put('/:usuarioId',
[
    check('nombre', 'nombre.require').not().isEmpty(),
    check('email', 'email.require').isEmail(),
    check('estado', 'estado.require').isIn(['Activo', 'Inactivo']),
],

async function(req, res) {
    try {
        console.log(req.body, req.params.usuarioId);
       
        let usuario = await Usuario.findById(req.params.usuarioId);
        if (!usuario) {
            return res.status(400).send('Usuario no existe');
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ messages: errors.array() });
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