
const log = require("../logger/logger");


let filter = async (contests , handle , kind , season)=>{
    contests = contests.filter(con => con.kind === kind && con.season === season);
    let results = [];//= await Promise.all(contests.map(predicate(handle)));
    console.log('len =', contests.length);
    results.push(...await Promise.all(contests.slice(0 , Math.min(5 , contests.length)).map(predicate(handle))));
    for(let i = 5; i < contests.length; i+=5){
        await tor.torNewSession();
        results.push(...await Promise.all(contests.slice(i , Math.min(i + 5 , contests.length)).map(predicate(handle))));
    }
    return contests.filter((_v, index) => results[index]);
}
let predicate = handle => async (contest , idx) =>{
    const url = `https://codeforces.com/api/contest.standings?contestId=${parseInt(contest.id)}&showUnofficial=true`
    let res;
    await tor.get(url)
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
        await tor.torNewSession();
        return predicate(handle)(contest , idx);
    }
    if (res){
        return res.some(row=> row.party.members.some(mem=>JSON.stringify(mem) === JSON.stringify({handle})));
    }
    return false;
}

module.exports = filter;