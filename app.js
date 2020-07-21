const express=require('express')
const app=express();
const path=require('path')


//app.use(express.static(path.join(__dirname,'public')));


app.use(express.json());
app.use(express.urlencoded({extended: false }))

//Api endpoints for students
app.use('/api/sites',require('./controllers/keeper'));

//Api endpoint to generate token and authoriztion
app.use('/api/user',require('./controllers/auth'));



app.listen(3000,()=>{

    console.log("Server is listening on port 3000");

});

