const express = require('express')
const mongoose = require('mongoose')
const app = express()

const routes = require('./routes/route')

const uri = 'mongodb://localhost:27017/extramile'

app.use('/public',express.static('public'))
app.use(express.urlencoded({extended:true}))

app.set('views','views')
app.set('view engine','ejs')

app.use('/',routes)


mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).
    then(result => {
      console.log("DB Connected!");
      app.listen(8080, () => {
        console.log("App Is Running On 8080.");
      })
    }).
    catch(err => {
      console.log(err);
    });