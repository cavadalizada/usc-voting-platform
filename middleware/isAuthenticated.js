const User = require("../models/User")
const jwt = require('jsonwebtoken')
const config = require('config')


const isAuthenticated = async(req,res, next) => {
    

    try {
        if(!req.cookies){
            return res.status(401).redirect('/login')
        }
        const token = req.cookies["token"]
        if(!token){
            return res.status(401).redirect('/login')
        }
        const decodedToken = jwt.verify(token, config.get('JWTtoken'))
        const user = await User.findOne({_id:decodedToken.id, 'tokenList.token': token})
        if(!user){
            return res.status(401).redirect('/login')
        }

        req.token = token
        req.user = user
        return next()
    } catch (error) {
        console.log(error)
        return res.status(401).redirect('/login')
    }

}

module.exports = isAuthenticated