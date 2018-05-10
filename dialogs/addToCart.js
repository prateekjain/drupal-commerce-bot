module.exports = function(bot) {
  bot.dialog('/addToCart', [
    function(session, args, next) {
      const lastVisit = session.userData.lastVisit;
              
      session.send(['Add to cart will come soon....']);      
      session.endDialog('Add to cart end');
    }
  ]);
};