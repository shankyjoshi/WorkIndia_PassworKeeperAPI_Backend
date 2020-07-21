const express=require('express');
const router=express.Router();
const mysql=require('mysql');
const jwt=require('jsonwebtoken');

var conn=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'1234',
    database:'work'
})

conn.connect((err)=>{
    if(err) {
        res.sendStatus(500);
        throw err;
    }
    console.log("Connected to Database Successfully");
})

router.post('/',(req,res)=>{
    if(!req.body.username || !req.body.password){
        res.status(403).json({msg:"Enter username and Password"});
    }
    conn.query("insert into users (username,password) values(?,?);",[req.body.username,req.body.password],(err,rows)=>{
        if(err) {
            res.sendStatus(500);
            throw err;
        }
        else{

            res.json({status:"Account created"});
        }
    })
  
})


router.post('/auth',(req,res)=>{

    let user={
        username:req.body.username,
        password:req.body.password
    }

    conn.query("select * from users where username=? and password=?",[req.body.username,req.body.password],(err,rows)=>{

        if(err) {
            res.sendStatus(500);
            throw err;
        }

        if(rows.length>0){
            
                res.json({status:"Success",userId: rows[0].userid});
            
        }
        else{
            res.json({status:"Invalid username or password"});
        }

    })

    
})

//Format of token
// Authorization : Bearer <access_token>


module.exports=router;