# Project Mark KBS

A dynamic and robust knowledge base system (KBS) API designed for managing users, topics, and resources efficiently. This project is built with a modern tech stack, including Node.js, Express, and TypeScript, ensuring type safety and scalability. It features a clean, domain-driven architecture to separate business logic and promote maintainability.

## Features

- **User Management**: Secure user registration and authentication using JSON Web Tokens (JWT).
- **Topic Management**: Full CRUD (Create, Read, Update, Delete) operations for knowledge topics.
- **Resource Management**: Full CRUD operations for resources, which can be linked to various topics.
- **API Documentation**: Interactive API documentation powered by Swagger, available at the `/swagger` endpoint.
- **Validation**: Robust request data validation using Zod.
- **Code Quality**: Enforced code style and quality with ESLint and Husky git hooks.

## Technologies Used

- **Backend**: Node.js, Express, TypeScript
- **Authentication**: JSON Web Token (jsonwebtoken)
- **Validation**: Zod
- **API Documentation**: Swagger (swagger-jsdoc, swagger-ui-express)
- **Testing**: Jest, ts-jest
- **Linting**: ESLint
- **Dev Tools**: ts-node-dev, Husky

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [NPM](https://www.npmjs.com/)

## Installation

1. Clone the repository:
   ```sh
   git clone <repository-url>
   cd project-mark-kbs
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

## Configuration

1. Create a `.env` file in the root directory. You can copy the `.env.example` if it exists:
   ```sh
   cp .env.example .env
   ```

2. Add the necessary environment variables to your `.env` file:
   ```
   PORT=3000
   JWT_SECRET=your_super_secret_key
   ```

## Running the Project

- **Development mode (with hot-reloading):**
  ```sh
  npm run dev
  ```

- **Production mode:**
  ```sh
  npm run build
  npm start
  ```

The server will start on the port defined in your `.env` file (default: 3000).

## API Documentation

Once the server is running, you can access the interactive Swagger API documentation in your browser at:

[http://localhost:3000/swagger](http://localhost:3000/swagger)

## Testing and Linting

- **Run all tests:**
  ```sh
  npm test
  ```

- **Lint and automatically fix issues:**
  ```sh
  npm run lint
  ```

## Project Structure

The project follows a domain-driven structure to ensure separation of concerns:

```
src/
├── abstracts/      # Abstract classes and interfaces
├── app.ts          # Express app setup and main entry point
├── config/         # Application configuration
├── domain/         # Core business logic
│   ├── resource/   # Resource entity, use-cases, controller, etc.
│   ├── topic/      # Topic entity, use-cases, controller, etc.
│   └── user/       # User entity, use-cases, controller, etc.
├── middlewares/    # Custom Express middlewares (e.g., auth)
└── utils/          # Utility functions
```
