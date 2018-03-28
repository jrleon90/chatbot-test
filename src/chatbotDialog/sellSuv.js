const builder = require('botbuilder');
const dbData = require('../api/dbData/dbData');

module.exports = [
    (session, args, next) => {
        dbData.getSuvModels().then((suvResponse) => {
            let suvName = [];
            let cards = dbData.getModelsCard(suvResponse, session);
            let reply = new builder.Message(session)
                .attachmentLayout(builder.AttachmentLayout.carousel)
                .attachments(cards);
            for (let i = 0; i < suvResponse.length; i++){
                suvName.push(suvResponse[i].carModel);
            }
            builder.Prompts.choice(session,reply,suvName, {
                retryPrompt: new builder.Message(session)
                    .text('I\'m sorry, that option is not valid, please select another one')
                    .attachmentLayout(builder.AttachmentLayout.carousel)
                    .attachments(cards)
            });
        });
    },
    (session, results) => {
        session.userData.modelSelected = results.response.entity;
        session.endDialog('Thank you for buying a new: '+session.userData.modelSelected);
    }
];