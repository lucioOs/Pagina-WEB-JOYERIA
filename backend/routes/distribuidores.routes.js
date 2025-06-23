const express = require('express');
const router = express.Router();
const { getDistribuidores } = require('../controllers/distribuidores.controller');

router.get('/', getDistribuidores);

module.exports = router;
