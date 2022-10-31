const express = require('express')
const shortUrl = require('../models/shortUrl')
const router = express.Router()

//log all types of requests
router.use((req, res, next) => {
    const d = new Date();
    const date_time = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
    console.log(`Time: ${date_time} - ${req.method} Request: Path ${req.path}`)
    next()
})

router.get('/', async (req,res)=>{
    const shortUrls = await shortUrl.find()
    res.render('index',{shortUrls});
})

const isUrlPresent = async(req,res,next)=>{
    let postedUrl = req.body.fullUrl
    const urlObj = await shortUrl.findOne({fullUrl: postedUrl}) //check if already there
    if(urlObj != null){//if present then send error
        return res.status(403).send('Already exists')
    }
    next() //else proceed to create
}

router.post('/shortUrl',isUrlPresent, async (req,res)=>{
    let postedUrl = req.body.fullUrl
    await shortUrl.create({fullUrl:postedUrl})
    return res.redirect('/')
})

router.get('/:shortUrl', async(req,res)=>{
    const urlObj = await shortUrl.findOne({shortUrl: req.params.shortUrl})
    if(urlObj == null) return res.sendStatus(404)
    urlObj.clicks++
    urlObj.save()

    res.redirect(urlObj.fullUrl)
})

module.exports = router