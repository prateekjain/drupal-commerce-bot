const builder = require('botbuilder');
const commerceApi = require('../api/commerceApi');

const showProduct = function (session, product) {
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
};

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

      const product = args.response;
      console.log("prodcut id is ");
      console.log(product);
      console.log("------------");


      // Get the product variations and pass it to next..
      /* Promise.all([
        commerceApi.findProductById(product),
        //search.findProductsByTitle(product)
      ])
        .then(([product, products]) => {
          const item = product.concat(products)[0];
          if (!item) {
            session.endDialog(
              "Sorry, I couldn't find the product you asked about"
            );
            return Promise.reject();
          } else {
            return item;
          }
        })
        .then(item => {
          showProduct(session, item);
          return item;
        })
        .then(item => {
          session.dialogData.product = item;

          if (
            item.modifiers.length === 0 ||
            (item.size.length <= 1 && item.color.length <= 1)
          ) {
            next();
          } else {
            builder.Prompts.confirm(
              session,
              `This product comes in differnet ` +
              item.modifiers.map(mod => `${mod}s`).join(' and ') +
              '. Would you like to choose one that fits you?',
              { listStyle: builder.ListStyle.button }
            );
          }
        })
        .catch(err => {
          console.error(err);
        }); */
      session.dialogData.product = product;
      next();
    },
    function (session, args, next) {
      session.beginDialog('/choseVariant', {
        product: session.dialogData.product
      });
    },
    function (session, args, next) {
      console.log("variations here --- ");
      console.log(args);
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
      const productId = session.dialogData.product;
      
      const product = {
        title: "Test title",
        description: "Test Description",
        image: ""
      }

      const variant = {
        crust : crust,
        size: size,
        quantity: quantity,
        price: "5",
        id: "10"
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