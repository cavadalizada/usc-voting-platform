const config = require('config')
const nodemailer = require('nodemailer');


const sendLoginMail = async (target,verifyCode) =>{

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'uscvotingplatform@gmail.com',
      pass: config.get("GOOGLE_API_KEY")
    }
  });

  const mailOptions = {
    from: 'uscvotingplatform@gmail.com',
    to: target,
    subject: `Login to USC Vote`,
    html: `Here is your OTP code <b> ${verifyCode} </b>, use this code to login at the platform. `,
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
    console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

const sendVoteMail = async (target,name,lastname) =>{

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'uscvotingplatform@gmail.com',
      pass: config.get("GOOGLE_API_KEY")
    }
  });

  const mailOptions = {
    from: 'uscvotingplatform@gmail.com',
    to: target,
    subject: `Receipt of Vote`,
    html: `Your vote for <b>${name} ${lastname} </b> has successfully been counted.\n Thank you for your participation in this election.`,
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
    console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

module.exports = {sendLoginMail,sendVoteMail}