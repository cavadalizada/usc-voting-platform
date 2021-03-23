const { Schema, model } = require('mongoose')



const candidateSchema = new Schema({
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
  faculty:{
    type: String,
    required: true
  },position:{
      type:String,
      required: true
  }
});

// Registers an Candidate with given values
candidateSchema.statics.registerCandidate = async (firstname,lastname,email,position,faculty) => {  

  var candidate = new Candidate;

  // isnt there a better way to batch equal?
  candidate.firstname = firstname
  candidate.lastname = lastname
  candidate.email = email
  candidate.position = position
  candidate.faculty= faculty

  candidate.save()

}

const Candidate = model('candidate', candidateSchema);


module.exports = Candidate;