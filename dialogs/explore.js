const builder = require('botbuilder');
const commerceApi = require('../api/commerceApi');
var constantsList = require('../constantsList');


const extractQuery = (session, args) => {
  if (args && args.entities && args.entities.length) {
    // builder.EntityRecognizer.findEntity(args.entities, 'CompanyName');
    // builder.EntityRecognizer.findBestMatch(data, entity.entity);
    const question = args.entities.find(e => e.type === 'Entity');
    const detail = args.entities.find(e => e.type === 'Detail');

    return `${(detail || { entity: '' }).entity} ${
      (question || { entity: '' }).entity
      }`.trim();
  } else if (session.message.text.split(' ').length <= 2) {
    // just assume they typed a category or a product name
    return session.message.text.replace('please', '').trim();
  } else {
    return undefined;
  }
};

module.exports = function (bot) {
  bot.dialog('/explore', [
    function (session, args, next) {
      
      const query = extractQuery(session, args);      
      if (!query) {
        // ToDo: randomize across a few different sentences
        builder.Prompts.text(
          session,
          'I am sorry, what would you like me to look up for you?'
        );
      } else {        
        next({ response: query });
      }
    },
    function (session, args, next) {

      const query = args.response;

      session.sendTyping();
      
      builder.Prompts.text(
        session,
        `Got it. Let me find ${query} for you`
      );

      
      session.endDialog(); //enddialog within the search API call wasn't ending the session
      commerceApi.search(session, query).then((searchResult) => {
        if (searchResult && searchResult.length) {
          builder.Prompts.text(
            session,
            `We have found ${searchResult.length} search results for you`
          );

          listProducts(session, searchResult);

        }
        else {
          session.endDialog(
            `I tried looking for ${query} but I couldn't find anything, sorry!`
          );
          session.reset('/categories');
        }
      });
    }
  ]);
};


const listProducts = (session, products, start = 0) => {
  // ToDo: need to filter out products with very small @search.score
  const slice = products.slice(start, start + 4);
  if (slice.length === 0) {
    return session.endDialog(
      "That's it. You have seen it all. See anything you like? Just ask for it."
    );
  }

  const cards = slice.map(p =>
    new builder.ThumbnailCard(session)
      .title(p.title)
      .subtitle(p.type)
      .text(p.body)
      .buttons([
        builder.CardAction.postBack(session, `@show:${p.product_id}`, 'Select')
      ])
      .images([
        builder.CardImage.create(session, constantsList.baseURL + p.field_image).tap(
          builder.CardAction.postBack(session, `@show:${p.product_id}`)
        )
      ])
  );

  session.sendTyping();
  session.endDialog(
    new builder.Message(session)
      .attachments(cards)
      .attachmentLayout(builder.AttachmentLayout.carousel)
  );
};
