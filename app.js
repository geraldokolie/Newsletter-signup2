//jshint esversion: 6
//require the dependencies
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

//This is  used to render the static files like css and images
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));


//request home route from the server with the directory name
app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});

//this is used to pull un info from the user and post it to the server
app.post("/", function(req, res){
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;
    
    //create a data format for members in the mailchimp

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }
     //change the data to json format to be sent to mailchimp;

  const jsonData = JSON.stringify(data);
   
  //connecting your mailchimp list to your code
  const url = "https://us10.api.mailchimp.com/3.0/lists/d4a24b52e0"

  const options = {
    method: "POST",
    auth: "gerald2:30c741dc880b917cfd852bf8d7d1da4-us10"
  }
  //make your http request
  const request = https.request(url, options, function(response){

  //takes the user to a success or failure page when clicks the sign up buutton

    if(response.statusCode === 200){
        res.sendFile(__dirname + "/success.html")
    } else {
        res.sendFile(__dirname + "/failure.html")
    }

     response.on("data", function(data){
        console.log(JSON.parse(data));
     })
  })
  request.write(jsonData)
  request.end();
});

//This helps to redirect to the home route when button is clicked
app.post("/failure", function(req, res){
    res.redirect("/");
});

 

//set up our server
app.listen(3000, function() {
    console.log("Server is running on port 3000");
});


//30c741dc880b917cfd852bf8d7d1da4c-us10
//d4a24b52e0