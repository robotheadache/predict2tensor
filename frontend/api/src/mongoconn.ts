
var MongoClient = require('mongodb').MongoClient;
var mongoURL = "mongodb://localhost:27017/";
var mongodb;

const connect = (callback) => {
        if (mongodb) return callback()
        MongoClient.connect(mongoURL, (err, db) => {
                mongodb = db.db("predict2tensor");
                //mongodb.createCollection("results")
                console.log("Mongo Connected!");
                callback()
                });
        }

const getdb = () => {
        return mongodb;


    }
            
module.exports = {
        connect,
        getdb,
    }