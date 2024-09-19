const express = require('express');
const {ensureAuthenticated} = require('../config/auth')

const router = express.Router();

router.get('/', (req, res)=>{
    res.render('welcome')
})

router.get('/dashboard',ensureAuthenticated ,(req, res)=>{
    const user = req.user.name
    res.render('dashboard',{
    name : user
    })
    // res.sendFile(__dirname + '/views/dashboard.html')
    
})

module.exports = router;