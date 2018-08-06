const builder = require('botbuilder');

module.exports = function (bot) {
  bot.dialog('/choseVariant', [
    function (session, args, next) {

      const item = {
        title: "marg pizza",
        //modifiers: ["crust", "size"],
        modifiers: [],
        crust: ["Thin crust", "Regular"],
        size: ["Medium", "Large"],
        quantity: ["1","2","3","4","5"] //Add option for more and handle that
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
    },
    function (session, args, next) {

      const item = session.dialogData.product;
      // ToDo: response comes back as [true] if the user accepted the single color there was
      console.log(args.response);
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
      // ToDo: response comes back as [true] if the user accepted the single color there was
      console.log(args.response);
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