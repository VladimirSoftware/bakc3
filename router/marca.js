const { Router } = require('express');
const { validationResult, check } = require('express-validator');
const router = Router();
const Marca = require('../models/Marca');


router.post('/',
[
    check('nombre', 'nombre.require').not().isEmpty(),
    check('estado', 'estado.require').isIn(['Activo', 'Inactivo']),
],
async function(req, res) {
    try {
        console.log(req.body);
        
        let marca = await Marca.findOne({ nombre: req.body.nombre });
        if (marca) {
            return res.status(400).send('Marca ya existe');
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ messages: errors.array() });
        }
        
        marca = new Marca();
        marca.nombre = req.body.nombre;
        marca.estado = req.body.estado;
        marca.fechaCreacion = new Date();
        marca.fechaActualizacion = new Date();
       

       // guardamos
       marca = await marca.save();
       res.send(marca);
    } catch (error) {
       console.log(error);
       res.status(500).send('Ocurrio un error en servidor');
    }
});

router.get('/', async function(req, res) {
    try {
        const marcas = await Marca.find(); // []
        res.send(marcas);
    } catch (error) {
       console.log(error);
       res.status(500).send('Ocurrio un error en servidor');
    }
});

// PUT http://localhost:3000/marca 
router.put('/:marcaId',
[
    check('nombre', 'nombre.require').not().isEmpty(),
    check('estado', 'estado.require').isIn(['Activo', 'Inactivo']),
],

async function(req, res) {
    try {
        console.log(req.body, req.params.marcaId);
       
        let marca = await Marca.findById(req.params.marcaId);
        if (!marca) {
            return res.status(400).send('Marca no existe');
        }
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ messages: errors.array() });
        }

       marca.nombre = req.body.nombre;
       marca.estado = req.body.estado;
       marca.fechaActualizacion = new Date();
       // guardamos
       marca = await marca.save();
       res.send(marca);
    } catch (error) {
       console.log(error);
       res.status(500).send('Ocurrio un error en servidor');
    }
});

module.exports = router;