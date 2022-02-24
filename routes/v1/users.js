const fs = require('fs');
const path = './users.json';

async function getUserData(){
    // fs.access(path,fs.F_OK, (err) => {
    //     if(err){
    //         fs.writeFileSync(path,"[]",(err)=>{console.log(err);});
    //         const jsonData = fs.readFileSync(path);
    //         return JSON.parse(jsonData);
    //     } else{
    //         const jsonData = fs.readFileSync(path);
    //         json = JSON.parse(jsonData);
    //         return json;
    //     }
    // })
    const file = fs.readFile(path, 'utf8',(err, data) => {
        if(err){
            console.error(err);
        }else {
            try {
                const JsonString = JSON.parse(data);
                // console.log(JsonString);
                return JsonString;
            } catch (err) {
                console.log(err);
            }
        }
    });
    console.log(file);
    // const jsonData = fs.readFileSync(path);
    // json = JSON.parse(jsonData);
    // return json;
}

function saveUserData(userData){
    //fs.access(path,fs.F_OK, (err) => {
    //     if(err){      
    //         fs.writeFile(path,jsonData,(err)=>{console.log(err);});
    //         console.log(err);
    //         return
    //     }
    //     const jsonData = JSON.stringify(userData);
    //     fs.writeFile(path,jsonData)
    // })
    const jsonData = JSON.stringify(userData);
    fs.writeFileSync(path,jsonData)
}

function findNextID(obj){
    return (Math.max.apply(Math, obj.map((o)=>{return o.id;}))+1);
}

function getIdParam(req) {
	const id = req.params.id;
	if (/^\d+$/.test(id)) {
		return Number.parseInt(id, 10);
	}
	throw new TypeError(`Invalid ':id' param: "${id}"`);
}

async function getAll(req,res){
    const users = await getUserData();
    console.log(users);
    await res.status(200).json(users);
}
//getbyid
function create(req,res){
    if(req.body.id){
        res.status(400).json({ message: "User ID should be defined by server"});
    } else {
        if(req.body.name){
        const users = getUserData();
        numID = (Object.keys(users).length? findNextID(users) : 0)
        console.log(numID);
        const newObj = {
            id : numID,
            name : req.body.name,
        }
        users.push(newObj);
        console.log(users);
        saveUserData(users);
        res.status(200).json("user added success");
        } else {
            res.status(400).json({ message: "no user name"});
        }
    }
}

function update(req,res){
    const paramId = getIdParam(req);
    const bodyId = req.body.id;
    if(paramId == bodyId && req.body.name){
        const users = getUserData();
        // console.log(users.find(obj => obj.id == bodyId));
        const newObj = {
            id : bodyId,
            name : req.body.name,
        }
        users.forEach((item)=>{
            if(newObj.id == item.id){
                item.name = newObj.name
            }
        })
        saveUserData(users);
        res.status(201).json({ message: "success update" });
    } else {
        res.status(400).json({ message: "no id provided" });
    }
}

function del(req,res){
    const paramId = getIdParam(req);
    const bodyId = req.body.id;
    if(paramId == bodyId){
        const users = getUserData();
        const newUsers = users.filter(item => item.id != req.body.id);
        saveUserData(newUsers);
        res.status(202).json({ message: "success delete" });
    } else {
        res.status(400).json({ message: "no id provided" });
    }
}

module.exports = {
    getAll,
    create,
    update,
    del
}