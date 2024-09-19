const express = require('express');
const bcrypt = require('bcryptjs')
const passport = require('passport')

const router = express.Router();

// user models
const User = require('../models/User')

// LOGIN
router.get('/login', (req, res)=>{
    res.render('login')
})

// REGISTER
router.get('/register', (req, res)=>{
    res.render('register')
})

// register post
router.post('/register', (req, res)=>{
    const {name, email, password, password2 } = req.body;
    let errors = [];

    // check required fields
    if(!name || !email || !password || !password2){
        errors.push({msg: 'please fill in all fields'})
    };

    // password check
    if(password !=password2){
        errors.push({msg: 'passwords do not match'})
    };

    // check pass length
    if(password.length < 6){
        errors.push({msg: 'password should be atleast 6 characters '})
    };

    if(errors.length>0){
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        })
    }else{
        // validation pass
        User.findOne({email:email})
        .then(user => {
            if(user){
                // user exist
                errors.push({msg: 'Email is already registered'})
                res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                })
            } else{
                const newUser = new User({
                    name,
                    email,
                    password
                });
                // hash password
                bcrypt.genSalt(10, (err, salt)=>
                 bcrypt.hash(newUser.password, salt, (err, hash)=>{
                    if(err) throw err;
                    // set password to hash
                    newUser.password = hash;
                    // save user
                    newUser.save()
                    .then(user =>{
                        req.flash('success_msg', 'You are now Registered')
                        res.redirect('/users/login');
                    })
                    .catch(err =>console.log(err));
                }))

            }
        });
    }

})

// login post
router.post('/login', (req, res, next)=>{
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
})

// logout
router.get('/logout',(req, res)=>{
    req.logout();
    req.flash('success_msg', 'You are Logged Out');
    res.redirect('/users/login')
})

module.exports = router;