module.exports = function(bot) {
    bot.dialog('/checkout', [
      function(session, args, next) {
        const lastVisit = session.userData.lastVisit;        
                
        session.send('checkout will be available soon..');
        session.endDialog('Checkout end');
      }
    ]);
  };