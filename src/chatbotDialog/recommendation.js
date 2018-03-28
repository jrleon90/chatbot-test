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
            builder.Prompts.choice(session, 'Do you have more than 4 Family members?','Yes|No',{listStyle: builder.ListStyle.button});
        }else{
            session.send('Personal vehicle');
            session.endDialog('Thanks!');
        }
    }
];