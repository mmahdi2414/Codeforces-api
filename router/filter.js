const axios = require("axios");
const log = require("../logger/logger");

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}   
let filter = async (contests , handle , kind , season)=>{
    contests = contests.filter(con => con.kind === 'Official ICPC Contest' && con.season === '2019-2020');
    const results =[];
    results.push(...await Promise.all(contests.slice(0 , Math.min(5 , contests.length)).map(predicate(handle))));
    for(let i = 5; i < contests.length; i+=5){
        await sleep(1000);
        results.push(...await Promise.all(contests.slice(i , Math.min(i + 5 , contests.length)).map(predicate(handle))));
    }
    
    return contests.filter((_v, index) => results[index]);
}
let predicate = handle => async (contest , idx) =>{
    const url = `https://codeforces.com/api/contest.standings?contestId=${parseInt(contest.id)}&showUnofficial=true`
    let res;
    await axios.get(url)
    .then(resp =>{
        res = resp.data.result.rows;
    }).catch(err=>{
        log('error' , err.response.data.comment)
        res = null;
    });
    return !!res;
}

module.exports = filter;