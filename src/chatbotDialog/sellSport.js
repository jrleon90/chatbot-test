const builder = require('botbuilder');
const dbData = require('../api/dbData/dbData');

module.exports = [
    (session, args, next) => {
        dbData.getSportModels().then((sportResponse) => {
            let sportName = [];
            let cards = dbData.getModelsCard(sportResponse, session);
            let reply = new builder.Message(session)
                .attachmentLayout(builder.AttachmentLayout.carousel)
                .attachments(cards);
            for (let i = 0; i < sportResponse.length; i++){
                sportName.push(sportResponse[i].carModel);
            }
            builder.Prompts.choice(session,reply,sportName, {
                retryPrompt: reply
            });
        });
    },
    (session, results) => {
        session.userData.modelSelected = results.response.entity;
        session.endDialog('Thank you for buying a new: '+session.userData.modelSelected);
    }
];