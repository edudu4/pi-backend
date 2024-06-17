const express = require('express');
const fs = require('fs');
const swaggerUI = require('swagger-ui-express');
const yaml = require('yaml');

const file = fs.readFileSync('./swagger.yaml', 'utf-8');
const swaggerDoc = yaml.parse(file);

const router = express.Router();

router.use('/', swaggerUI.serve);
router.get('/', swaggerUI.setup(swaggerDoc));

module.exports = router;