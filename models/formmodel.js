const mongoose = require('mongoose');

const testSchema = mongoose.Schema({
    ielts:{
        type: Number
    },
    tofel: {
        type: Number
    },
    pte: {
        type: Number
    },
    dulingo:{
        type:Number
    }
});


const formModel = mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    mobilenumber: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ["male", "female"],
        required: true
    },
    dob:{
        type: String,
        required: true
    },
    education: {
        type: String,
        enum: ["bachelors", "masters", "phd"],
        required: true
    },
    percentage:{
        type:Number,
        required: true
    },
    tests: {
        type:testSchema
    },
    countries: {
        type: [String], // Array of Strings
        enum: ["usa", "uk", "canada", "australia", "singapore", "europe"],
        required:true
    },
    consultancyfee: {
        type: Number,
        required: true
    },
    paymentmode:{
        type:String,
        enum:["phonepe","gpay","card","cash"],
        required: true
    }
});

const Form = mongoose.model("form", formModel);
module.exports = Form;


