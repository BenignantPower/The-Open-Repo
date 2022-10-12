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

exports.createEvent = async(req,res,next)=>{
    let filesArray = [];
    req.files.forEach(element => {
        const file = {
            fileName: element.originalname,
            filePath: element.path,
            fileType: element.mimetype,
            fileSize: fileSizeFormatter(element.size, 2)
        }
        filesArray.push(file);
    });
    const type = req.body.type;
    const uid = req.body.uid;
    const name = req.body.name;
    const tagline = req.body.tagline;
    const schedule = req.body.schedule;
    const description = req.body.description;
    const moderator = req.body.moderator;
    const category = req.body.category;
    const sub_category = req.body.sub_category;
    const rigor_rank = req.body.rigor_rank;
    const attendes = req.body.attendes;

    var eventObject = {
        type : type,
        uid : uid,
        name : name,
        tagline : tagline,
        schedule : new Date(schedule).toString().split('G')[0],
        description : description,
        files: filesArray,
        moderator : moderator,
        category : category,
        sub_category : sub_category,
        rigor_rank : rigor_rank,
        attendes : attendes
    };
    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true},(err, client)=>{
        db = client.db("event")
        db.collection('eventList')
                .insertOne(eventObject)
                .then(result =>{
                    res.status(201).json({
                        eventid : result.insertedId,
                    });
                })
                .catch(err => {
                    res.status(500).json({
                        err:"could not create a new event"
                    })
                });
    });
}

exports.putEvent = async(req,res,next)=>{
    let filesArray = [];
    req.files.forEach(element => {
        const file = {
            fileName: element.originalname,
            filePath: element.path,
            fileType: element.mimetype,
            fileSize: fileSizeFormatter(element.size, 2)
        }
        filesArray.push(file);
    });
    const id = req.params.id;
    const type = req.body.type;
    const uid = req.body.uid;
    const name = req.body.name;
    const tagline = req.body.tagline;
    const schedule = req.body.schedule;
    const description = req.body.description;
    const moderator = req.body.moderator;
    const category = req.body.category;
    const sub_category = req.body.sub_category;
    const rigor_rank = req.body.rigor_rank;
    const attendes = req.body.attendes;

    var eventObject = {
        type : type,
        uid : uid,
        name : name,
        tagline : tagline,
        schedule : new Date(schedule).toString().split('G')[0],
        description : description,
        files: filesArray,
        moderator : moderator,
        category : category,
        sub_category : sub_category,
        rigor_rank : rigor_rank,
        attendes : attendes
    };
    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true},(err, client)=>{
        db = client.db("event")
        db.collection('eventList')
                .find({_id : new mongodb.ObjectId(id) })
                .toArray()
                .then(result =>{
                    return db.collection('eventList')
                                .updateOne(
                                    result[0],
                                    { $set: eventObject },
                                    {upsert:true},
                                    (err, data)=>{
                                        if(err) throw err;
                                        res.status(201).json({
                                            eventid : id,
                                            message:"event details updated"
                                        });
                                    }
                                );
                })
                .catch(err => {
                    res.status(500).json({
                        err:"could not create a new event"
                    })
                });
    });
}