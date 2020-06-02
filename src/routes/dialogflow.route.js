const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const multer = require("multer");
const _ = require("lodash");

const dialogflow = require("dialogflow");
const { struct } = require("pb-util");

const privateKey = _.replace(
  process.env.DIALOGFLOW_PRIVATE_KEY,
  new RegExp("\\\\n", "g"),
  "\n"
);

var dialogflowClient = {
  projectId: process.env.DIALOGFLOW_PROJECT_ID,
  sessionClient: new dialogflow.SessionsClient({
    credentials: {
      client_email: process.env.DIALOGFLOW_CLIENT_EMAIL,
      private_key: privateKey,
    },
  }),
};

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.post("/message/text/send", async (req, res) => {
  let { text, email, sessionId } = req.body;
  let { projectId, sessionClient } = dialogflowClient;
  let sessionPath = sessionClient.sessionPath(projectId, sessionId);

  console.log("\n############################");
  console.log("Text Message to Dialogflow");
  console.log("Question...: " + text);
  console.log("SessionId..: " + sessionId);
  console.log("Email......: " + email);
  console.log("############################");

  const responses = await sessionClient.detectIntent({
    session: sessionPath,
    queryInput: {
      text: {
        text: `${text}`,
        languageCode: "pt-BR",
      },
    },
  });

  return res.json({
    message: responses[0].queryResult.fulfillmentText,
    date: new Date().getTime,
  });
});

router.post("/message/fullfilment", async (req, res) => {});

module.exports = router;
