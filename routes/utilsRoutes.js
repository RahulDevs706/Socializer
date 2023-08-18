const express = require('express');
const { getNews, getWeatherInfo } = require('../controller/utilsController');
const { isAuthenticated } = require('../middleware/auth');
const router = express.Router()

router.route('/news').get(isAuthenticated, getNews)
router.route('/weather').post(isAuthenticated, getWeatherInfo)

module.exports = router;