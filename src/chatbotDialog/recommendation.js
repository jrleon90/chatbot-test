 const builder = require('botbuilder');

module.exports = [
    (session, args, next) => {
        session.send('Perfect! Please let me ask you a few questions in order to find you the best option');
        builder.Prompts.choice(session, 'How is the car that you need?','Familiar|Personal',{listStyle: builder.ListStyle.button,retryPrompt: 'Not valid'});
    },
    (session, results) => {
        session.userData.familyOption = results.response.entity;
        console.log('Family:'+session.userData.familyOption);
        if (session.userData.familyOption === 'Familiar') {
            session.replaceDialog('sellSuv');
        }else{
            builder.Prompts.choice(session, 'You want style or speed?','Style|Speed',{listStyle: builder.ListStyle.button,retryPrompt: 'Not valid'});
        }
    },
    (session, results) => {
        session.userData.personalOption = results.response.entity;
        if (session.userData.personalOption === 'Style'){
            session.replaceDialog('sellSedan');
        }else {
            session.replaceDialog('sellSport');
        }
    }
];

