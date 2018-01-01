# DynamoDB: Changing table schema

https://www.abhayachauhan.com/2018/01/dynamodb-changing-table-schema/

## Step 5 - Flag for Migration

1. Populate variables on Line 7 - 9 in index.js:

var tableName = "XXX"; // TABLE NAME HERE
var gsiName = "XXX"; // GSI NAME HERE
var migrationAttributeName = "migrationFlag"; // MIGRATION ATTRIBUTE HERE

2. Execute index.js
