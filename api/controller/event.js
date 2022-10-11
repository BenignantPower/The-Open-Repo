let mongodb = require("mongodb");
let MongoClient = require('mongodb').MongoClient
let url = 'mongodb://127.0.0.1:27017/';

exports.getEvent = async(req,res,next)=>{
    const eventId = req.query.event_id;

    const type = req.query.type;
    const limit = parseInt(req.query.limit);
    const page = parseInt(req.query.page);

    if(!type && !limit && !page && !eventId)
    {
        return res.status(404).json({
            error: "Please enter an event Id or type,limit,page"
        })
    }

    if(eventId)
    {
        MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true},(err, client)=>{
            db = client.db("event")
            db.collection('eventList')
                    .find({_id : new mongodb.ObjectId(eventId) })
                    .toArray()
                    .then(result =>{
                        if(result.length<1)
                        {
                            res.status(201).json({
                                error: "Event with the given id does not exists"
                            });
                        }
                        res.status(201).json({
                            event: result[0]
                        });
                    })
                    .catch(err => {
                        res.status(500).json({
                            err:"could not create a new event"
                        })
                    });
        });        
    }
    if(type && limit && page)
    {
        const startIndex = (page - 1) * limit
        const endIndex = page * limit

        let totalEvents;
        MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true},(err, client)=>{
            db = client.db("event")
            db.collection('eventList')
                    .find()
                    .toArray()
                    .then(result =>{
                        totalEvents = result.length;
                    })
                    .catch(err => {
                        res.status(500).json({
                            err:"Server side Error"
                        })
                    });
        });
        MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true},(err, client)=>{
            db = client.db("event")
            db.collection('eventList')
                    .find({type:type})
                    .limit(limit)
                    .skip(startIndex)
                    .toArray()
                    .then(result =>{
                        
                        const ansObject = {}
                        if (endIndex < totalEvents) {
                            ansObject.next = {
                            page: page + 1,
                            limit: limit
                            }
                        }
                        
                        if (startIndex > 0) {
                            ansObject.previous = {
                                page: page - 1,
                                limit: limit
                            }
                        }

                        ansObject.events = result;

                        res.status(200).json({
                            msg:"Events fetched according to their recency",
                            eventList:ansObject
                        })
                        
                    })
                    .catch(err => {
                        res.status(500).json({
                            err:"could not create a new event"
                        })
                    });
        });
    }
}