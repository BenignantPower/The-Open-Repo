const express = require("express");
const {upload} = require("../utils/fileUpload");

const router = express.Router();

const eventController = require("../controllers/event");

router.get("/events",eventController.getEvent);

router.post("/events",upload.array("files"),eventController.createEvent);

router.put("/events/:id",upload.array("files"),eventController.putEvent);