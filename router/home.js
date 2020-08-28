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
    let seasons = [];
    let kinds = ["Training Contest", "Official ICPC Contest", "Official School Contest",
    "School/University/City/Region Championship", "Training Camp Contest",
    "Official International Personal Contest" , "Opencup Contest"]
    let now = (new Date()).getFullYear();
    for(let i = now; i >= 1991; i--){
        seasons.push(`${i}-${i + 1}`);
    }
    axios.get(url).then(response => {
        res.render('profile' , {...response.data.result[0] , seasons, kinds});
    }).catch(err=>{
        log('error', err.response.data.comment)
        res.render('home', {error: `User with handle '${req.query.handle}' not found`});
    });
});

router.get('/gyms', (req , res)=>{
    let {handle, kind ,season}= req.query;
    axios.get('https://codeforces.com/api/contest.list?gym=true')
    .then(async response =>{   
        let data = await filter(response.data.result , handle , kind, season);     
        return res.status(200).json(data);
    })
    .catch(err=>{
        console.log(err);
        res.status(400).send(err.response);
    });
});

module.exports = router;
