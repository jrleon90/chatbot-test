
const builder = require('botbuilder');
const restify = require('restify');
const request = require('request');

require('dotenv').config();


//Setup Restify server
const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, () =>{
   console.log('%s listening to %s', server.name,server.url);
});


//Create Bot
const connector = new builder.ChatConnector({
    appId: 'd59f764d-b312-4a05-a1f4-2e93ed677de8',
    appPassword: 'S@l0Dzh---sIND))'
});
server.post('/api/messages', connector.listen());



const bot = new builder.UniversalBot(connector);

const luisModelUrl = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/52f75cd5-8b0d-46a2-9e9a-2cf78e0c8009?subscription-key=7c7149564c1547fda445fc15a2047b0a';

const recognizer = new builder.LuisRecognizer(luisModelUrl);

const intents = new builder.IntentDialog({
   recognizers: [recognizer]
});

bot.dialog('/', intents);

intents.matches('Greet', (session, args, next) => {
   session.send('Hello there! I am Car bot, your best car dealer in the web! How can I help you today?');
});

intents.matches('ShowCars', (session, args, next) => {
    session.beginDialog('startRecommendation');
});

intents.matches('support', (session,args,next) => {
   session.beginDialog('acceptRecommendation');
});

bot.dialog('startRecommendation', [
    (session, args, next) => {
        builder.Prompts.choice(session, 'Would you like a recommendation?', 'Yes|No', {listStyle: builder.ListStyle.button});
    },
    (session, results) => {
        session.userData.recommendationOption = results.response.entity;
        if (session.userData.recommendationOption === 'Yes'){
            session.beginDialog('acceptRecommendation');
        } else {
            session.beginDialog('sellCar');
        }
    },
    (session, results) => {
        console.log('Response:');
    }
]);

bot.dialog('acceptRecommendation', require('./src/chatbotDialog/recommendation'));
bot.dialog('sellCar',require('./src/chatbotDialog/sellCar'));