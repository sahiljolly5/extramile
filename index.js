const express = require('express')
const app = express()

const routes = require('./routes/route')


app.use('/public',express.static('public'))
app.use(express.urlencoded({extended:true}))

app.set('views','views')
app.set('view engine','ejs')

app.use('/',routes)

app.listen(8080,(req,res) => {
    console.log("Server Running");
})