const { Router } = require('express');
const { validationResult, check } = require('express-validator');
const router = Router();
const EstadoEquipo = require('../models/EstadoEquipo');

router.post('/',
[
    check('nombre', 'nombre.require').not().isEmpty(),
    check('estado', 'estado.require').not().isEmpty(),
],

async function(req, res) {
    try {
        console.log(req.body);
        
        let estadoEquipo = await EstadoEquipo.findOne({ nombre: req.body.nombre });
        if (estadoEquipo) {
            return res.status(400).send('Estado ya existe');
        }
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ messages: errors.array() });
        }
        
        estadoEquipo = new EstadoEquipo();
        estadoEquipo.nombre = req.body.nombre;
        estadoEquipo.estado = req.body.estado;
        estadoEquipo.fechaCreacion = new Date();
        estadoEquipo.fechaActualizacion = new Date();
       

       // guardamos
       estadoEquipo = await estadoEquipo.save();
       res.send(estadoEquipo);
    } catch (error) {
       console.log(error);
       res.status(500).send('Ocurrio un error en servidor');
    }
});

router.get('/', async function(req, res) {
    try {
        const estadoEquipos = await EstadoEquipo.find(); // []
        res.send(estadoEquipos);
    } catch (error) {
       console.log(error);
       res.status(500).send('Ocurrio un error en servidor');
    }
});

// PUT http://localhost:3000/estado-equipo 
router.put('/:estadoEquipoId',
[
    check('nombre', 'nombre.require').not().isEmpty(),
    check('estado', 'estado.require').isIn(['Activo', 'Inactivo']),
],

async function(req, res) {
    try {
        console.log(req.body, req.params.estadoEquipoId);
       
        let estadoEquipo = await EstadoEquipo.findById(req.params.estadoEquipoId);
        if (!estadoEquipo) {
            return res.status(400).send('Estado no existe');
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ messages: errors.array() });
        }

       estadoEquipo.nombre = req.body.nombre;
       estadoEquipo.estado = req.body.estado;
       estadoEquipo.fechaActualizacion = new Date();
       // guardamos
       estadoEquipo = await estadoEquipo.save();
       res.send(estadoEquipo);
    } catch (error) {
       console.log(error);
       res.status(500).send('Ocurrio un error en servidor');
    }
});

module.exports = router;