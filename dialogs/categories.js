module.exports = function(bot) {
  bot.dialog('/categories', [
    function(session, args, next) {
      const lastVisit = session.userData.lastVisit;
      console.log("in show categories");
      session.send('categories will be shown soon...');
      session.endDialog('Show categories end');
    }
  ]);
};