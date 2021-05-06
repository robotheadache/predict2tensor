let Queue = require('bull');
import {parse} from 'querystring'
var {connect, getdb} = require('./mongoconn')
import { queryResult } from '../../src/interface';
import { submittedQuery } from '../../src/submitQuery'
const axios = require("axios");
const nodemailer = require('nodemailer');
var mongodb;

connect(() => ( mongodb = getdb() ))
//variable declaration
let REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

//a list of amino acids for enumeration
const AACodes = ['A', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'K', 'L',
         'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'Y', '?']

//a list of secondary structural elements for enumeration

const SScodes = ['H', 'B', 'E', 'G', 'I', 'T', 'S', '-', '?']

//configure outside objects
var transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "",
    pass: ""
  }
});



let workQueue = new Queue('work', REDIS_URL);
export function queueJob(postData:string){
  //turn the text into a json object
    let parsedData:submittedQuery = parse(postData);
    //sanitize our input into a valid string
    parsedData.id = parsedData.id.replace(/ /g, '_') + "_" +Math.random().toString(36).substr(2, 4)
    //create a date marker
    parsedData.submitted = new Date();
    //add the object to the queue
    workQueue.add(parsedData);
    return parsedData.id

    

}


export function processData(task:submittedQuery){
  //in order to time how long actual predictions take, we take the time before 
  let processStart = Date.now();
  let dataForTensorflow = []

  let finalresult:queryResult = {}
  //generate our one hot vector for the sequence
  for (let i = 0; i < task.sequence.length; i++) {
    let temp = new Array(20).fill(0)
    let enumerated = AACodes.indexOf(task.sequence[i])
    temp[enumerated] = 1
    dataForTensorflow.push(temp)
  }
  //put it in a format tensorflow likes
  let data = {instances :[dataForTensorflow]}
  let chArray = []
  let confidenceScores = []
  //send it off!
  axios.post('http://localhost:8501/v1/models/ssmodel:predict', data)
  .then(response => {
    //stores our raw output
    let nakedArray = response.data.predictions[0]
    for (const i in nakedArray){
      let maxIndex = 0;
      let currentProbs = nakedArray[i]

      for (let j =0; j < 8; j++){
        if (currentProbs[j] > currentProbs[maxIndex]){
          maxIndex = j
        }
      }

      let confidenceSingle = 0
      for (let j =0; j < 8; j++){
        confidenceSingle += currentProbs[maxIndex] - currentProbs[j];
      }

      confidenceScores.push(confidenceSingle/7)
      chArray.push(SScodes[maxIndex])
      
    }
    finalresult.id = task.id
    
  
    finalresult.submitted = task.submitted
    finalresult.sequence =task.sequence

    finalresult.secStruc = chArray.join('')
    finalresult.confidence = confidenceScores
    let processEnd =  Date.now() - processStart
    console.log(processEnd)
    //console.log(finalresult)
    mongodb.collection("results").insertOne(finalresult, function(err, res) {
        if (err) throw err;
        console.log("1 document inserted");
      });
    
 
    const message = {
      from: 'webmaster@predict2tensor.com',
      to: task.email,
      subject: "Your job, " + finalresult.id+" is complete!",
      text: ("This is just an update that your query, " + finalresult.id +", submitted at " + finalresult.submitted+  ", is complete. You can view it at predict2tensor.com/results?query=" + finalresult.id + ".")
    }
    transport.sendMail(message, function(err, info) {
      if (err) {
        console.log(err)
      } else {
        console.log(info);
      }
  });
  })
  
}

workQueue.process(function(job, done){
  processData(job.data);
  console.log("Done!");
  done();
});


