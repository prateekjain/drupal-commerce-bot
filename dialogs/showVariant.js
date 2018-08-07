const builder = require('botbuilder');

const showVariant = function(session, product, variant) {
  session.sendTyping();

  const description =
    `${variant.crust ? 'Crust - ' + variant.crust + ',\n' : ''}` +
    `${variant.size ? 'Size - ' + variant.size + ',\n' : ''}` +
    `${variant.quantity ? 'Quantity - ' + variant.quantity : ''}`;

  const tile = new builder.HeroCard(session)
    .title(product.title)
    .subtitle(`$${variant.price}`)
    .text(description || product.description)
    .buttons([
      //Sending variant id and quantity
      builder.CardAction.postBack(session, `@add:${variant.id}-${variant.quantity}`, 'Add To Cart')
    ])
    .images([builder.CardImage.create(session, product.image)]);

  session.send(
    new builder.Message(session)
      .text('I am ready when you are')
      .attachments([tile])
  );
};

module.exports = function(bot) {
  bot.dialog('/showVariant', [
    function(session, args, next) {
      if (!args || !args.product || !args.variant) {
        return session.endDialog(
          'Sorry, I got distracted and lost track of our conversation. Where were we?'
        );
      }

      showVariant(session, args.product, args.variant);

      session.endDialog();
    }
  ]);
};