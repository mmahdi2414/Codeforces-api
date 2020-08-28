const data = require('./../data/standing');
const contest = require('../models/contest');

let standingByContest = async (contest) => {
    let promise = new Promise((resolve, reject) => {
        data.standingByContest(contest).then(standing =>{
            if (standing)
                resolve(standing.toJSON());
            else 
                reject('not found standing');
        }).catch(err=>{
            reject(err);
        })
    });
    return await promise;
}

let standing = async (id) => {
    let promise = new Promise((resolve, reject) => {
        data.standing(contest).then(standing =>{
            if (standing)
                resolve({id: standing._id});
            else 
                reject('not found standing');
        }).catch(err=>{
            reject(err);
        })
    });
    return await promise;
}

let create = async (obj) => {
    let promise = new Promise((resolve, reject) => {
        data.create(obj).then(standing =>{
            resolve(standing.toJSON());
        }).catch(err=>{
            reject(err);
        })
    });
    return await promise;
}

let members = async(contest) => {
    let promise = new Promise((resolve, reject) => {
        data.standingByContest(contest).then(standing =>{
            if (standing)
                resolve(standing.toJSON().members);
            else 
                reject('not found standing');
        }).catch(err=>{
            reject(err);
        })
    });
    return await promise;
}
let remove = async (contest) =>{
    let promise = new Promise((resolve, reject) => {
        data.remove(contest).then(standing =>{
                resolve(standing);
        }).catch(err=>{
            resolve(err);
        })
    });
    return await promise;
}
module.exports = {members, standingByContest, standing, create ,remove};