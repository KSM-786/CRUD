const express= require("express");
const bodyParser=require('body-parser');
const app=express();
var MongoClient=require('mongodb').MongoClient;
var url="mongodb://localhost:27017/";
const redis = require("redis");
const axios = require("axios");
const port_redis =6379;
const redis_client = redis.createClient(port_redis);

app.use(bodyParser.urlencoded({ extended:true }))

checkCache = (req, res, next) => {
  const { name } = req.params;

  redis_client.get(id, (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }
    if (data != null) {
      res.send(data);
    } else {
      next();
    }
  });
};


app.post('/',(req,res)=>
{
  MongoClient.connect(url, { useUnifiedTopology: true },(err, db)=> {
  if (err) throw err;
  var dbo = db.db("node");
  var myobj = { name: "KSM AMBANI", address: "NH 512" };
  dbo.collection("CRUD").insertOne(myobj)
  .then(res=> {
    console.log("1 document inserted");
    db.close();
		})
  .catch(err=>console.error)
	})
})
app.get('/',checkCache, async (req,res)=>{ 
  MongoClient.connect(url, { useUnifiedTopology: true },(err, db)=> {
  if (err) throw err;
 try {
  	const { name }= req.params;
  var dbo = db.db("node");
  dbo.collection("CRUD").find().toArray()
  .then(result=> {
    console.log(result)
        db.close();
        })
  	const info = result.data;
  	redis_client.setex(name,3000,JSON.stringify(info))
  	return res.json(info)
  .catch(err=>console.error(err))
	}
}
catch(error){
console.log(error);
return res.status(500).json.(error)
}
})

app.put('/',(req,res)=>{ 
MongoClient.connect(url,{ useUnifiedTopology: true },(err, db)=> {
  if (err) throw err;
  var dbo = db.db("node");
  var myquery = { address: "NH 512" };
  var newvalues = { $set: { address: "NH 155" } };
  dbo.collection("CRUD").updateOne(myquery, newvalues)
  .then(res=> { console.log("1 document updated")
  	db.close(); 
  })
  .catch(err=>console.error(err))
  })
})

app.delete('/',(req,res)=>{
	MongoClient.connect(url,{ useUnifiedTopology: true },(err, db) =>{
  if (err) throw err;
  var dbo = db.db("node");
  var myquery = { address: 'NH 786' };
  dbo.collection("CRUD").deleteOne(myquery)
    .then(obj=>{    console.log("1 document deleted");
    db.close()})
    .catch(err=>console.error(err))
	})
})



app.listen(3000,()=>
{
	console.log(`Server running!!`);
});