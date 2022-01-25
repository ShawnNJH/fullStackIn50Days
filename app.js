require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const path = require('path');
const mailchimp = require("@mailchimp/mailchimp_marketing");

const app = express();

app.use(express.static(path.join(__dirname + '/public/css')));
app.use(bodyParser.urlencoded({ extended: true }));

//MailChimp API
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"))
})


mailchimp.setConfig({
    apiKey: process.env.apiMailChimp,
    server: process.env.serverMailChimp
});


app.post("/", (req, res) => {
    const { fName, lName, email } = req.body;
    const data = {
        email_address: email,
        status: "subscribed",
        merge_fields: {
            FNAME: fName,
            LNAME: lName
        }
    }
    // const listId = secrets.listMailChimp
    const listId = process.env.listMailChimp
    async function run() {
        try {
            const response = await mailchimp.lists.addListMember(listId, data)
            console.log("success")
            res.sendFile(path.join(__dirname, "/public/success.html"))
        }
        catch (err) {
            console.log("failure")
            res.sendFile(path.join(__dirname, "/public/failure.html"))
        }
    }
    run();
});

app.post("/failure", (req,res) =>{
    res.redirect("/")
})

app.listen(process.env.PORT || 4747, () => {
    console.log("server is running on port 4747")
});