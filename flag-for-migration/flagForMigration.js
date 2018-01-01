var async = require('async');

exports.flagForMigration = (dynamodb, tableName, migrationAttributeName, itemKeys) => {
    return new Promise((resolve, reject) => {
        function shuffle(a) {
            var j, x, i;
            for (i = a.length - 1; i > 0; i--) {
                j = Math.floor(Math.random() * (i + 1));
                x = a[i];
                a[i] = a[j];
                a[j] = x;
            }
        }

        function updateItem(item, cb) {
            delete item['migrationFlag'];
            console.log(item);
            var params = {
                "Key": item,
                "TableName": tableName,
                "ExpressionAttributeNames": {
                    "#MF": migrationAttributeName
                },
                "ExpressionAttributeValues": {
                    ":t": { BOOL: true }
                },
                "UpdateExpression": "SET #MF = :t",
                "ReturnConsumedCapacity": "INDEXES"
            }

            dynamodb.updateItem(params, function(err, data) {
                if (err)
                    console.log('Error', params);
                if (!err)
                    itemKeys.splice(itemKeys.indexOf(item));
                cb(err, data);
            });
        }
        
        // Shuffle keys so we minimise hot partition keys
        shuffle(itemKeys);

        async.eachLimit(itemKeys, 2, updateItem, function(err) {
            if (err) {
                reject(err);
            }
            resolve();
        });
    });
}

