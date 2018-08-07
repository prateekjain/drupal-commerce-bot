const builder = require('botbuilder');
const commerceApi = require('../api/commerceApi');

/* const showProduct = function (session, product) {
  session.sendTyping();

  const tile = new builder.HeroCard(session)
    .title(product.title)
    .subtitle(`$${product.price}`)
    .text(product.description)
    .buttons(
      product.modifiers.length === 0 ||
        (product.size.length <= 1 && product.color.length <= 1)
        ? [
          builder.CardAction.postBack(
            session,
            `@add:${product.id}`,
            'Add To Cart'
          )
        ]
        : []
    )
    .images([builder.CardImage.create(session, product.image)]);

  session.send(new builder.Message(session).attachments([tile]));
}; */

module.exports = function (bot) {
  bot.dialog('/showProduct', [
    function (session, args, next) {

      if (!args) {
        return session.reset('/confused');
      }

      const product = builder.EntityRecognizer.findEntity(
        args.entities,
        'Product'
      );

      if (!product || !product.entity) {
        builder.Prompts.text(
          session,
          'I am sorry, what product would you like to see?'
        );
      } else {
        next({ response: product.entity });
      }
    },
    function (session, args, next) {
      session.sendTyping();

      const productId = args.response;
      session.dialogData.productId = productId;

      commerceApi.findProductById(session, productId).then((response) => {

        if (response.length > 0) {
          
          session.dialogData.product = response;
          next();
        }
        else {
          session.endDialog(
            "Sorry, I couldn't find the product you asked about"
          );
          session.reset('/categories');
        }

      });
    },
    function (session, args, next) {
      session.beginDialog('/choseVariant', {
        product: session.dialogData.product,
        productId: session.dialogData.productId
      });
    },
    function (session, args, next) {
      
      const crust =
        args &&
        args.response &&
        args.response.crust &&
        args.response.crust.entity;
      const size =
        args &&
        args.response &&
        args.response.size &&
        args.response.size.entity;

      const quantity =
        args &&
        args.response &&
        args.response.quantity &&
        args.response.quantity.entity;

      // ToDo: I wonder if it's still here after we ran another dialog on top of the current one or if I need to cary it back
      const productVariations = session.dialogData.product;
      
      var selectedProductVariation = productVariations.filter(function(item) {
        return (item.size === size && item.crust === crust);
      })[0];

      const product = {
        title: selectedProductVariation.title,
        description: selectedProductVariation.size + " - " + selectedProductVariation.crust,
        image: selectedProductVariation.image
      }

      const variant = {
        crust: crust,
        size: size,
        quantity: quantity,
        price: selectedProductVariation.price,
        id: selectedProductVariation.commerce_product_variation_id
      };
      session.sendTyping();
      session.reset('/showVariant', { product, variant });

      //Find variant details

      /*  search.findVariantForProduct(product.id, color, size).then(variant => {
         if (color || size) {
           session.sendTyping();
           session.reset('/showVariant', { product, variant });
         } else {
           session.endDialog();
         }
       }); */
    }
  ]);
};