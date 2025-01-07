## Project setup

```bash
pnpm install
```

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Deployment

### Documentation for CI/CD Workflow

This document explains the CI/CD pipeline implemented using GitHub Actions. The workflow automates building, testing, and deploying a Node.js application to Heroku using Docker.

#### Jobs

1. Build

```yaml
    Runs On: ubuntu-latest
    Steps:

        Checkout Repository:
        Checks out the repository code to the GitHub runner.

        - uses: actions/checkout@v4
```

Set Up Node.js:
Sets up Node.js version 22.11 for the project.

```yaml
- name: Set up Node.js
  uses: actions/setup-node@v3
  with:
    node-version: '22.11'
```

Install pnpm:
Installs the pnpm package manager globally.

```yaml
- name: Install pnpm
  run: npm install -g pnpm
```

Install Dependencies:
Installs project dependencies using pnpm.

```yaml
- name: Install dependencies
  run: pnpm install
```

Build Project:
Builds the application using pnpm.

```yaml
- name: Build the project
  run: pnpm run build
```

Run Tests:
Executes tests while injecting sensitive environment variables as secrets.

```yaml
        - name: Run tests
          env:
            MONGODB_HOST: ${{ secrets.MONGODB_HOST }}
            JWT_SECRET: ${{ secrets.JWT_SECRET }}
            JWT_EXPIRATION: ${{ secrets.JWT_EXPIRATION }}
          run: pnpm test
```

#### 2. Deploy

This section handles deploying the application to Heroku using Docker.

    Log in to Heroku Docker Registry:
    Logs into the Heroku Docker registry using the HEROKU_API_KEY secret.

```yaml
- name: Log in to Docker Hub
  run: docker login --username=_ --password=${{ secrets.HEROKU_API_KEY }} registry.heroku.com
```

Stop Previous Heroku Container:
Stops the currently running container in the Heroku app (if any).

```yaml
- name: Stop previous Heroku container
  run: |
    heroku ps:stop web --app ${{ secrets.HEROKU_APP_NAME }}
  env:
    HEROKU_API_KEY: ${{ secrets.HEROKU_API_KEY }}
```

Build Docker Image:
Builds a Docker image for the application, passing required secrets as build arguments.

```yaml
- name: Build Docker image
  run: docker build --build-arg MONGODB_HOST_ARG=${{ secrets.MONGODB_HOST }} --build-arg JWT_SECRET_ARG=${{ secrets.JWT_SECRET }} --build-arg JWT_EXPIRATION_ARG=${{ secrets.JWT_EXPIRATION }} -t registry.heroku.com/${{ secrets.HEROKU_APP_NAME }}/web .
```

Push Docker Image:
Pushes the Docker image to Heroku's container registry.

```yaml
- name: Push Docker image to Heroku
  run: docker push registry.heroku.com/${{ secrets.HEROKU_APP_NAME }}/web
```

Set Heroku Stack to Container:
Ensures the Heroku app's stack is configured for container deployment.

```yaml
- name: Set Heroku stack to container
  run: heroku stack:set container --app ${{ secrets.HEROKU_APP_NAME }}
  env:
    HEROKU_API_KEY: ${{ secrets.HEROKU_API_KEY }}
```

Release on Heroku:
Releases the newly pushed Docker image to Heroku.

```yaml
    - name: Release on Heroku
      run: |
        heroku container:release web --app ${{ secrets.HEROKU_APP_NAME }}
      env:
        HEROKU_API_KEY: ${{ secrets.HEROKU_API_KEY }}
```

Secrets

The following secrets are required for the pipeline:

```yaml
    MONGODB_HOST: MongoDB host URI.
    JWT_SECRET: Secret key for JWT authentication.
    JWT_EXPIRATION: JWT expiration time.
    HEROKU_API_KEY: Heroku API key for authentication.
    HEROKU_APP_NAME: Name of the Heroku app for deployment.
```

Key Points

    Node.js Version: The pipeline uses Node.js version 22.11.
    Build Tool: The project is built using pnpm.
    Testing: Secrets are securely passed as environment variables during test execution.
    Deployment: The application is containerized with Docker and deployed to Heroku.
    Manual Execution: The workflow can be triggered manually for flexibility.

Usage

    Push changes or open a pull request on the main branch to trigger the pipeline.
    View pipeline results in the GitHub Actions tab.
    Ensure required secrets are set in the repository's settings under Secrets and variables > Actions.

## Bash script

This bash script automates the process of building a Docker image for a Node.js application, stopping any existing containers, and running the new Docker container with the necessary configurations.
Purpose

The script builds a Docker image for the application, stops and removes any previously running container, and starts a new container from the freshly built image. It also passes sensitive environment variables (MongoDB host, JWT secret, and expiration) during the build process

Script Breakdown

```bash
    Set Error Handling (set -e)
```

The script begins by enabling strict error handling. If any command fails, the script will stop execution immediately, ensuring that errors are caught early.

```bash
set -e
```

Build Docker Image

The script builds a Docker image using the docker build command. It uses the following build arguments:

```bash
MONGODB_HOST_ARG: "The MongoDB host URL".
JWT_SECRET_ARG: "The JWT secret key".
JWT_EXPIRATION_ARG: "The JWT expiration time".
```

The image is tagged with <b>assessment</b>: A local tag for running the container.

```bash
docker build --build-arg MONGODB_HOST_ARG=$MONGODB_HOST JWT_SECRET_ARG=$JWT_SECRET --build-arg JWT_EXPIRATION_ARG=$JWT_EXPIRATION -t registry.heroku.com/$HEROKU_APP_NAME -t assessment .
```

Stop and Remove Existing Containers

Before running a new container, the script ensures that any existing container with the name assessment is stopped and removed. This step prevents potential conflicts with containers from previous runs.

```bash
docker stop assessment || true
docker rm assessment || true
```

Run Docker Container

Finally, the script runs a new Docker container from the image built earlier. The container is named assessment, and it is run in detached mode (-d) with the following port mappings:

```bash
    docker run -d --name assessment -p 3000:3000 assessment
```

Environment Variables

The script expects the following environment variables to be set before execution:

```bash
    MONGODB_HOST: "MongoDB host URL used for database connection".
    JWT_SECRET: "The secret key used for signing(JWT)".
    JWT_EXPIRATION: "The expiration time for the JWTs".
    HEROKU_APP_NAME: "The name of the Heroku app".
```

#### Usage

Set Environment Variables: Ensure the environment variables are set before running the script:

```bash
export MONGODB_HOST="your_mongodb_host"
export JWT_SECRET="your_jwt_secret"
export JWT_EXPIRATION="1h"
export HEROKU_APP_NAME="your_heroku_app_name"
```

Run the Script: Execute the script from the terminal:

Make it executable:
```bash
chmod +x run.sh
```
then run
```bash
    ./run.sh
```

Access the Application: After the container is up and running, the application will be accessible at <http://localhost:3000> on your machine.

