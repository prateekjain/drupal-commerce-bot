module.exports = function(bot) {
  bot.dialog('/showCart', [
    function(session, args, next) {
      const lastVisit = session.userData.lastVisit;
              
      session.send('cart details will be available soon...');
      session.endDialog('Show cart end');
    }
  ]);
};