const { Router } = require('express');
const router = Router();
const Marca = require('../models/Marca');
const { validarMarca } = require('../helpers/validarmarca');

router.post('/', async function(req, res) {
    try {
        const validaciones = validarMarca(req);
        if (validarMarca.length > 0){
            return res.status(400).send(validaciones);
        }
        console.log(req.body);
        
        let marca = await Marca.findOne({ nombre: req.body.nombre });
        if (marca) {
            return res.status(400).send('Marca ya existe');
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
router.put('/:marcaId', async function(req, res) {
    try {
        console.log(req.body, req.params.marcaId);
       
        let marca = await Marca.findById(req.params.marcaId);
        if (!marca) {
            return res.status(400).send('Marca no existe');
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