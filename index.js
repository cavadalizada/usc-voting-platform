var cluster = require('cluster');

if (cluster.isMaster) {
  cluster.fork();
  cluster.fork();
  cluster.fork();
  cluster.fork();

} else {

    const express = require('express') 
    const bodyParser = require('body-parser');
    const cookieParser = require('cookie-parser');
    const rateLimit = require("express-rate-limit");
    const slowDown = require("express-slow-down");
    
    const cors = require('cors')
    
    const {connectDB} = require("./config/index")
    
    const apiRoute = require('./routes/apiRoute')

    const publicRoute = require('./routes/publicRoute');

    
    const port = process.env.PORT || 3000
    
    
    var app = express()
    

    app.set('trust proxy', 1);
    app.use(bodyParser.urlencoded({
      extended: true
    }));

    app.use(bodyParser.json());
    
    app.use(cookieParser())
    connectDB()
    
    app.use(express.static(__dirname + '/views'));

    app.use(cors({
      origin: ''
    }))
    const apiLimiter = rateLimit({
      windowMs: 1 * 60 * 1000, // 1 minute
      max: 25
    });

    const speedLimiter = slowDown({
      windowMs: 10 * 60 * 1000, // 15 minutes
      delayAfter: 100, // allow 100 requests per 15 minutes, then...
      delayMs: 500 // begin adding 500ms of delay per request above 100:
      // request # 101 is delayed by  500ms
      // request # 102 is delayed by 1000ms
      // request # 103 is delayed by 1500ms
      // etc.
    });

    app.use('/api',apiLimiter,speedLimiter, apiRoute);
    app.use("/",publicRoute);
    app.use('/*',(req,res)=>{
    
      return res.redirect("/home")
    })
    
    
      app.listen(port,()=>{
    
        console.log("Listening on " + port)
    })
    
    }