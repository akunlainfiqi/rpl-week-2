const express = require('express');
const mongoose = require('mongoose');
require("dotenv").config();

const PORT = process.env.PORT || 8080;
const app = express();
const routes = {
    users: require('./routes/users'),
}

const connectDB = (url)=>{
    return mongoose.connect(url);
}

function asyncHandler(handler){
    return async function(req, res, next){
        try {
            await handler(req, res);
        } catch (err) {
            next(err);
        }
    }
}

app.use(express.json()).use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.json({ message: 'welcome message' });
})

for (const [routeName, routeController] of Object.entries(routes)){
    if(routeController.getAll){
        app.get(
            `/${routeName}`,
            asyncHandler(routeController.getAll)
        );
    }
    if(routeController.create){
        app.post(
            `/${routeName}`,
            asyncHandler(routeController.create)
        );
    }
    if(routeController.update){
        app.patch(
            `/${routeName}/:id`,
            asyncHandler(routeController.update)
        );
    }
    if(routeController.remove){
        app.delete(
            `/${routeName}/:id`,
            asyncHandler(routeController.remove)
        )
    }
}

const start = async()=>{
    try {
        await connectDB(process.env.DB_URL);
        app.listen(PORT, () =>{
            console.log(`listening on port ${PORT}`)
        })
    } catch (err) {
        console.error(err)
    }
}

start();