## GitHub Actions Documentation

### 1. Continuous Integration: `ci.yml`

#### Purpose

- Run build, lint, test, and other checks on every push and pull request.
- Ensure code quality and that the application is in a deployable state.

#### Triggers

- Push to any branch.
- Pull requests to any branch.

#### Jobs

##### Build and Test

- Setup Node.js environment.
- Install dependencies.
- Run build script.
- Run linting.
- Execute tests.

#### Notes

- Adjust the Node.js version and the caching mechanism if needed.
- Ensure the relevant scripts are available in your `package.json`.

### 2. Continuous Deployment: `cd-dev.yml`, `cd-staging.yml`, `cd-prod.yml`

#### Purpose

- Automate the deployment process to different environments.
- Dev and Staging are automatically deployed on pushes to specific branches.
- Production deployment is manual, triggered by creating a GitHub Release.

#### Triggers

- **Dev**: Push to `dev` branch.
- **Staging**: Push to `staging` branch.
- **Production**: Creation of a new GitHub Release.

#### Jobs

##### Deploy

- Setup Node.js environment.
- Install dependencies.
- Run build script.
- Execute the deployment script using AWS CDK.

#### Secrets

- AWS Credentials and region are stored as GitHub Secrets.
- Secrets are environment-specific, e.g., `AWS_ACCESS_KEY_ID_DEV`, `AWS_SECRET_ACCESS_KEY_DEV`, `AWS_REGION_DEV`.

#### Notes

- Ensure that the AWS Credentials have the necessary permissions for deploying with AWS CDK.
- Production deployment requires creating a GitHub Release manually, which triggers the workflow.
