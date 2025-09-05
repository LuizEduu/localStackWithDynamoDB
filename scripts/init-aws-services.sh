#!/bin/bash
set -e

echo "Starting AWS services initialization..."

# Set AWS CLI configuration for LocalStack
export AWS_ACCESS_KEY_ID=test
export AWS_SECRET_ACCESS_KEY=test
export AWS_DEFAULT_REGION=us-east-1

echo "Waiting for LocalStack to be ready..."
sleep 10

# Execute DynamoDB initialization
echo "=== Initializing DynamoDB ==="
/etc/localstack/init/ready.d/init-dynamodb.sh

# Execute S3 initialization
echo "=== Initializing S3 ==="
/etc/localstack/init/ready.d/init-s3.sh

echo "=== AWS services initialization completed! ==="

# List all resources for verification
echo "=== Verification ==="
echo "DynamoDB Tables:"
awslocal dynamodb list-tables --query "TableNames[]" --output table

echo "S3 Buckets:"
awslocal s3 ls

echo "=== All AWS services are ready! ==="