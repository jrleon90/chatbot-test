
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
const connector = new builder.ChatConnector();
server.post('/api/messages', connector.listen());



const bot = new builder.UniversalBot(connector);

const luisModelUrl = 'https://' + process.env.LUIS_App_HostName + '/luis/v2.0/apps/' + process.env.LUIS_App_Id + '?subscription-key=' + process.env.LUIS_App_Prod_Key;

const recognizer = new builder.LuisRecognizer(luisModelUrl);

const intents = new builder.IntentDialog({
   recognizers: [recognizer]
});

bot.dialog('/', intents);

intents.matches('Greet', (session, args, next) => {
   session.send('Hello there! I am Car bot, your best car dealer in the web! How can I help you today?');
});

let cars = [
  'Mercedes',
  'Audi',
  'BMW'
];

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