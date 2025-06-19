const express = require('express');
const router = express.Router();
const tipoJoyaCtrl = require('../controllers/tipoJoya.controller');

router.get('/', tipoJoyaCtrl.getTiposJoya);
router.post('/', tipoJoyaCtrl.createTipoJoya);
router.put('/:clave', tipoJoyaCtrl.updateTipoJoya);
router.delete('/:clave', tipoJoyaCtrl.deleteTipoJoya);

module.exports = router;
