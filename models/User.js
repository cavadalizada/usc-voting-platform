const { Schema, model } = require('mongoose')

const { sendLoginMail,sendVoteMail } = require('../mail/mail');
const Candidate = require('./Candidate');
const Vote = require('./Vote');


const userSchema = new Schema({
  firstname: {
    type: String,
    required: true,
    trim: true
  },
  lastname: {
    type: String,
    required: true,
    trim: true,
  },
  email:{
    type: String,
    required : true,
    unique: true,
    trim: true,
    validate(value) {
      const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      if(!emailRegexp.test(value)){
          throw new Error('Email invalid')
      }
      if (!/@ufaz.az\s*$/.test(value)) {
          throw new Error('Not an UFAZ mail')
            } 
    }
  },
  tokenList:[{
    token:{
      type: String,
    }
  }],
  otpCode:{
    type: Number
  },
  faculty:{
    type: String,
    required: true
  },
  hasVoted:{  // 0 hasn't voted 1 has voted for representative 2 has vote for pres/vp 3 has voted for both
    type: Number,
    required: true

  },
  register_date: {
    type: Date,
    default: Date.now
  }
});

// Registers an User with given values
userSchema.statics.registerUser = async (firstname,lastname,email,faculty,hasVoted) => {  

  var user = new User;
  console.log(firstname,lastname,email,faculty,hasVoted)
  // isnt there a better way to batch equal?
  user.firstname = firstname
  user.lastname = lastname
  user.email = email
  user.faculty= faculty
  user.hasVoted = hasVoted
  console.log(user)
  await user.save().catch((err)=>{console.log(err)})

}
userSchema.statics.sendOTP = async (email) => {  

  var user = await User.findOne({email})  // ???????????????


  const otpCode = Math.floor(Math.random() *(9999-1000) + 1000)


  user.otpCode = otpCode

  sendLoginMail(email,otpCode);
  

  user.save();
  console.log(user)
  return user
}


userSchema.methods.castVote = function(candidate){  

  if(this.hasVoted==3){
    return 0;
  }

  if((this.hasVoted==1 || this.hasVoted==0) && candidate.position =="President"){

  var vote = new Vote;

    vote.user = this._id;
    vote.candidate = candidate._id;
    
    this.hasVoted = this.hasVoted + 2;
    this.save()
    vote.save()
    sendVoteMail(this.email,candidate.firstname,candidate.lastname)
    return 1;
  }
  if((this.hasVoted==2 || this.hasVoted ==0) && candidate.position =="Representative" && this.faculty == candidate.faculty){
    var vote = new Vote;

    vote.user = this._id;
    vote.candidate = candidate._id;
    
    this.hasVoted = this.hasVoted + 1;
    this.save()
    vote.save()
    sendVoteMail(this.email,candidate.firstname,candidate.lastname)
    return 1;
  }
  return 0;
}

const User = model('User', userSchema)

module.exports = User;