const express = require('express')
const nodemailer = require('nodemailer')
const { Readable } = require('stream')
const cors = require('cors')
const pdf = require('html-pdf')
const hostname="0.0.0.0"
const port = process.env.PORT || 3000;
require('dotenv').config()
require('./connection')

const formmodel = require('./models/formmodel')

const app = express()
app.use(express.urlencoded({ extended: false }));
app.use(express.json())

var corsOptions = {
    origin: function (origin, callback){ callback(null, true)},
    methods: ['GET', 'POST','PATCH','DELETE'], // Specify your origin here
    credentials: true,  // This allows the session cookie to be sent back and forth
    //optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions)); // allow any origin

app.get("/",(req,res)=>{
    res.json({"scucess":"App deployed sucessfully"})
})

app.post("/senddata",async(req,res)=>{
    try {
        const {
            fullname,
            mobilenumber,
            email,
            gender,
            dob,
            education,
            percentage,
            consultancyfee,
            paymentmode,
            countries,
            tests
        }=req.body

        //save to mongodb
        const currentdetails= new formmodel({
            fullname,
            mobilenumber,
            email,
            gender,
            dob,
            education,
            percentage,
            consultancyfee,
            paymentmode,
            countries,
            tests
        })

        const transpoter = nodemailer.createTransport({
            service:'gmail',
            auth:{
              user:process.env.APP_USER,
              pass:process.env.APP_PASSWORD
            }
        })

        const temptests = Object.entries(tests);

        const htmlContent = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Consultancy Application</title>
        </head>
        <body style="width: 100%; margin: 0; padding: 0; box-sizing: border-box; background-color: #ffffff;">
            <main style="max-width:600px; margin: 0 auto;">
                <h1 style=" background-color: rgb(250, 52, 52); color: white; text-align: center; margin: 0; padding: 30px 0;">Abroad Consultancy</h1>
                <h2 style="margin: 10px 0; text-align: center;">Invoice</h2>
                <div style="line-height: 20px; margin-left: 30px; padding-bottom: 20px;">
                <p>Full name: ${fullname}</p>
                <p>Mobile Number: ${mobilenumber}</p>
                <p>Email: ${email}</p>
                <p>Gender: ${gender}</p>
                <p>Date of Birth: ${dob}</p>
                <p>Higher Education: ${education}</p>
                <p>Percentage in Higher Education: ${percentage}</p>
                <p>Consultancy Fee: ${consultancyfee}</p>
                <p>Payment Method: ${paymentmode}</p>
                <p>Exams and their Scores:</p>
                <ul style="list-style: none;">
                    ${temptests.map(([key, value]) => `<li>${key}: ${value}</li>`).join('')}
                </ul>
                <p>Countries you are Interested in:</p>
                <ul style="list-style: none;">
                    ${countries.map(country => `<li>${country}</li>`).join('')}
                </ul>
                </div>
            </main>
        </body>
        </html>`

        // Use the functions
        let docContent = htmlContent; // Your HTML content goes here
        const options = { format: 'A4' };

        pdf.create(docContent, options).toBuffer(function(err, buffer){
            if (err) return console.log(err);
            console.log("PDF created successfully!");

            const mailOptions = {
                from:process.env.APP_USER,
                to:email,
                subject:"Abroad Consultancy",
                html:htmlContent,
                attachments: [{
                    filename: `invoice_${mobilenumber}.pdf`,
                    content: new Readable.from(buffer)
                }]
            }

            currentdetails.save()
            .then((details)=>{
                //send mail here
                transpoter.sendMail(mailOptions)
                .then(()=>{
                    return res.status(201).json({details});
                })
                .catch((error) => {
                    console.error(error);
                    return res.status(500).json({ message: "Sending Mail Failed" });
                });
            })
            .catch(error => res.status(500).json(error))
        });

    } catch (error) {
        console.error(error)
        res.status(500).send(error)
    }

})

app.listen(port,hostname,()=>{
    console.log(`app started listening http://localhost:${port}`);
})

module.exports = app;
