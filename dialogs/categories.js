const builder = require('botbuilder');
var ssml = require('../api/ssml');

module.exports = function (bot) {
  bot.dialog('/categories', [
    function (session, args, next) {
      const lastVisit = session.userData.lastVisit;

      session.sendTyping();

      session.endDialog(
        listCategoriesCard(session)
      );

      //session.say("This output speech uses SSML.","<speak>This output speech uses SSML.</speak>");
      //session.endDialog('Choose what you want');
    }
  ]);
};

function listCategoriesCard(session) {

  var card = {
    'contentType': 'application/vnd.microsoft.card.adaptive',
    'content': {
      "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
      "type": "AdaptiveCard",
      "version": "1.0",
      "speak":"<speak><audio src='https://www.soundjay.com/misc/bell-ringing-04.mp3'/><s>Time to wake up!</s></speak>",
      "body": [
        {
          "type": "Container",
          "items": [{
            "type": "TextBlock",
            "text": "What would you like to order?",
            "wrap": true,
            "size": "medium",
            "weight": "bolder"
          }]
        },
        {
          "type": "ColumnSet",
          "columns": [
            {
              "type": "Column",
              "items": [            
                {
                  "type": "Image",
                  "url": "https://master-7rqtwti-rvsuscbxmkade.us.platform.sh/sites/default/files/inline-images/Pizza.png",
                  "size": "medium",
                  "horizontalAlignment": "center"
                },
                {
                  "type": "TextBlock",
                  "text": "Pizza",
                  "horizontalAlignment": "center",
                  "weight":"bolder",
                  "size": "large"
                }
              ],
              "selectAction": {
            "type": "Action.Submit",
            "title": "Show me some Pizza",
            "data": "Show me some Pizza"
          }
            },
            {
              "type": "Column",
              "items": [            
                {
                  "type": "Image",
                  "url": "https://master-7rqtwti-rvsuscbxmkade.us.platform.sh/sites/default/files/inline-images/Cold-Drink-Can.png",
                  "size": "medium",
                  "horizontalAlignment": "center"
                },
                {
                  "type": "TextBlock",
                  "text": "Drinks",
                  "horizontalAlignment": "center",
                  "weight":"bolder",
                  "size": "large"
                }
              ],
              "selectAction": {
            "type": "Action.Submit",
            "title": "Interested in drinks",
            "data": "Interested in drinks"
          }
            }
          ]
        }
      ]
    }
  };

    
  var adaptiveCardMessage = new builder.Message(session)
    .speak(speak(session, 'show_category_ssml'))
    .inputHint(builder.InputHint.acceptingInput)
    .addAttachment(card);

  return adaptiveCardMessage;
}

/** Helper function to wrap SSML stored in the prompts file with <speak/> tag. */
function speak(session, prompt) {
    var localized = session.gettext(prompt);
    console.log(localized);
    return ssml.speak(localized);
}