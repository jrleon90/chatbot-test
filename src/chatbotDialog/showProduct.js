
module.exports = {
    productRecommendation: (session, builder, bot) => {
        bot.dialog('startRecommendation', [
            (session, args, next) => {
                builder.Prompts.choice(session, 'Would you like a recommendation?', 'Yes|No', {listStyle: builder.ListStyle.button});
            },
            (session, results) => {
                session.userData.recommendationOption = results.response.entity;
                console.log('Recommendation: '+ session.userData.recommendationOption);
            }
        ]);
    },

};

