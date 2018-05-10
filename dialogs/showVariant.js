module.exports = function(bot) {
  bot.dialog('/showVariant', [
    function(session, args, next) {
      const lastVisit = session.userData.lastVisit;
              
      session.send('variants will be shown soon...');
      session.endDialog('Show variant end');
    }
  ]);
};