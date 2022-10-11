const express = require("express");
const {upload} = require("../utils/fileUpload");

const router = express.Router();

const eventController = require("../controllers/event");

router.get("/events",eventController.getEvent);