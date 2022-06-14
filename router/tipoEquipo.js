const { Router } = require('express');
const { validationResult, check } = require('express-validator');
const router = Router();
const TipoEquipo = require('../models/TipoEquipo');

router.post('/', 
[
    check('nombre', 'nombre.require').not().isEmpty(),
    check('estado', 'estado.require').not().isEmpty(),
],
async function(req, res) {
    try {
        console.log(req.body);
        
        let tipoEquipo = await TipoEquipo.findOne({ nombre: req.body.nombre });
        if (tipoEquipo) {
            return res.status(400).send('Tipo ya existe');
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ messages: errors.array() });
        }
        
        tipoEquipo = new TipoEquipo();
        tipoEquipo.nombre = req.body.nombre;
        tipoEquipo.estado = req.body.estado;
        tipoEquipo.fechaCreacion = new Date();
        tipoEquipo.fechaActualizacion = new Date();
       

       // guardamos
       tipoEquipo = await tipoEquipo.save();
       res.send(tipoEquipo);
    } catch (error) {
       console.log(error);
       res.status(500).send('Ocurrio un error en servidor');
    }
});

router.get('/', async function(req, res) {
    try {
        const tipoEquipos = await TipoEquipo.find(); // []
        res.send(tipoEquipos);
    } catch (error) {
       console.log(error);
       res.status(500).send('Ocurrio un error en servidor');
    }
});

// PUT http://localhost:3000/tipoEquipo 
router.put('/:tipoEquipoId', 
[
    check('nombre', 'nombre.require').not().isEmpty(),
    check('estado', 'estado.require').isIn(['Activo', 'Inactivo']),
],
async function(req, res) {
    try {
        console.log(req.body, req.params.tipoEquipoId);
       
        let tipoEquipo = await TipoEquipo.findById(req.params.tipoEquipoId);
        if (!tipoEquipo) {
            return res.status(400).send('Tipo no existe');
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ messages: errors.array() });
        }

       tipoEquipo.nombre = req.body.nombre;
       tipoEquipo.estado = req.body.estado;
       tipoEquipo.fechaActualizacion = new Date();
       // guardamos
       tipoEquipo = await tipoEquipo.save();
       res.send(tipoEquipo);
    } catch (error) {
       console.log(error);
       res.status(500).send('Ocurrio un error en servidor');
    }
});

router.get('/:tipoId', async function(req, res) {
    try {
        console.log(req.params.tipoId)
       const tipo = await TipoEquipo.findById(req.params.tipoId);
       if (!tipo) {
           return res.status(400).send('Tipo no existe');
       }
       res.send(tipo);
    } catch (error) {
       console.log(error);
       res.status(500).send('Ocurrio un error al consultar tipo');
    }
});


module.exports = router;