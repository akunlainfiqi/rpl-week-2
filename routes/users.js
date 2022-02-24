const { Users } = require('../models');

async function getAll(req,res){
    try {
        const users = await Users.find({});
        res.status(200).json({users});
    } catch (err) {
        res.status(500).send( {message: err});
    }
}

async function create(req,res){
    try {
        const user = await Users.create(req.body);
        res.status(200).json(user);
    } catch (err) {
        if(err.code == 11000){
            res.status(500).json({message: Object.keys(err.keyPattern)+" already used"});
        } else {
        res.status(500).json({err});
        }
    }
}

async function update(req,res){
    try {
        const { id } = req.params;
        const user = await Users.findOneAndUpdate({ id },req.body,{
            new: true,
            runValidation: true,
        });
        if(!user) {
            return res.status(404).json({message: "User not found"});
        }
        res.status(200).json({user});
    } catch (err){
        res.status(500).json({err});
    }
}

async function remove(req,res){
    try {
        const { id } = req.params;
        const user = await Users.findOneAndDelete({ id });
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        res.status(200).json({user});
    } catch (err){
        res.status(500).json({err});
    }
}

module.exports = {
    getAll,
    create,
    update,
    remove,
}