module.exports = function(bot) {
  bot.dialog('/choseVariant', [
    function(session, args, next) {
      const lastVisit = session.userData.lastVisit;
              
      session.send('you will be able to choose variants soon...');
      session.endDialog('Choose variant end');
    }
  ]);
};