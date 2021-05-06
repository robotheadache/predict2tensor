//This file can be imported as to generate a reusable connection to the mongoDB results database.
var MongoClient = require('mongodb').MongoClient;
var mongoURL = "mongodb://localhost:27017/";
var mongodb;

//a function used to generate a connection pool for mongo.
const connect = (callback) => {
        
        if (mongodb) return callback()

        MongoClient.connect(mongoURL, (err, db) => {
                //update mongodb variable to be a shortcut to the predict2dtensor db
                mongodb = db.db("predict2tensor");

                mongodb.listCollections().toArray(function(err, collections) {
                        if(err) console.log(err);
                        //if createCol is unchanged, we create the results collection
                        let createCol = true
                        collections.forEach(col => {
                                if (col.name == "results"){
                                        //if we see a collection with that name already, we set it false
                                        createCol = false;
                                }
                            });
                        //if it was left unchanged, we add the new collection
                        if (createCol){
                                mongodb.createCollection("results")

                        }
                     });
                console.log("Mongo Connected!");
                callback()
                });
        }

//A function that returns the database object.
const getdb = () => {
        return mongodb;


    }
            
module.exports = {
        connect,
        getdb,
    }