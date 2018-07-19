const builder = require('botbuilder');
var constantsList = require('../constantsList');

module.exports = function (bot) {
  bot.dialog('/welcome', [
    function (session, args, next) {
      const lastVisit = session.userData.lastVisit;

      session.send(['Hello!', 'Hi there!', 'Hi!']);
      
      if (!lastVisit) {
        session.send(
          new builder.Message(session).addAttachment(createWelcomeCard(session))
        );
        /*session.send(
          constantsList.welcomeMessage
        );*/
        session.userData = Object.assign({}, session.userData, {
          lastVisit: new Date()
        });
        session.save();
      } else {
        session.send("Glad you're back!");
      }

      session.endDialog(constantsList.startConversationText);
    }
  ]);
};

function createWelcomeCard(session) {
  return new builder.HeroCard(session)
    .title(constantsList.welcomeMessage)
    .subtitle(constantsList.welcomeSubTitle)
    .images([
      builder.CardImage.create(session, 'https://ae01.alicdn.com/kf/HTB13w_FKpXXXXXVaXXXq6xXFXXXa/Free-Shipping-3D-custom-sushi-letters-mural-borderless-restaurant-pizza-store-coffee-shop-wallpaper-mural.jpg_640x640.jpg')
    ]);
}