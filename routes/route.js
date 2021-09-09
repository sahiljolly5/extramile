const router = require('express').Router()
const User = require('../models/user')

router.get('/',(req,res) => {
    res.render('signin')
})

router.get('/signup',(req,res) => {
    res.render('signup')
})

router.post('/postSignin',async (req,res) => {
    // console.log(req.body);
    var email = req.body.username;
    var password = req.body.password
    const result = await User.find({email:email,password:password})
    console.log(result);

    // res.render('signup')
})

router.post('/postSignup',async (req,res) => {
    // console.log(req.body);
    var data = {
        name:req.body.name,
        email:req.body.email,
        phone:req.body.phone,
        password:req.body.password
    }
    const result = await new User(data).save()
    // console.log(result);
    // res.render('signup')
})


module.exports = router