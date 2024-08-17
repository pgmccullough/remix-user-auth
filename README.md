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
