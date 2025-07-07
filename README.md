# Project Mark KBS

A dynamic knowledge base API for managing interconnected topics and resources with version control.

## Technologies Used

- **Node.js**
- **TypeScript**
- **Express**
- **Swagger (swagger-jsdoc, swagger-ui-express)**
- **Jest** (testing)
- **ESLint** (linting)
- **Husky** (git hooks)
- **Zod** (validation)
- **JWT** (authentication)
- **UUID** (unique IDs)
- **CORS**
- **Body-Parser**

## Project Structure

- `src/` - Source code (routes, controllers, models, config, middlewares)
- `tests/` - Test files
- `.env` - Environment variables
- `package.json` - Project metadata and scripts
- `tsconfig.json` - TypeScript configuration

## Configuration

1. Copy the `.env` file and set the required environment variables. Example:

   ```sh
   cp .env.example .env
   # Edit .env as needed
   ```

2. Common variables:
   - `PORT` (default: 3000)
   - Any database or JWT secret keys as required by your implementation

## Installation

1. Install dependencies:
   ```sh
   npm install
   ```

## Running the Project

- **Development mode (with hot reload):**
  ```sh
  npm run dev
  ```
- **Production build:**
  ```sh
  npm run build
  npm start
  ```

## Testing

Run all tests using Jest:
```sh
npm test
```

## Linting

Automatically fix lint issues:
```sh
npm run lint
```

## Accessing Swagger API Docs

Once the server is running, open your browser and navigate to:

```
http://localhost:3000/swagger
```

This will display the interactive Swagger UI for exploring and testing the API endpoints.

## Additional Notes

- Husky is set up for git hooks to enforce code quality.
- The project uses TypeScript for type safety and maintainability.
- For any issues, check the logs or ensure your environment variables are set correctly.
