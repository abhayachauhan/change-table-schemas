var AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB();
var newTableName = process.env.destination;
var keySchema = [];

exports.handler = (event, context, callback) => {
  if (keySchema.length) {
    pushItems(event, context, callback);
  }
  else 
  {
    dynamodb.describeTable({ TableName: newTableName }, (err, data) => {
      if (err)
        return callback(err);
        
      console.log('Describing table');
      data.Table.KeySchema.forEach((key) => {
        keySchema.push(key.AttributeName);
      });
      pushItems(event, context, callback);
    });
  }
}

function pushItems (event, context, callback) {
    var promises = [];
    event.Records.forEach(function(record) {

      if (record.eventName === "REMOVE") {
        
          var keyParams = {};
          keySchema.forEach((key) => {
            keyParams[key] = record.dynamodb.OldImage[key];
          });
          var params = {
            Key: keyParams,
            TableName: newTableName
          };

          promises.push(
            dynamodb.deleteItem(params).promise()
          );

        }
      else {
        var params = {
            Item: record.dynamodb.NewImage,
            TableName: newTableName
          };

          promises.push(
            dynamodb.putItem(params).promise()
          );
      }
      
    });

    Promise.all(promises)
      .then(() => callback())
      .catch((err) => callback(err));
};
