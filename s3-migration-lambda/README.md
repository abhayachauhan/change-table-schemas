# DynamoDB: Changing table schema

https://www.abhayachauhan.com/2018/01/dynamodb-changing-table-schema/

## Step 3 - Migration Lambda

This Lambda function should be associated to a DynamoDB Stream. It will take stream events, and push them to a new table.

On first execution, the function will cache the key schema for the desination table.

### Environment Variables:

destination: Name of the table to push the items to
