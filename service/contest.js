const data = require('./../data/contest');
const log = require('../logger/logger');


let contest = async (id) =>{
    let promise = new Promise((resolve, reject) => {
        data.contest(id).then( contest => {
            if (contest) {
                resolve(contest.toJSON());
            }
            else{
                reject('not found contest');
            }
        }).catch(err=>{
            reject(err);
        });
    });
    return await promise;
}

let contests = async () =>{
    let promise = new Promise((resolve, reject) => {
        data.contests().then( contests => {
            if (contests) {
                resolve(contests.map(contest=>{
                    return contest.id;
                }));
            }
            else{
                log('error' , 'not found contests');
                resolve([]);
            }
        }).catch(err=>{
            log('error' , err);
            resolve([])
        });
    });
    return await promise;
}

let create = async (obj) =>{
    let promise = new Promise((resolve, reject) => {
        data.create(obj).then( contest => {
            resolve(contest.toJSON());
        }).catch(err=>{
            resolve(null);
        });
    });
    return await promise;
}

module.exports = {contest, create, contests};
