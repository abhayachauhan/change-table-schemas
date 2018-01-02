var AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB();
var newTableName = process.env.destination;

exports.handler = (event, context, callback) => {
    var promises = [];

    event.Records.forEach(function(record) {
      if (record.eventName === "REMOVE") {
          var params = {
            Key: record.dynamodb.Keys,
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
