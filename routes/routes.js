const express = require('express');

const router = express.Router();
// const fs = require('fs');
const crudRoutes = require('./crud');

router.use(crudRoutes);

module.exports = router;
