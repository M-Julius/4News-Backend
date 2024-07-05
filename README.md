# 4News Backend API

This is a full-featured API for managing news articles, categories, and users. The backend is built using Node.js, Express.js, Sequelize ORM, and MySQL database. The API supports CRUD operations and image uploads for news and user profiles.

## Table of Contents

- [4News Backend API](#4news-backend-api)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)

## Features

- User authentication (login and register)
- CRUD operations for news articles
- CRUD operations for categories
- CRUD operations for users
- Image uploads for news and user profiles

## Prerequisites

- Node.js
- npm/yarn
- MySQL database

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/M-Julius/4News-Backend.git
    cd 4News-Backend
    ```

2. Install dependencies:
    ```bash
    npm install
    ```
    or
    ```bash
    yarn install
    ```

3. Set up the database:
    ```bash
    npx sequelize-cli db:create
    npx sequelize-cli db:migrate
    ```

## Configuration

Change a `config.json` file in the config directory and add the following environment variables:

```config
{
    "username": "root",
    "password": null,
    "database": "dbname",
    "host": "127.0.0.1",
    "dialect": "mysql"
}
