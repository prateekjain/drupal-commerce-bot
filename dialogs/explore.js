const builder = require('botbuilder');

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

module.exports = function(bot) {
  bot.dialog('/explore', [
    function(session, args, next) {
      const query = extractQuery(session, args);
      console.log("Query is " + query);
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
    function(session, args, next) {
      session.sendTyping();

      const query = args.response;
      
      builder.Prompts.text(
        session,
        `Got it. Let me find ${query} for you`
      );
      
      /* session.endDialog(
        `I tried looking for ${query} but I couldn't find anything, sorry!`
      ); */

      // ToDo: also need to search for products in the category
      /* search.find(query).then(({ subcategories, products }) => {
        if (subcategories.length) {
          session.privateConversationData = Object.assign(
            {},
            session.privateConversationData,
            {
              list: {
                type: 'categories',
                data: subcategories
              },
              pagination: {
                start: 0
              }
            }
          );
          session.save();

          listCategories(session, subcategories);
        } else if (products.length) {
          session.privateConversationData = Object.assign(
            {},
            session.privateConversationData,
            {
              list: {
                type: 'products',
                data: products
              },
              pagination: {
                start: 0
              }
            }
          );
          session.save();

          listProducts(session, products);
        } else {
          session.endDialog(
            `I tried looking for ${query} but I couldn't find anything, sorry!`
          );
        }
      }); */
    }
  ]);

  bot.dialog('/next', [
    function(session, args, next) {
      if (
        !session.privateConversationData ||
        !session.privateConversationData.list
      ) {
        return session.endDialog('Sorry, I have no active list to scroll');
      }

      const list = session.privateConversationData.list;
      const pagination = session.privateConversationData.pagination;

      switch (list.type) {
        case 'products':
          session.privateConversationData = Object.assign(
            {},
            session.privateConversationData,
            {
              pagination: {
                start: pagination.start + 4
              }
            }
          );
          session.save();

          return listProducts(session, list.data, pagination.start + 4);

        case 'categories':
          // ToDo: this is updating the state. Time to use Redux maybe?
          session.privateConversationData = Object.assign(
            {},
            session.privateConversationData,
            {
              pagination: {
                start: pagination.start + 6
              }
            }
          );
          session.save();

          return listCategories(session, list.data, pagination.start + 6);
      }

      session.endDialog(
        'Something funny happened and I started wondering who I am'
      );
    }
  ]);
};



/* module.exports = function(bot) {
  bot.dialog('/explore', [
    function(session, args, next) {

      const query = extractQuery(session, args);

      const lastVisit = session.userData.lastVisit;
              
      session.send('Good to know you are exploring...');
      session.endDialog('Explore end');
    }
  ]);
}; */