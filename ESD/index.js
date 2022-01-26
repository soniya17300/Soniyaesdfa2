const port = 8080;
const mongoose = require("mongoose");
//const conn_str ="C"
const conn_str = "mongodb://root:root@cluster0-shard-00-00.7x1ly.mongodb.net:27017,cluster0-shard-00-01.7x1ly.mongodb.net:27017,cluster0-shard-00-02.7x1ly.mongodb.net:27017/Cluster0?ssl=true&replicaSet=atlas-gd8jkl-shard-0&authSource=admin&retryWrites=true&w=majority";


mongoose.connect(conn_str, { useNewUrlParser: true , useUnifiedTopology: true})
	.then( () => console.log("Connected successfully...") )
	.catch( (err) => console.log(err) );


const userSchema = new mongoose.Schema({
	name: String,
	age: Number,
	city: String
});

const user = new mongoose.model("users", userSchema);


/** Express Mongoose Integration **/

const express = require("express");
var cors = require('cors');
const app = express();


//add middlewares
app.use(express.json());
app.use(cors());


app.route("/user")
.get(async (req, res) => {
	let data = await user.find();
	res.send(data);
})
.post(async (req, res) => {
	req_data = req.query;
	let obj = new user(req.query)
	let result = await obj.save();
    console.log(result);
	res.send(req.query);
})
.put(async (req, res) => {
    req_data = req.query;
    let result = await user.updateOne({_id: req.query.id}, {$set : {city: req.query.city}});
	res.send(result);
	//model.updateOne({where}, {set});
	// let u_data = await user.updateOne({"_id": req.body._id}, {
	// 	"$set": {
	// 		"name" : req.body.name,
	// 		"age" : req.body.age,
	// 		"city" : req.body.city
	// 	}
	// });
	
	// res.send(u_data);
})
.delete(async (req, res) => {
	let result = await user.deleteOne({_id: req.query.id});
	res.send(result);
})


app.listen(process.env.PORT || port, () => {
	console.log("listening 8080...");
});