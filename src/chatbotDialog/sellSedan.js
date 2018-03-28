const builder = require('botbuilder');
const dbData = require('../api/dbData/dbData');

module.exports = [
    (session, args, next) => {
        dbData.getSedanModels().then((sedanResponse) => {
            let sportName = [];
            let cards = dbData.getModelsCard(sedanResponse, session);
            let reply = new builder.Message(session)
                .attachmentLayout(builder.AttachmentLayout.carousel)
                .attachments(cards);
            for (let i = 0; i < sedanResponse.length; i++){
                sportName.push(sedanResponse[i].carModel);
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