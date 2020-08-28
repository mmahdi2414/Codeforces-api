const axios = require('axios');
const tor_axios = require('tor-axios');
const contestService = require('./../service/contest');
const standingService = require('./../service/standing');
const log = require('../logger/logger');
const tor = tor_axios.torSetup({
    ip: 'localhost',
    port: 9050,
    controlPort: '9051',
    controlPassword: 'giraffe',
})

let getContests =  async () =>{
    let promise = new Promise((resolve, reject) =>{
        axios.get('https://codeforces.com/api/contest.list?gym=true')
        .then(response =>{   
            resolve(response.data.result)
        })
        .catch(err=>{
            log('error' , err);
            resolve([]);
        });
    });
    return await promise;
}

let getStanding =  async (id) =>{
    const url = `https://codeforces.com/api/contest.standings?contestId=${parseInt(id)}&showUnofficial=true`
    let res;
    await axios.get(url)
    .then(resp =>{
        res = resp.data.result.rows;
    }).catch(async err=>{
        if (err.response){
            if (err.response.data.comment === 'Call limit exceeded'){
                res = "!";
                return;
            }
            log('error' , err.response.data.comment);
            // console.log(err.response);
            res = null;
        }
        else {
            console.log('Error :' , err);
            res = null;
        }
    });
    if (res === "!"){
        console.log("!");
        return null;
    }
    return res;
}
let updateContest = async () =>{
    let newContests = await getContests();
    let lastContests = await contestService.contests();
    if (lastContests.length >= newContests.length)
        return;
    return await Promise.all(
        newContests.map(async element => {
            if (!lastContests.includes(element.id))
            {
                return await contestService.create(element);
            }
            return element;
        })
    );
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}   


let _updateStanding = async (contests , l , r) =>{
    await Promise.all(contests.slice(l , r).map(async contest => {
        if (!contest)
            return null;
        await contestService.contest(contest.id)
        .then(async contest =>{
            let standing = await getStanding(contest.id);
            if (standing){
                let party = standing.party;
                delete standing.party;
                await standingService.remove(contest._id);
                await standingService.create({contest: contest._id, ...party , ...standing});
            }
        }).catch(err=>{
            log('error' , err);
        });
        return null;
    }));
}
let updateStanding = async (contests) =>{
    _updateStanding(contests , 0 , Math.min(contests.length , 5));
    for (let i = 5; i < contests.length; i += 5){
        await sleep(1100);
        await _updateStanding(contests, i , i + 5);
    }
}
module.exports = async () => {
    await updateStanding(await updateContest());
    console.log(getContests());
}