import express from "express";
const app = express();
const port = 8080;

app.use(express.json());


app.get("/",(req,res)=>{
    res.send("This is a home page")
})


app.listen(port,()=>{
    console.log(`App is listening on port http://localhost:${port}`)
})