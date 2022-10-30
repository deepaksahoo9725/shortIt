const express = require('Express')
const mongoose = require('mongoose')
const shortner = require('./routes/handleUrl')

const app = express()

mongoose.connect('mongodb://localhost/urlShortner',{
    useNewUrlParser:true, useUnifiedTopology:true
})

app.use(express.urlencoded({extended:false}))
app.set('view engine','ejs')
app.use('/', shortner);


const port  = process.env.PORT || 3000

app.listen(port,()=>{
    console.log(`app is running on port ${port}`)
})
