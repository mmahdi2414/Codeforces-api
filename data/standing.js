const model = require('./../models/standing');

let standingByContest = async (contest) => {
    return await model.findOne({contest}).populate('contest');
}

let standing = async (id) => {
    return await model.findById(id);
}

let create = async (obj) => {
    const m = new model(obj);
    return await m.save();
}

let remove = async (contest) =>{
    return model.findOneAndRemove({contest});
}

module.exports = {standingByContest, standing, create , remove};