import express from "express";
import { matchesRouter } from "./routes/matches.js";
const app = express();
const port = 8080;

app.use(express.json());


app.get("/",(req,res)=>{
    res.send("This is a home page")
})

app.use("/matches", matchesRouter)

app.listen(port,()=>{
    console.log(`App is listening on port http://localhost:${port}`)
})