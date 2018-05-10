var restify = require('restify');
var builder = require('botbuilder');
var constantsList = require('./constantsList');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
  console.log('%s listening to %s', server.name, server.url);
});

// Create chat connector for communicating with the Bot Framework Service
/*var connector = new builder.ChatConnector({
  appId: process.env.MicrosoftAppId,
  appPassword: process.env.MicrosoftAppPassword
});*/

var connector = new builder.ChatConnector({
  appId: null,
  appPassword: null
});

// Listen for messages from users
server.post('/api/messages', connector.listen());

//Set the memorystorage
var inMemoryStorage = new builder.MemoryBotStorage();

var bot = new builder.UniversalBot(connector).set('storage', inMemoryStorage); // Register in memory storage

// Send welcome when conversation with bot is started, by initiating the root dialog
bot.on('conversationUpdate', function (message) {
  if (message.membersAdded) {
      message.membersAdded.forEach(function (identity) {
          if (identity.id === message.address.bot.id) {              
              bot.beginDialog(message.address, '/');
          }
      });
  }
});

var savedAddress;

// root dialog
bot.dialog('/', function(session, args) {
  
  //To send the initial welcome message only once
  var sendWelcomeMessage = false;
  
  if(!savedAddress) {
    sendWelcomeMessage = true;
  }
  savedAddress = session.message.address;

  if(savedAddress && sendWelcomeMessage) {
    session.send(constantsList.welcomeMessage);
  }
  
  
});


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








function getCardsAttachments(session) {
  return [
      new builder.HeroCard(session)
          .title('Azure Storage')
          .subtitle('Offload the heavy lifting of data center management')
          .text('Store and help protect your data. Get durable, highly available data storage across the globe and pay only for what you use.')
          .images([
              builder.CardImage.create(session, 'https://docs.microsoft.com/en-us/aspnet/aspnet/overview/developing-apps-with-windows-azure/building-real-world-cloud-apps-with-windows-azure/data-storage-options/_static/image5.png')
          ])
          .buttons([
              builder.CardAction.openUrl(session, 'https://azure.microsoft.com/en-us/services/storage/', 'Learn More')
          ]),

      new builder.ThumbnailCard(session)
          .title('DocumentDB')
          .subtitle('Blazing fast, planet-scale NoSQL')
          .text('NoSQL service for highly available, globally distributed apps—take full advantage of SQL and JavaScript over document and key-value data without the hassles of on-premises or virtual machine-based cloud database options.')
          .images([
              builder.CardImage.create(session, 'https://docs.microsoft.com/en-us/azure/documentdb/media/documentdb-introduction/json-database-resources1.png')
          ])
          .buttons([
              builder.CardAction.openUrl(session, 'https://azure.microsoft.com/en-us/services/documentdb/', 'Learn More')
          ]),

      new builder.HeroCard(session)
          .title('Azure Functions')
          .subtitle('Process events with a serverless code architecture')
          .text('An event-based serverless compute experience to accelerate your development. It can scale based on demand and you pay only for the resources you consume.')
          .images([
              builder.CardImage.create(session, 'https://msdnshared.blob.core.windows.net/media/2016/09/fsharp-functions2.png')
          ])
          .buttons([
              builder.CardAction.openUrl(session, 'https://azure.microsoft.com/en-us/services/functions/', 'Learn More')
          ]),

      new builder.ThumbnailCard(session)
          .title('Cognitive Services')
          .subtitle('Build powerful intelligence into your applications to enable natural and contextual interactions')
          .text('Enable natural and contextual interaction with tools that augment users\' experiences using the power of machine-based intelligence. Tap into an ever-growing collection of powerful artificial intelligence algorithms for vision, speech, language, and knowledge.')
          .images([
              builder.CardImage.create(session, 'https://msdnshared.blob.core.windows.net/media/2017/03/Azure-Cognitive-Services-e1489079006258.png')
          ])
          .buttons([
              builder.CardAction.openUrl(session, 'https://azure.microsoft.com/en-us/services/cognitive-services/', 'Learn More')
          ])
  ];
}

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