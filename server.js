 import express from "express"
import ejs from "ejs"
import session from "express-session"
import { v4 as uuidv4 } from 'uuid';
import { dbConnect, Notice } from "./dbinit.js";
import dotenv from "dotenv"
dotenv.config()

const PORT = process.env.PORT || 3000

const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"))
app.use(session({
    secret: uuidv4(),
    resave: true,
    saveUninitialized: true
}))
app.set("view engine", "ejs")

// <---------------MY CODE------------------> //
app.route("/")
    .get((req, res)=>{
        res.render("login")
    })
    .post((req, res)=>{
        const { username, password } = req.body;
        const validUname = "uname";
        const validPass = "pass";

        if(username===validUname && password===validPass){
            let loginID = Number(new Date().getTime())
            req.session.user = loginID
            res.redirect("/dashboard")
        }else{
            res.send("Invalid Credentials. Login again")
        }
    })

app.route("/dashboard")
    .get((req, res)=>{
        if(req.session.user){
            res.render("dashboard")
        }else{
            res.render("dashboard")
            // res.send("Please login to acces this page.")
        }
    })
    .post((req, res)=>{
        const { noticeTitle, noticeBody } = req.body;
        const noticeID = Number(new Date().getTime())
        const notice = new Notice({
            id: noticeID,
            title: noticeTitle,
            body: noticeBody
        })

        notice.save()
            .then(()=>res.send("Notice added."))
            .catch((err)=>res.send(err))
    })

// <---------------MY CODE------------------> //


app.listen(PORT,()=>{
    console.log(`Server Running on port ${PORT}`);
    dbConnect();
})
