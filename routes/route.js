const router = require('express').Router()
const User = require('../models/user')
const Service = require('../models/service')
const Auth = require('../middleware/auth')
const nodemailer = require("nodemailer");

require('dotenv').config()

let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAIL, // generated ethereal user
      pass: process.env.PASS, // generated ethereal password
    },
    tls:{
        rejectUnauthorized: false
    }
  });

const multer  = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now()
      const ext = file.mimetype.split("/")[1]
      cb(null, "Xth_Rollno" + '-' + req.session.user.phone + '.' + ext)
    }
  })
  
const upload = multer({ storage: storage,
    fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname);
        if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
            return callback(new Error('Only images are allowed'))
        }
        callback(null, true)
    }, })

router.get('/',(req,res) => {
    res.render('signin',{err:''})
})

router.get('/logout',(req,res) => {
    req.session.destroy()
    res.render('signin',{err:''})
})

router.get('/home',Auth,(req,res) => {
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

        req.session.user = result[0]
        req.session.save()
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
    var data = req.body
    var arr = []
    if(data.service == 'on') {
        arr.push('service')
    }
    if(data.repair == 'on') {
        arr.push('repair')
    }
    if(data.washing == 'on') {
        arr.push('washing')
    }
    if(data.painting == 'on') {
        arr.push('painting')
    }
    if(data.denting == 'on') {
        arr.push('denting')
    }

    var _service = {
        UserId:req.session.user._id,
        userName:req.session.user.name,
        company : data.company,
        model : data.model,
        engineType  : data.engineType,
        jobs : arr
    }
    const result = await new Service(_service).save()
    res.render('home')

})

router.get('/services',async (req,res) => {
    const data = await Service.find({})
    // console.log(data);
    res.render('services',{data:data})
})

router.get('/serviceDetail/:id',async (req,res) => {
    const id = req.params.id
    const data = await Service.find({_id:id})
    // console.log(data);
    res.render('details',{data:data[0]})
})

router.get('/serviceDetail',async (req,res) => {
    // const id = req.params.id
    const data = await Service.find({_id:'614ad8dc3e58f51017715e1b'})
    // console.log(data);
    res.render('details',{data:data[0]})
})


router.get('/file',(req,res) => {
    res.render('file')
})

router.post('/fileUpload',upload.single('fufile'),(req,res) => {
    console.log(req.file);
})

router.get('/contact',(req,res) => {
    res.render('contact')
})

router.post('/sendMail',(req,res) => {
    console.log(req.body);

    const message = {
        from: process.env.MAIL,
        to: process.env.MAIL,
        subject: "Message from extra mile",
        text: "Plaintext version of the message",
        html: "<h1>thank you for contacting extra mile. We will be with you shortly"
      };

      transporter.sendMail(message,(err) => {
          console.log(err);
      })
})
module.exports = router

