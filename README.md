# Code Backend

This project is a Node.js backend built with AWS CDK and TypeScript. It is configured for deploying serverless applications and provides a foundation for building scalable and maintainable applications, with a focus on testability and development workflow.

## Features

- AWS CDK for Infrastructure as Code
- TypeScript for static typing
- Jest for testing
- GraphQL Codegen for generating TypeScript types from GraphQL schema
- ESLint and Prettier for code formatting and linting
- Commitlint for enforcing conventional commit messages
- Husky for managing git hooks

## Prerequisites

- Node.js 18.x
- AWS CLI
- AWS CDK CLI
- Docker for running integration tests with local resources

## Setup

1. **Clone the Repository:**

   ```sh
   git clone https://github.com/your-username/code-backend.git
   cd code-backend
   ```

2. **Install Dependencies:**

   ```sh
   npm install
   ```

3. **Bootstrap the CDK App:**
   ```sh
   npm run bootstrap
   ```

## Development

- **Build:** Compile the TypeScript code

  ```sh
  npm run build
  ```

- **Watch:** Watch for file changes and recompile

  ```sh
  npm run watch
  ```

- **Lint:** Run ESLint on the codebase

  ```sh
  npm run lint
  ```

- **Format:** Format the codebase with Prettier

  ```sh
  npm run prettier
  ```

- **Generate Types:** Generate TypeScript types from GraphQL schema
  ```sh
  npm run generate-types
  ```

## Testing

- **Unit Tests:** Run the Jest test suite

  ```sh
  npm test
  ```

- **Test Coverage:** Generate a test coverage report

  ```sh
  npm run test-coverage
  ```

- **Integration Tests:** Run integration tests with local resources
  ```sh
  npm run pretest:int
  npm run test:int
  ```

## Deployment

Deploy the application using AWS CDK...will be done through:

```sh
npm run deploy
```

After deploying, the `cdk-exports.json` file will be generated with the outputs of the deployed resources.

## License

This project is open-source and available under the [MIT License](LICENSE).
