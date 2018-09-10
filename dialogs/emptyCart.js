const builder = require('botbuilder');
const commerceApi = require('../api/commerceApi');

module.exports = function (bot) {
    bot.dialog('/emptyCart', [

        function (session, args, next) {

            builder.Prompts.choice(
                session,
                `Are you sure you want to empty your cart?`,
                'Yes|No',
                {
                    listStyle: builder.ListStyle.button
                }
            );
        },

        function (session, args, next) {

            session.sendTyping();
            const text = args.response;
            if (session.message.text === 'Yes') {
                //Call REST API to empty cart
                console.log("Empty the cart");
            }
            else {
                console.log("Show the cart");                
            }

            session.reset('/showCart');
            
            
        }
    ]);
};