import express from "express"
import ejs from "ejs"
import session from "express-session"
import { v4 as uuidv4 } from 'uuid';
import { dbConnect, Notice } from "./dbinit.js";
import bodyParser from "body-parser"
import dotenv from "dotenv"
dotenv.config()

const PORT = process.env.PORT || 1337

const app = express().use(bodyParser.json());
// app.use(express.urlencoded());
app.use(express.static("public"))
app.use(session({
    secret: uuidv4(),
    resave: true,
    saveUninitialized: true
}))
app.set("view engine", "ejs")

// <---------------MY CODE------------------> //
app.route("/")
    .get((req, res) => {
        res.render("login")
    })
    .post((req, res) => {
        const { username, password } = req.body;
        const validUname = "uname";
        const validPass = "pass";

        if (username === validUname && password === validPass) {
            let loginID = Number(new Date().getTime())
            req.session.user = loginID
            res.redirect("/dashboard")
        } else {
            res.send("Invalid Credentials. Login again")
        }
    })

app.route("/dashboard")
    .get((req, res) => {
        if (req.session.user) {
            res.render("dashboard")
        } else {
            res.send("Please login to acces this page.")
        }
    })
    .post((req, res) => {
        const { noticeTitle, noticeBody } = req.body;
        const noticeID = Number(new Date().getTime())
        const notice = new Notice({
            id: noticeID,
            title: noticeTitle,
            body: noticeBody
        })

        notice.save()
            .then(() => res.send("Notice added."))
            .catch((err) => res.send(err))
    })

// <---------------MY CODE------------------> //

app.post('/webhook', (req, res) => {  
 
    let body = req.body;
  
    // Checks this is an event from a page subscription
    if (body.object === 'page') {
  
      // Iterates over each entry - there may be multiple if batched
      body.entry.forEach(function(entry) {
  
        // Gets the message. entry.messaging is an array, but 
        // will only ever contain one message, so we get index 0
        let webhook_event = entry.messaging[0];
        console.log(webhook_event);
      });
  
      // Returns a '200 OK' response to all requests
      res.status(200).send('EVENT_RECEIVED');
    } else {
      // Returns a '404 Not Found' if event is not from a page subscription
      res.sendStatus(404);
    }
  
  });

app.get('/webhook', (req, res) => {

    // Your verify token. Should be a random string.
    const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
  
    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];
  
    // Checks if a token and mode is in the query string of the request
    if (mode && token) {
  
      // Checks the mode and token sent is correct
      if (mode === 'subscribe' && token === VERIFY_TOKEN) {
  
        // Responds with the challenge token from the request
        console.log('WEBHOOK_VERIFIED');
        res.status(200).send(challenge);
  
      } else {
        // Responds with '403 Forbidden' if verify tokens do not match
        res.sendStatus(403);
      }
    }
  });
  
  

app.listen(PORT, () => {
    console.log(`Server Running on port ${PORT}`);
    dbConnect();
})
