const builder = require('botbuilder');
const commerceApi = require('../api/commerceApi');
var constantsList = require('../constantsList');

module.exports = function (bot) {
  bot.dialog('/showCart', [
    function (session, args, next) {
      const lastVisit = session.userData.lastVisit;

      session.sendTyping();

      commerceApi.getCartDetails(session).then((response) => {

        if (response.length > 0) {
          var orderDetails = response[0];
          //showCartCard(session,orderId,paymentMethod, totalPrice);
          session.send('Alright! You are all set!');
          session.endDialog(
            new builder.Message(session).addAttachment(showCartCard(session, orderDetails))
          );
        }
        else {
          session.send('Your cart is empty!');
          session.reset('/categories');
        }

      });

      //      session.endDialog();
      //const cart = session.privateConversationData.cart;

      /* var testCheckout = true;
      if ((!cart || !cart.length) && !testCheckout) {
      //if (!cart || !cart.length) {
        session.send(
          'I would be happy to check you out but your cart appears to be empty. Look around and see if you like anything'
        );
        session.reset('/categories');
      } else {
        session.send('Alright! You are all set!');
        session.endDialog(
          new builder.Message(session).addAttachment(showCartCard(session))
        );
      }   */
    }
  ]);
};


function showCartCard(session, orderDetails) {

  var orderId = orderDetails.order_id;
  
  var paymentMethod = "Cash";
  var totalPrice = orderDetails.total_price.formatted;

  const items = orderDetails.order_items.map(item =>
    new builder.ReceiptItem.create(session, item.total_price.formatted, item.title + " X " + item.quantity)
      .quantity(item.quantity)
  );

  return new builder.ReceiptCard(session)
    .title('Order Summary')
    .facts([
      builder.Fact.create(session, orderId, 'Order Number'),
      builder.Fact.create(session, paymentMethod, 'Payment Method')
    ])
    .items(items)
    //.tax('$ 7.50')
    .total(totalPrice)
    .buttons([
      builder.CardAction.postBack(session, "Checkout", "Checkout"),
      builder.CardAction.postBack(session, "@list", "Add More"),
      builder.CardAction.postBack(session, "@empty", "Empty Cart")
      //builder.CardAction.openUrl(session, 'https://azure.microsoft.com/en-us/pricing/', 'More Information')
      //  .image('https://raw.githubusercontent.com/amido/azure-vector-icons/master/renders/microsoft-azure.png')
    ]);
}