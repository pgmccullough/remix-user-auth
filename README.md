# Project Setup Guide

This guide explains how to set up PostgreSQL and pgAdmin using Docker Compose with environment variables. Follow these steps to configure your development environment.

## Prerequisites

- Docker installed on your system
- Docker Compose installed on your system

## Environment Variables

Create a `.env` file in your project root directory to store environment variables. Use the existing `.env.example` as a template.

## Starting the Services

To start the services, run the following command:

```bash
docker-compose up -d
```

## Accessing pgAdmin

1. Open your web browser and go to [http://localhost:8080](http://localhost:8080).
2. Log in with the email and password defined in your `.env` file.

## Connecting pgAdmin to PostgreSQL

1. Open pgAdmin and create a new server connection.
2. Set the hostname to `db` (the name of the PostgreSQL service in `docker-compose.yml`).
3. Use username and password defined in your `.env` file.

## Initializing Database with Prisma

1. Run the following command to generate the Prisma Client based on your schema: `npx prisma generate`
2. Create a migration based on your schema by running: `npx prisma migrate dev --name init`
3. Apply the migration to your database: `npx prisma migrate deploy`


