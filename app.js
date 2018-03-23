var builder = require('botbuilder');
var restify = require('restify');

//Setup Restify server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function(){
   console.log('%s listening to %s', server.name,server.url);
});


//Create Bot
var connector = new builder.ChatConnector({
    appId: process.env.Microsoft_App_Id,
    appPassword: process.env.Microsoft_App_Password
});
server.post('/api/messages', connector.listen());



var bot = new builder.UniversalBot(connector, function(session){
   session.send("Hello,You said %s", session.message.text);
});