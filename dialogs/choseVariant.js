const builder = require('botbuilder');
const commerceApi = require('../api/commerceApi');

module.exports = function (bot) {
  bot.dialog('/choseVariant', [
    function (session, args, next) {

      session.sendTyping();
      const productId = args.productId;
      const productVariations = args.product;
      commerceApi.getProductDetails(session, productId).then((response) => {

        if (response) {
          var modifiersArray= [];
          
          const sizeArray = getUniqueValuesOfKey(productVariations,"size");
          
          if(sizeArray.length > 0) {
            modifiersArray.push("size");
          }

          const crustArray = getUniqueValuesOfKey(productVariations,"crust");
          
          if(crustArray.length > 0) {
            modifiersArray.push("crust");
          }

          const quantityArray = ["1","2","3","4","5"];

          const item = {
            title: response.title[0].value,
            modifiers: modifiersArray,            
            crust: crustArray,
            size: sizeArray,
            quantity: quantityArray //Add option for more and handle that
          }

          session.dialogData.product = item;
          //const item = (session.dialogData.product = args.product);
          if (!item.modifiers.includes('crust')) {
            next();
          } else {
            builder.Prompts.choice(
              session,
              `Please select crust you'd like best for your ${item.title}`,
              item.crust,
              {
                listStyle: builder.ListStyle.button
              }
            );
          }
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

      const item = session.dialogData.product;
      
      session.dialogData.crust = args.response || item.crust[0];
      session.save();

      if (!item.modifiers.includes('size')) {
        next();
      } else {
        builder.Prompts.choice(
          session,
          `Please select a size for your ${item.title}`,
          item.size,
          {
            listStyle: builder.ListStyle.button
          }
        );
      }
    },
    function (session, args, next) {

      const item = session.dialogData.product;
      
      session.dialogData.size = args.response || item.size[0];
      session.save();


      builder.Prompts.choice(
        session,
        `And how many ${item.title} do you want?`,
        item.quantity,
        {
          listStyle: builder.ListStyle.button
        }
      );
    },
    function (session, args, next) {
      if (session.message.text === 'no') {
        return session.endDialog(
          "Well, sorry. Come check next time. Maybe we'll have your size in stock. Thanks!"
        );
      }

      const item = session.dialogData.product;

      session.dialogData.quantity = args.response || item.quantity[0];
      session.save();      

      session.endDialogWithResult({
        response: {
          crust: session.dialogData.crust,
          size: session.dialogData.size,
          quantity: session.dialogData.quantity
        }
      });
    }
  ]);
};

function getUniqueValuesOfKey(array, key){
  return array.reduce(function(carry, item){
    if(item[key] && !~carry.indexOf(item[key])) carry.push(item[key]);
    return carry;
  }, []);
}