'use strict';
const fetch = require('node-fetch');
const AWS = require('aws-sdk');

const s3 = new AWS.S3();


async function getURIFromScryfall() {
  const cardUri = await fetch('https://api.scryfall.com/bulk-data').then(response => response.json()).then(data => data.data[0].permalink_uri)
  return cardUri
}

module.exports.getCardsFromCardUri = async (event) => {
  const url = await getURIFromScryfall()
    fetch(url)
      .then(r => r.json())
      .then(j => s3.putObject({ 
        Bucket: process.env.BUCKET,
        Key: event.key,
        Body: j,
      }).promise()
      )
      .then(v => callback(null, v), callback);

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  return { message: 'card dump obtained', event };
};

module.exports.writeCardsToDB = async (event) => {
  return { message: 'cards added to database', event };
}


