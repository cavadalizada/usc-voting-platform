const bcrypt = require(`bcrypt`)
const jwt = require(`jsonwebtoken`)
const config = require('config')


const User = require('../models/User')
const Candidate = require('../models/Candidate')


// Login controller
exports.login = async (req,res)=>{
    var { email, otp } = req.body
    if(!email && !otp){
        return res.status(400).json({"msg":"specify options"})
    }
    // if email entered
    if (email && !otp ) {
    try {
        email = email.toLowerCase()
     // checkemail
      const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      if(!emailRegexp.test(email)){
          return res.status(400).json({msg: 'Email incorrect'})
      }
      if (!/@ufaz.az\s*$/.test(email)) {
          return res.status(400).json({msg: "Not an UFAZ mail"})
        } 
        var test = await User.findOne({email})

        if(test==null){ // If user exists in database

            return res.status(400).json({msg:"email incorrect please contact us"})
        }
    // send otp
      await User.sendOTP(email)
        
      return res.status(200).json({msg: "Please check your email for OTP code."})
         
        }catch (error) {
            console.log(error)
            return res.status(500).json("Internal Server ERROR")
        }
    }
// if both email and otp specified
    if (email && otp ) {
        try {
            email = email.toLowerCase()
            otp = parseInt(otp)
            if(typeof(otp)!= "number" || !otp){
                return res.status(400).json({"msg":"please enter a number"})
            }
            var user = await User.findOne({email})
            if(user==null){ // If user doesn't exists in database
                return res.status(404).json({msg:"something went wrong"})
            }
            if(otp==user.otpCode){       
                user.otpCode = null;
                const token = jwt.sign({"id":user._id},config.get('JWTtoken'),{expiresIn:"1 day"});
                user.tokenList = user.tokenList.concat({ token })
                user.save()
                console.log(user)
                return res.status(302).cookie("token",token,{httpOnly: true,sameSite: 'lax'}).redirect("/home") //secure and some other falgs not used for dev purposes
            }
             return res.status(400).json({"msg":"Wrong code please try again !"})
            }catch (error) {
                console.log(error)
                return res.status(500).json("Internal Server ERROR")
            }
        
    }
}

//Logout
exports.logoutUser = async (req,res)=>{
    
    req.user.tokenList = req.user.tokenList.filter((token)=>{

        return token.token !== req.token
    })
    req.user.save().then().catch()
    
    return res.redirect("/login")
}

exports.castVote=async(req,res)=>{

    if(!req.body.candidate){
        return res.status(400).json({"msg":"Please specify a candidate"})
    }
    // sanitize candidate 
    try {
     // SANITIZE THE CANDIDATE THINGY !!
    var user = await User.findOne({_id:req.user._id})
    var candidate = await Candidate.findOne({email:req.body.candidate})
    if(!candidate){
        return res.status(400).json({"msg":"Something went wrong"})
    }
    const code = user.castVote(candidate)
    if(code == 1){
    return res.status(200).json({"msg":"Success"})
    }
    return res.status(400).json({"msg":"You can't vote anymore"})

    } catch (error) {
    console.log(error)        
    }


    return res.status(200).json({"msg":"casted vote for " + req.body.candidate})
}