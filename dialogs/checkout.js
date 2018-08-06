const builder = require('botbuilder');
const commerceApi = require('../api/commerceApi');
var constantsList = require('../constantsList');

module.exports = function (bot) {
  bot.dialog('/checkout', [
    function (session, args, next) {
      
      session.sendTyping();

      commerceApi.getCartDetails(session).then((response) => {

        if (response.length > 0) {
          var orderDetails = response[0];
          next({ orderId: orderDetails.order_id});
        }
        else {
          session.send('Your cart is empty!');
          session.reset('/categories');
        }
      });      
    },
    function (session, args, next) {
      const orderId = args.orderId;
      session.dialogData.orderId = orderId;
      session.save();

      builder.Prompts.text(session, 'Your order is almost complete. What is your email address?');
    },
    function (session, args, next) {
      console.log("the response here is ");
      console.log(args.response);

      commerceApi.completeOrder(session,session.dialogData.orderId,args.response).then((response) => {
        session.endDialog(`Your order id ${response.order_id[0].value} is confirmed. Thank you for using Pizza Bot service.`);
      });   
    }

  ]);
};
