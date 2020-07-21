const express=require('express');
const router=express.Router();
const mysql=require('mysql');
var crypto = require('crypto');



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



router.get('/list/',(req,res)=>{
    let query={
        userid:req.query.user
    }
    conn.query("select website, username, password from sites where userid in (select userid from users where userid=?)",[query.userid],(err,rows,fields)=>{
         if(err) {
             res.sendStatus(500);
             throw err;
         }

        rows.forEach(row => {
            var mykey = crypto.createDecipher('aes-128-cbc', 'shank');
            let mystr = mykey.update(row.password, 'hex', 'utf8')
            mystr += mykey.final('utf8');
            row.password=mystr;    
        });
        
        console.log(rows);       
        res.json(rows);
     })
     
 });
 
 

 router.post('/',(req,res)=>{

    if(!req.body.website || !req.body.username || !req.body.password){
        res.status(403).json({msg:"Don't leave fields empty"});
    }
    let query={
        userid:req.query.user
    }

    var mykey = crypto.createCipher('aes-128-cbc', 'shank');
    var mystr = mykey.update(req.body.password, 'utf8', 'hex');
    mystr += mykey.final('hex');

    console.log(query);

    


    conn.query("insert into sites (website,username,password,userid) values(?,?,?,?)",[req.body.website,req.body.username,mystr,query.userid],(err,rows)=>{
         if(err){
             res.sendStatus(500);
             throw err;
         }
         else{
             res.json({status:"success"});
         }
    })

});

 module.exports = router;