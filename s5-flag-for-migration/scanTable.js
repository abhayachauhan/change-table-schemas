exports.scanTable = (dynamodb, tableName, gsiIndexName, migrationAttributeName) => {
    var items = [];

    return new Promise((resolve, reject) => {

        function iterateTable(params) {
            var promise = dynamodb.scan(params).promise();
            
            promise
                .then(data => {
                    console.log('Received',data.Items.length,'items');
                    items = items.concat(data.Items);
                    if (data.LastEvaluatedKey) {
                        params.ExclusiveStartKey = data.LastEvaluatedKey;
                        iterateTable(params);
                    } else {
                        resolve(items);
                    }
                })
                .catch(err => {
                    console.log('ERROR:');
                    console.log(err);
                    iterateTable(params);
                });    
        }

        var params = {
            "TableName": tableName,
            "ReturnConsumedCapacity": "INDEXES"
        }
        if (gsiIndexName)
            params.IndexName = gsiIndexName;
        if (migrationAttributeName)
            params.FilterExpression = "attribute_not_exists(" + migrationAttributeName + ")";
    
        iterateTable(params);

    });
}