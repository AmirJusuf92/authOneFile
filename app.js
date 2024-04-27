//paketi
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

//def osnovnih funkcija 
const app = express();
app.use(express.json());

//userSchema mongoose paket
const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        minlenght:3
    },
    email:{
        type:String,
        required:true,
        minlenght:5
    },
    password:{
        type:String,
        required:true,
        minlenght:5
    }
    
      });
      userSchema.pre('save', function(next) {
        let user = this;
      
        if (!user.isModified('password')) {
          return next();
        }
      /*
        bcrypt
          .genSalt(12)
          .then((salt) => {
            return bcrypt.hash(user.password, salt);
          })
          .then((hash) => {
            user.password = hash;
            next();
          })
          .catch((err) => next(err));*/
})
const User = mongoose.model('User' , userSchema);

//registracija korisnika
app.post('/reg' , async(req , res)=>{
    try{
        const {username , email ,password} = req.body;
        //provjera username-a
        const stanjeUser = await User.findOne({username});
        if(stanjeUser){
            return res.status(400).json({message:'username vec postoji'});



        }   
        const stanjeMail = await User.findOne({email});
        if(stanjeMail){
            return res.status(400).json({message:'mail vec postoji'})
        }    
    
    const newUser = new User({username , email , password});
    await newUser.save();

    res.status(201).json({message:'korisnik spremnjen'})
    }
    catch(err){
        console.error(err);
        res.status(500).json({message:'greska na serveru'})
    }
   

});
//login usera
app.post('/login' , async(req,res)=>{
    try{
        const {username , email , password} = req.body;
    const userName = await User.findOne({username})
    if(!userName){
        return res.status(401).json({message:'korisnik ne postoji'});
    }
    //email
    const userMail = await User.findOne({email})
    if(!userMail){
        return res.status(400).json({message:'email nije pronadjen'});
    }
    // password provjera
    let userPassword = await User.findOne({password});
    if(userPassword){
        return res.status(201).json({message:'korisnik logovan'});

    }
    else if(!password){
        return res.status(400).json({message:'sifra je netacna'});

    }
    //jwt token
    const token = jwt.sign({userName:user.username}, 'secret' , {userMail:user.email} , 'secret' , {expiresIn:'1h'});
    res.json({token});
}catch(err){
    console.error(err);
    res.status(500).json({message:'serverError'})
}
})
app.listen(3000 , ()=>{
    console.log('server je na portu 3000');
})