const request = require('request');
const builder = require('botbuilder');

let checkArray = (array,value,key) => {
  for(let i = 0; i < array.length; i++){
       if(array[i][key] === value){
           return true;
       }
  }
    return false;
};
module.exports={
  getBrands: () => {
      let brandPromise = new Promise((resolve, reject) => {
          let carBrands = [];
          request.get('https://my-json-server.typicode.com/jrleon90/chatbot-data/products', (error, response, body) => {
              let bodyObj = JSON.parse(body);
              for(let i = 0;i<bodyObj.length;i++){

                  if (!checkArray(carBrands,bodyObj[i].brand,'brandName')){
                      carBrands.push({
                          'brandName':bodyObj[i].brand,
                          'brandImage':bodyObj[i].brandImage
                      });
                  }
              }
              resolve(carBrands);
          });
      });
      return brandPromise;
  },

  getModelsByBrand: (brandName) => {
    let modelPromise = new Promise((resolve, reject) => {
       let carModels = [];
            request.get('https://my-json-server.typicode.com/jrleon90/chatbot-data/products', (error, response, body) => {
                let bodyObj = JSON.parse(body);
                for (let i = 0;i < bodyObj.length;i++ ){
                    if(!checkArray(carModels,bodyObj[i].model,'model')&&(bodyObj[i].brand === brandName)){
                        carModels.push({
                            'carBrand': brandName,
                            'carModel': bodyObj[i].model,
                            'carPrice': bodyObj[i].price,
                            'carImage': bodyObj[i].image
                        });
                    }
                }
                resolve(carModels);
            });
    });
    return modelPromise;
  },

  getBrandsCard: (brandArray, session) => {
      let cards = [];
        for (let i = 0;i < brandArray.length; i++) {
            let card = new builder.ThumbnailCard(session)
                .title(brandArray[i].brandName)
                .images([
                    builder.CardImage.create(session, brandArray[i].brandImage)
                ])
                .buttons([
                    builder.CardAction.imBack(session,brandArray[i].brandName,brandArray[i].brandName)
                ]);
            cards.push(card);
        }
        return cards;
  },

  getModelsCard: (modelArray, session) => {
      let cards = [];
      for (let i = 0;i < modelArray.length; i++){
        let card = new builder.ThumbnailCard(session)
            .title(modelArray[i].carModel)
            .subtitle('Price: USD' +modelArray[i].carPrice)
            .images([
                builder.CardImage.create(session, modelArray[i].carImage)
            ])
            .buttons([
                builder.CardAction.imBack(session,modelArray[i].carModel,modelArray[i].carModel)
            ]);
        cards.push(card);
      }
      return cards;
  }
};
