const builder = require('botbuilder');
const commerceApi = require('../api/commerceApi');
var constantsList = require('../constantsList');

module.exports = function (bot) {
  bot.dialog('/showCart', [
    function (session, args, next) {
      const lastVisit = session.userData.lastVisit;

      session.sendTyping();

      commerceApi.getCartDetails(session).then((response) => {
        console.log("cart details are --- ");
        console.log(response);
      });
      session.endDialog();
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


function showCartCard(session) {

  return new builder.ReceiptCard(session)
    .title('John Doe')
    .facts([
      builder.Fact.create(session, '1234', 'Order Number'),
      builder.Fact.create(session, 'VISA 5555-****', 'Payment Method')
    ])
    .items([
      builder.ReceiptItem.create(session, '$ 38.45', 'Data Transfer')
        .quantity(368)
        .image(builder.CardImage.create(session, 'https://github.com/amido/azure-vector-icons/raw/master/renders/traffic-manager.png')),
      builder.ReceiptItem.create(session, '$ 45.00', 'App Service')
        .quantity(720)
        .image(builder.CardImage.create(session, 'https://github.com/amido/azure-vector-icons/raw/master/renders/cloud-service.png'))
    ])
    .tax('$ 7.50')
    .total('$ 90.95')
    .buttons([
      builder.CardAction.postBack(session, "Checkout", "Checkout")
      //builder.CardAction.openUrl(session, 'https://azure.microsoft.com/en-us/pricing/', 'More Information')
      //  .image('https://raw.githubusercontent.com/amido/azure-vector-icons/master/renders/microsoft-azure.png')
    ]);
}