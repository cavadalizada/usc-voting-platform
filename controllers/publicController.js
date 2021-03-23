const config = require('config')

const { render } = require('pug')

//const {sendOTP} = require('../mail/mail')


exports.getLogin = async(req,res) => {


    return res.render("login.pug")
}


exports.getHomeRep = async (req,res) =>{

    if(req.user.faculty=="CS")
    return res.render("homeRepCS.pug",{Name:req.user.firstname,Surname:req.user.lastname})
    if(req.user.faculty=="CE")
    return res.render("homeRepCE.pug",{Name:req.user.firstname,Surname:req.user.lastname})
    if(req.user.faculty=="FY")
    return res.render("homeRepFY.pug",{Name:req.user.firstname,Surname:req.user.lastname})
    if(req.user.faculty=="PE")
    return res.render("homeRepPE.pug",{Name:req.user.firstname,Surname:req.user.lastname})
    if(req.user.faculty=="GE")
    return res.render("homeRepGE.pug",{Name:req.user.firstname,Surname:req.user.lastname})

}


exports.getHomePre = async (req,res) =>{

    return res.render("homePre.pug",{Name:req.user.firstname,Surname:req.user.lastname})
}