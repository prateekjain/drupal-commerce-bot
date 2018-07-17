const builder = require('botbuilder');
module.exports = function (bot) {
  bot.dialog('/categories', [
    function (session, args, next) {
      const lastVisit = session.userData.lastVisit;

      session.sendTyping();

      session.send(
        listCategoriesCard(session)
      );

      session.endDialog('Choose what you want');
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
                  "url": "http://www.clker.com/cliparts/F/X/i/9/M/1/pizza-hi.png",
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
                  "url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNT8WMcumnj-e5rmM9IX6ke7yq7NJlaPqhmHi_I93RP7KbpuzH5A",
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
            "data": "Interested in turpis"
          }
            }
          ]
        }
      ]
    }
  };

  var adaptiveCardMessage = new builder.Message(session)
    .addAttachment(card);

  return adaptiveCardMessage;
}