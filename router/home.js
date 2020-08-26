const express = require('express');
const log = require('../logger/logger');
const router = express.Router();
const axios = require('axios');
const filter = require('./filter');

router.use(function(req, res, next) {
    log('info' , `new ${req.method} request on ${req.originalUrl}`);
    next();
})

router.get('/', (req, res) => {
    return res.render('home' , {error:null});
});

router.get('/search' , (req , res) => {
    let url = ` https://codeforces.com/api/user.info?handles=${req.query.handle}`;
    axios.get(url).then(response => {
        res.render('profile' , {...response.data.result[0]})
    }).catch(err=>{
        log('error', err.response.data.comment)
        res.render('home', {error: `User with handle '${req.query.handle}' not found`});
    });
});

router.get('/gyms', (req , res)=>{
    let handle = req.query.handle;
    axios.get('https://codeforces.com/api/contest.list?gym=true')
    .then(async response =>{   
        let data = await filter(response.data.result , handle);     
        console.log('here');
        return res.status(200).json(data);
    })
    .catch(err=>{
        console.log(err.response);
        res.status(400).send(err.response);
    });
});

module.exports = router;
