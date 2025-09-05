#!/bin/bash
set -e

echo "Initializing S3 buckets..."

# Set AWS CLI configuration for LocalStack
export AWS_ACCESS_KEY_ID=test
export AWS_SECRET_ACCESS_KEY=test
export AWS_DEFAULT_REGION=us-east-1

# Create S3 buckets with error handling
awslocal s3 mb s3://attachments-bucket 2>/dev/null || echo "Bucket 'attachments-bucket' already exists"

# Set bucket policies (optional - make buckets publicly readable for development)
echo "Setting bucket policy for attachments-bucket..."
awslocal s3api put-bucket-policy --bucket attachments-bucket --policy '{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::attachments-bucket/*"
        }
    ]
}' 2>/dev/null || echo "Failed to set policy for attachments-bucket"

# Enable bucket versioning (optional)
echo "Enabling versioning for buckets..."
awslocal s3api put-bucket-versioning --bucket attachments-bucket --versioning-configuration Status=Enabled 2>/dev/null || echo "Failed to enable versioning for attachments-bucket"

# List created buckets
echo "Created S3 buckets:"
awslocal s3 ls

echo "S3 initialization completed!"