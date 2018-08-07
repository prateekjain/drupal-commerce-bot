const builder = require('botbuilder');
const commerceApi = require('../api/commerceApi');

module.exports = function(bot) {
  bot.dialog('/addToCart', [
    
    function(session, args, next) {

      if (!args) {
        return session.reset('/confused');
      }

      const product = builder.EntityRecognizer.findEntity(
        args.entities,
        'Id'
      );

      if (!product || !product.entity) {
        builder.Prompts.text(
          session,
          'I am sorry, something went wrong.'
        );        
        session.reset('/showCart');
      } else {
        next({ response: product.entity });
      }

    },

    function(session, args, next) {
      
      session.sendTyping();
      const text = args.response;

      const parts = text.split('-');
      
      const productId = parts[0];
      const quantity = parts[1];

      commerceApi.addToCart(session,productId,quantity).then((response) => {              
        session.reset('/showCart');               
      });
      
      //session.reset('/showCart');
    }    
  ]);
};