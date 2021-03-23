const {Router} = require('express');

const publicController = require('../controllers/publicController')

const isAuthenticated = require("../middleware/isAuthenticated")


const app = Router();

app.get('/login',publicController.getLogin)
app.get('/home',isAuthenticated,publicController.getHomeRep)
app.get('/homeRep',isAuthenticated,publicController.getHomeRep)
app.get('/homePre',isAuthenticated,publicController.getHomePre)
app.get('/',isAuthenticated,publicController.getHomeRep)


module.exports = app;