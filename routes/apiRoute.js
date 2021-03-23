const {Router} = require('express');
const rateLimit = require("express-rate-limit");

const apiController = require('../controllers/apiController')

const isAuthenticated = require("../middleware/isAuthenticated")

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minute
    max: 4
  });

const app = Router();


app.post('/login',apiLimiter, apiController.login)

app.get('/logout',isAuthenticated, apiController.logoutUser)

app.post('/vote',isAuthenticated,apiController.castVote)




module.exports = app;