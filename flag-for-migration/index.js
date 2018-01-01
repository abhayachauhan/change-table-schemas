var AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB();
var async = require('async');
var scan = require('./scanTable.js');
var migrate = require('./flagForMigration.js');

var tableName = "XXX"; // TABLE NAME HERE
var gsiName = "XXX"; // GSI NAME HERE
var migrationAttributeName = "migrationFlag"; // MIGRATION ATTRIBUTE HERE

startWork();

function startWork() {
    scan.scanTable(dynamodb, tableName, gsiName, migrationAttributeName)
        .then(itemKeys => {
            console.log('Finished scanning, found', itemKeys.length,'items.');
            
            migrate.flagForMigration(dynamodb, tableName, migrationAttributeName, itemKeys);
        });
}