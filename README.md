# Project Setup Guide

This guide explains how to set up PostgreSQL and pgAdmin using Docker Compose with environment variables. Follow these steps to configure your development environment.

## Prerequisites

- Docker installed on your system
- Docker Compose installed on your system

## Environment Variables

Create a `.env` file in your project root directory to store environment variables. Use the existing `.env.example` as a template.

Check which `DATABASE_URL` is commented out. There is one for Windows / Mac
and another for Linux. Comment / Uncomment the appropriate one for your system.

## Starting the Services

To start the services, run the following command:

```bash
docker-compose up -d
```

## Initializing Database with Prisma

1. Run the following command to generate the Prisma Client based on your schema: `npx prisma generate`
2. Create a migration based on your schema by running: `npx prisma migrate dev --name init`
3. Apply the migration to your database: `npx prisma migrate deploy`

## Uploads

This application uses Amazon Web Services (AWS) for user uploads and storage via their S3 buckets. To work with this in development, a tool called [LocalStack](https://www.localstack.cloud/) is used to mimic AWS locally. This means the local machine and user do not need to set up AWS services or permissions until ready for deployment.

In order to use LocalStack, it is necessary to:

1. Install the [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html).
2. Run `aws configure` from a command line, and complete the prompt as follows:
    ```
    - AWS Access Key ID [None]: `test`
    - AWS Secret Access Key [None]: `test`
    - Default region name [None]: `us-east-1`
    - Default output format [None]: 
    ```
3. Create a new bucket by running `npm run s3_create <whatever_you_want_to_call_your_bucket>`;