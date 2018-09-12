const builder = require('botbuilder');
const commerceApi = require('../api/commerceApi');

module.exports = function (bot) {
    bot.dialog('/emptyCart', [

        function (session, args, next) {

            if (!args) {
                return session.reset('/confused');
            }

            const orderId = builder.EntityRecognizer.findEntity(
                args.entities,
                'Id'
            );            

            if (!orderId || !orderId.entity) {
                builder.Prompts.text(
                    session,
                    'I am sorry, something went wrong.'
                );
                session.reset('/showCart');
            } 

            session.dialogData.orderId = orderId.entity;
            session.save();

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
                commerceApi.clearCart(session, session.dialogData.orderId).then((response) => {
                    session.reset('/showCart');                    
                });
            }
            else {
                session.reset('/showCart');
            }            
        }
    ]);
};