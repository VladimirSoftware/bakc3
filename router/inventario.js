const { Router } = require('express');
const Inventario = require('../models/Inventario');
const Usuario = require('../models/Usuario');
const Marca = require('../models/Marca');
const { validarInventario } = require('../helpers/validar-inventario');

const router = Router();

// GET http://localhost:3000/inventario 
router.get('/', async function(req, res) {
    try {
        const inventarios = await Inventario.find().populate([
            { path: 'usuario', select: 'nombre email estado' },
            { path: 'marca', select: 'nombre estado' },
            { path: 'tipoEquipo', select: 'nombre estado' },
            { path: 'estadoEquipo', select: 'nombre estado' }
        ]); // []
        res.send(inventarios);
    } catch (error) {
       console.log(error);
       res.status(500).send('Ocurrio un error en servidor');
    }
});

// POST http://localhost:3000/inventario 
router.post('/', async function(req, res) {
    try {
        const validaciones = validarInventario(req);
        if (validaciones.length > 0){
            return res.status(400).send(validaciones);
        }
        
        // select * from inventario; lista
        // select * from inventario where serial = ? limit 1
       let inventario = await Inventario.findOne({ serial: req.body.serial });
       if (inventario) {
           return res.status(400).send('Serial ya existe');
       }

       inventario = new Inventario(); //new Iñlnklnnventario(req.body);
       inventario.serial = req.body.serial;
       inventario.modelo = req.body.modelo;
       inventario.descripcion = req.body.descripcion;
       inventario.foto = req.body.foto;
       inventario.fechaCompra = req.body.fechaCompra;
       inventario.precio = req.body.precio;
       inventario.usuario = req.body.usuario._id;
       inventario.marca = req.body.marca._id;
       inventario.tipoEquipo = req.body.tipoEquipo._id;
       inventario.estadoEquipo = req.body.estadoEquipo._id;
       inventario.fechaCreacion = new Date();
       inventario.fechaActualizacion = new Date();
       // guardamos
       inventario = await inventario.save();
       res.send(inventario);
    } catch (error) {
       console.log(error);
       res.status(500).send('Ocurrio un error en servidor');
    }
});

// PUT http://localhost:3000/inventario 
router.put('/:inventarioId', async function(req, res) {
    try {
        console.log(req.body, req.params.inventarioId);
       
        let inventario = await Inventario.findById(req.params.inventarioId);
        if (!inventario) {
            return res.status(400).send('Inventario no existe');
        }
        
        // select * from inventario; lista
        // select * from inventario where serial = ? limit 1
       const invExisteXSerial = await Inventario
                            .findOne({ serial: req.body.serial, _id: { $ne: inventario._id } });
       if (invExisteXSerial) {
           return res.status(400).send('Serial ya existe');
       }

       inventario.serial = req.body.serial;
       inventario.modelo = req.body.modelo;
       inventario.descripcion = req.body.descripcion;
       inventario.foto = req.body.foto;
       inventario.fechaCompra = req.body.fechaCompra;
       inventario.precio = req.body.precio;
       inventario.usuario = req.body.usuario._id;
       inventario.marca = req.body.marca._id;
       inventario.tipoEquipo = req.body.tipoEquipo._id;
       inventario.estadoEquipo = req.body.estadoEquipo._id;
       inventario.fechaActualizacion = new Date();
       // guardamos
       inventario = await inventario.save();
       res.send(inventario);
    } catch (error) {
       console.log(error);
       res.status(500).send('Ocurrio un error en servidor');
    }
});

module.exports = router;