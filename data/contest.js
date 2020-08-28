const model = require('./../models/contest');

let contest = async (id) => {
    return await model.findOne({id});
}

let contests = async () => {
    return await model.find();
}

let create = async (obj) => {
    const m = new model(obj);
    return await m.save();
}

module.exports = {contest , contests , create};