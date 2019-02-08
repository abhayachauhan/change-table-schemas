# DynamoDB: Change Table Schemas
A tool to help migrate tables in DynamoDB

## Steps to follow


1. Create a new table (let us call this NewTable), with the desired key structure, LSIs, GSIs.
2. Enable DynamoDB Streams on the original table
3. Associate a Lambda to the Stream, which pushes the record into NewTable. (This Lambda should trim off the migration flag in Step 5)
4. [*Optional*] Create a GSI on the original table to speed up scanning items. Ensure this GSI only has attributes: Primary Key, and Migrated (See Step 5).
5. Scan the GSI created in the previous step (or entire table) and use the following Filter:

    FilterExpression = "attribute_not_exists(Migrated)"

    Update each item in the table with a migrate flag (ie: “Migrated”: { “S”: “0” }, which sends it to the DynamoDB Streams (using UpdateItem API, to ensure no data loss occurs).

    **NOTE** You may want to increase write capacity units on the table during the updates.
6. The Lambda will pick up all items, trim off the Migrated flag and push it into NewTable.
7. Once all items have been migrated, repoint the code to the new table
8. Remove original table, and Lambda function once happy all is good.

## More information

https://www.abhayachauhan.com/2018/01/dynamodb-changing-table-schema/
