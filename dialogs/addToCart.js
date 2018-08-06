const builder = require('botbuilder');
const commerceApi = require('../api/commerceApi');

module.exports = function(bot) {
  bot.dialog('/addToCart', [
    
    function(session, args, next) {

      if (!args) {
        return session.reset('/confused');
      }

      console.log("in add to cart args");
      console.log(args);

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
      
      //@TODO : overriding this with variant id
      //const productId = parts[0];
      const productId = 28;
      const quantity = parts[1];

      console.log("productid " + productId);
      console.log("quantity " + quantity);

      commerceApi.addToCart(session,productId,quantity).then((response) => {
        
        console.log("add to cart successful");
        console.log(response);

        session.reset('/showCart');
        
        /* if (searchResult && searchResult.length) {
          builder.Prompts.text(
            session,
            `We have found ${searchResult.length} search results for you`
          );

          console.log(searchResult);

          listProducts(session, searchResult);

        }
        else {
          session.endDialog(
            `I tried looking for ${query} but I couldn't find anything, sorry!`
          );
        } */
      });
      
      //session.reset('/showCart');
    }    
  ]);
};