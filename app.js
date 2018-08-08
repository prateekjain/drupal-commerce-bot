const express = require('express');
var builder = require('botbuilder');
var constantsList = require('./constantsList');
var path = require("path");

const greeting = require('./recognizer/greeting');
const commands = require('./recognizer/commands');
const smiles = require('./recognizer/smiles');


const dialog = {
    welcome: require('./dialogs/welcome'),
    categories: require('./dialogs/categories'),
    explore: require('./dialogs/explore'),
    choseVariant: require('./dialogs/choseVariant'),
    showProduct: require('./dialogs/showProduct'),
    showVariant: require('./dialogs/showVariant'),
    addToCart: require('./dialogs/addToCart'),
    showCart: require('./dialogs/showCart'),
    checkout: require('./dialogs/checkout')
}

// Setup Express Server
const server = express();


// Create chat connector for communicating with the Bot Framework Service
/*var connector = new builder.ChatConnector({
  appId: process.env.MicrosoftAppId,
  appPassword: process.env.MicrosoftAppPassword
});*/

var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

console.log(path.join(__dirname + '/index.html'));
server.get(`/`, (_, res) => res.sendFile(path.join(__dirname + '/index.html')));
// Listen for messages from users
server.post('/api/messages', connector.listen());

server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('Express HTTP is ready and is accepting connections');
});

//Set the memorystorage
var inMemoryStorage = new builder.MemoryBotStorage();

var bot = new builder.UniversalBot(connector, {
    privateConversationData: true
}).set('storage', inMemoryStorage); // Register in memory storage

// Send welcome when conversation with bot is started, by initiating the root dialog
/* bot.on('conversationUpdate', function (message) {
    if (message.membersAdded) {
        message.membersAdded.forEach(function (identity) {
            if (identity.id === message.address.bot.id) {
                bot.beginDialog(message.address, '/');
            }
        });
    }
}); */



// Make sure you add code to validate these fields
var luisAppId = constantsList.luisAppId;
var luisAPIKey = constantsList.luisAPIKey
var luisAPIHostName = constantsList.luisAPIHostName;

//https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/ccb1ece3-1aa4-4f97-9070-a91d36ed8973?subscription-key=0c4db7517b2f497e894b2d7dfbb50786&staging=true&verbose=true&timezoneOffset=0&q=

const LuisModelUrl = 'https://' + luisAPIHostName + '/luis/v2.0/apps/' + luisAppId + '?subscription-key=' + luisAPIKey + '&staging=true&verbose=true&timezoneOffset=0';

// Create a recognizer that gets intents from LUIS, and add it to the bot
// var recognizer = new builder.LuisRecognizer(LuisModelUrl);
// bot.recognizer(recognizer);


// Add a dialog for each intent that the LUIS app recognizes.
// See https://docs.microsoft.com/en-us/bot-framework/nodejs/bot-builder-nodejs-recognize-intent-luis 
// bot.dialog('Explore',
//     (session) => {
//         session.send('You reached the Explore intent. You said \'%s\'.', session.message.text);
//         session.endDialog();
//     }
// ).triggerAction({
//     matches: 'Explore'
// })


var intents = new builder.IntentDialog({
    recognizers: [
        commands,
        greeting,
        new builder.LuisRecognizer(LuisModelUrl)
    ],
    intentThreshold: 0.4,
    recognizeOrder: builder.RecognizeOrder.series
});



// var savedAddress;

// root dialog
// bot.dialog('/', function (session, args) {

//     //To send the initial welcome message only once
//     var sendWelcomeMessage = false;

//     if (!savedAddress) {
//         sendWelcomeMessage = true;
//     }
//     savedAddress = session.message.address;

//     if (savedAddress && sendWelcomeMessage) {
//         session.send(constantsList.welcomeMessage);
//     }

// },intents);


intents.matches('Greeting', '/welcome');
intents.matches('ShowTopCategories', '/categories');
intents.matches('Explore', '/explore');
intents.matches('ShowProduct', '/showProduct');
intents.matches('AddToCart', '/addToCart');
intents.matches('ShowCart', '/showCart');
intents.matches('Checkout', '/checkout');
intents.matches('Reset', '/reset');
intents.matches('Smile', '/smileBack');
intents.onDefault('/confused');

bot.dialog('/', intents);
dialog.welcome(bot);
dialog.categories(bot);
dialog.explore(bot);
dialog.showProduct(bot);
dialog.choseVariant(bot);
dialog.showVariant(bot);
dialog.addToCart(bot);
dialog.showCart(bot);
dialog.checkout(bot);

bot.dialog('/confused', [
    function (session, args, next) {
        // ToDo: need to offer an option to say "help"
        if (session.message.text.trim()) {
            session.endDialog(
                "Sorry, I didn't understand you or maybe just lost track of our conversation"
            );
            session.reset('/categories');
        } else {
            session.endDialog();
        }
    }
]);

bot.on('routing', smiles.smileBack.bind(smiles));

bot.dialog('/reset', [
    function (session, args, next) {

        session.endDialog(
            "Ok. Lets start again!"
        );
        session.reset('/categories');        
    }
]);

// bot.dialog('/checkout', [
//     function (session, args, next) {
//         const cart = session.privateConversationData.cart;

//         if (!cart || !cart.length) {
//             session.send(
//                 'I would be happy to check you out but your cart appears to be empty. Look around and see if you like anything'
//             );
//             session.reset('/categories');
//         } else {
//             session.endDialog('Alright! You are all set!');
//         }
//     }
// ]);


// send simple notification
function sendProactiveMessage(address) {
    var msg = new builder.Message().address(address);
    msg.text('Hello, this is a notification');
    msg.textLocale('en-US');
    bot.send(msg);
}



// Do GET this endpoint to delivey a notification
server.get('/api/CustomWebApi', (req, res, next) => {
    sendProactiveMessage(savedAddress);
    res.send('triggered');
    next();
}
);





/* // Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
var bot1 = new builder.UniversalBot(connector, function (session) {
  //session.send("You said: %s", session.message.text);
  var cards = getCardsAttachments();

    // create reply with Carousel AttachmentLayout
    var reply = new builder.Message(session)
        .attachmentLayout(builder.AttachmentLayout.carousel)
        .attachments(cards);

    session.send(reply);

}).set('storage', inMemoryStorage); */


/* var bot2 = new builder.UniversalBot(connector, [
  function (session) {
      session.send("Welcome to the dinner reservation.");
      builder.Prompts.time(session, "Please provide a reservation date and time (e.g.: June 6th at 5pm)");
  },
  function (session, results) {
      session.dialogData.reservationDate = builder.EntityRecognizer.resolveTime([results.response]);
      builder.Prompts.text(session, "How many people are in your party?");
  },
  function (session, results) {
      session.dialogData.partySize = results.response;
      builder.Prompts.text(session, "Whose name will this reservation be under?");
  },
  function (session, results) {
      session.dialogData.reservationName = results.response;

      // Process request and display reservation details
      session.send(`Reservation confirmed. Reservation details: <br/>Date/Time: ${session.dialogData.reservationDate} <br/>Party size: ${session.dialogData.partySize} <br/>Reservation name: ${session.dialogData.reservationName}`);
      session.endDialog();
  }
]).set('storage', inMemoryStorage); // Register in-memory storage  */