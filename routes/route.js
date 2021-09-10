const router = require('express').Router()
const User = require('../models/user')

router.get('/',(req,res) => {
    res.render('signin',{err:''})
})

router.get('/home',(req,res) => {
    res.render('home')
})

router.get('/signup',(req,res) => {
    res.render('signup')
})

router.post('/postSignin',async (req,res) => {
    // console.log(req.body);
    var email = req.body.username;
    var password = req.body.password
    const result = await User.find({email:email,password:password})
    if(result.length > 0 ) {
        res.redirect('home')
    }
    else {
        res.render('signin',{err:'Wrong Email or password'})
        // console.log("Wrong email or password");
    }
    // console.log(result);

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

router.post('/postDataSave',async (req,res) => {
    console.log(req.body);
})


module.exports = router