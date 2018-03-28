const builder = require('botbuilder');
const dbData = require('../api/dbData/dbData');


module.exports = [
    (session, args, next) => {
        session.send('All right, please select the model of the vehicle that you want');
        dbData.getBrands().then((brandResponse) => {
            let brandNames = [];
            let cards = dbData.getBrandsCard(brandResponse, session);
            let reply = new builder.Message(session)
                .attachmentLayout(builder.AttachmentLayout.carousel)
                .attachments(cards);
            for (let i = 0;i<brandResponse.length;i++){
                brandNames.push(brandResponse[i].brandName);
            }

            builder.Prompts.choice(session, reply, brandNames, {
                retryPrompt: reply
            });
        });
    },
    (session, results) => {
        session.userData.brandSelected = results.response.entity;
        dbData.getModelsByBrand(session.userData.brandSelected).then((modelResponse) => {
            let carNames = [];
            let cards = dbData.getModelsCard(modelResponse, session);
            let reply = new builder.Message(session)
                .attachmentLayout(builder.AttachmentLayout.carousel)
                .attachments(cards);
            for (let i = 0; i < modelResponse.length; i++){
                carNames.push(modelResponse[i].carModel);
            }
            builder.Prompts.choice(session,reply,carNames, {
                retryPrompt: new builder.Message(session)
                    .text('I\'m sorry, that option is not valid, please select another one')
                    .attachmentLayout(builder.AttachmentLayout.carousel)
                    .attachments(cards)
            });
        });
    },
    (session, results) => {
        session.userData.modelSelected = results.response.entity;
        session.endDialog('Thank you for buying a new: '+session.userData.brandSelected+' '+session.userData.modelSelected);
    }
];