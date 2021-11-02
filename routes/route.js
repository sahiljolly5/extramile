const router = require('express').Router()
const User = require('../models/user')
const Service = require('../models/service')
const Parts = require('../models/parts')
const isUser = require('../middleware/isUser')
const isAdmin = require('../middleware/isAdmin')
const nodemailer = require("nodemailer");

const fs = require('fs');
// const pdf = require('pdf-creator-node');
var path = require('path');
const ejs = require('ejs');
const pdf = require('html-pdf');

const options = {
    format: "A4",
    orientation: "portrait",
    border: "10mm",
    // header: {
    //     height: "20mm",
    //     contents: '<h4 style="text-align: center">HEALTH DEPARTMENT, YAMUNA NAGAR (HARYANA)</h4>'
    // },   
}

require('dotenv').config()

let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    isUser: {
      user: process.env.MAIL, // generated ethereal user
      pass: process.env.PASS, // generated ethereal password
    },
    tls:{
        rejectUnisUserorized: false
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
    res.render('home')
})

router.get('/about',(req,res) => {
    res.render('about')
})

router.get('/services',(req,res) => {
    res.render('services')
})

router.get('/contact',(req,res) => {
    res.render('contact')
})

router.get('/signin',(req,res) => {
    res.render('signin',{err:''})
})

router.get('/logout',(req,res) => {
    req.session.destroy()
    res.render('signin',{err:''})
})

router.get('/addservice',isUser,async (req,res) => {

    if(req.session.user.admin) {

        return res.render('addservice',{admin:true})
    }
    return res.render('addservice',{admin:false})
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
        password:req.body.password,
        admin:false
    }
    const result = await new User(data).save()
    // console.log(result);
    res.render('signup')
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
        jobs : arr,
        parts : [],
        cost : 0
    }
    const result = await new Service(_service).save()
    
    return res.render('home',{admin:req.session.user.admin})

})

router.get('/viewservices',async (req,res) => {
    const data = await Service.find({})
    // console.log(data);
    res.render('viewservices',{data:data,admin:req.session.user.admin})
})

router.get('/serviceDetail/:id',async (req,res) => {
    const id = req.params.id
    const data = await Service.find({_id:id})
    const parts = await Parts.find({})
    // console.log(parts[0].parts);
    // console.log(data);
    res.render('details',{data:data[0],parts:parts[0].parts,admin:req.session.user.admin})
})

router.post('/updateService/:id',async (req,res) => {

    const id = req.params.id
    let part = req.body.parts.split(',')[0]
    let price = parseInt(req.body.parts.split(',')[1])
    let service = await Service.find({_id:id})

    let serviceParts = service[0].parts
    let serviceCost = parseInt(service[0].cost)
    
    serviceParts.push(part)
    serviceCost += price

    const result = await Service.findByIdAndUpdate(id,{parts:serviceParts,cost:serviceCost},{new:true})
    const parts = await Parts.find({})
    // console.log(result);
    res.render('details',{data:result,parts:parts[0].parts,admin:req.session.user.admin})
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

router.post('/contactmail',(req,res) => {
    console.log(req.body);

    const message = {
        from: process.env.MAIL,
        to: process.env.MAIL,
        subject: `You Got Message from ${req.body.name}`,
        html: `
        <h2>Name : ${req.body.name}</h2>
        <h2>Email : ${req.body.email}</h2>
        <h2>Phone : ${req.body.phone}</h2>
        <h2>Message : ${req.body.message}</h2>
        `
      };

      transporter.sendMail(message,(err) => {
          console.log(err);
      })
})


router.get('/pdfmake/:id', async (req,res) => {
    
    let id = req.params.id
    const doc = await Service.find({_id:id})
    // console.log(doc[0]._id);
    let user = await User.find({_id:doc[0].UserId})
    console.log(user);


    const data = {info : doc[0], userInfo : user[0]};

    try {
        
        const filePathName = path.resolve(__dirname, '../views/bill.ejs');
        const htmlString = fs.readFileSync(filePathName).toString();
        let  options = { format: 'A4',base:`${req.protocol}://${req.get("host")}` };
        const ejsData = ejs.render(htmlString, data);
        await pdf.create(ejsData, options).toFile(`bills/${data.info._id}.pdf`,(err, response) => {
            if (err) return console.log(err);
            return res.sendFile(response.filename);
        });
       
    } catch (err) {
        console.log("Error processing request: " + err);
    }


})


module.exports = router