# EHR Application: Develop Guide

Welcome to the EHR Application project! This guide provides everything you need to set up your development environment, understand our workflow, and contribute high-quality code.

## 1. First-Time Setup

Follow these steps to get the project running on your local machine.

### 1.1. Prerequisites

  * [Node.js](https://nodejs.org/) (LTS version recommended)
  * [Git](https://git-scm.com/)

### 1.2. Fork and Clone the Repository

1.  Fork the repository to your own GitHub account.
2.  Clone your forked repository to your local machine:
    ```bash
    git clone https://github.com/YOUR_USERNAME/ehr-app.git
    cd ehr-app
    ```

### 1.3. Install Dependencies

This is a monorepo containing a `client` and `server` application. We will install dependencies for all three parts (root, client, and server).

```bash
# Install root-level dependencies (for hooks and tooling)
npm install

# Install server dependencies
cd server
npm install
cd ..

# Install client dependencies
cd client
npm install
cd ..
```

### 1.4. Configure Environment Variables

The backend server requires environment variables to run.

1.  Navigate to the `server` directory.
2.  Create a copy of the example environment file:
    ```bash
    cp .env.example .env
    ```
3.  Open the newly created `.env` file and fill in the required values (e.g., database connection string, JWT secret).

### 1.5. Final Setup: Git Hooks

Our project uses automated tools to ensure code quality and consistency. The final step of installation automatically enables these tools for you. After running `npm install` in the root directory, Git hooks managed by **Husky** are automatically configured. You don't need to do anything else\!

## 2\. Daily Workflow

### 2.1. Running the Application

You will need two separate terminal windows to run both the frontend and backend servers.

  * **To run the Backend Server:**

    ```bash
    cd server
    npm run dev
    ```

    The API will be available at `http://localhost:5001`.

  * **To run the Frontend Application:**

    ```bash
    cd client
    npm run dev
    ```

    The client will be available at `http://localhost:5173` (or the next available port).

### 2.2. Git Branching and Committing

1.  **Create a Feature Branch:** Always create a new branch for your work off the `main` branch.
    ```bash
    git checkout main
    git pull origin main
    git checkout -b your-branch-name
    ```
2.  **Code and Stage Changes:** Make your code changes and stage them using `git add`.
3.  **Commit Your Changes:** When you run `git commit`, our automated systems will kick in:
      * **`lint-staged`** will automatically format your staged code using Prettier.
      * **`commitlint`** will check your commit message to ensure it follows our conventions (see below). If it doesn't, the commit will be aborted until you fix the message.

## 3\. Commit Message Conventions

We use the **Conventional Commits** specification to keep our git history clean, readable, and easy to automate.

**Format:** `<type>(<scope>): <description>`

| Type         | Purpose                                                                |
| :----------- | :--------------------------------------------------------------------- |
| **feat** | A new feature for the user.                                            |
| **fix** | A bug fix for the user.                                                |
| **docs** | Changes to documentation only.                                         |
| **style** | Code style changes (formatting, etc).                                  |
| **refactor** | Code changes that neither fix a bug nor add a feature.                 |
| **perf** | A code change that improves performance.                               |
| **test** | Adding or correcting tests.                                            |
| **build** | Changes to the build system or dependencies (`package.json`, etc).     |
| **chore** | Other changes that don't modify source/test files (e.g., tooling).     |

**Examples:**

  * `feat(auth): add password reset functionality`
  * `fix(client): ensure patient list updates after deletion`
  * `docs: update API documentation for the patient endpoint`
  * `chore: upgrade testing library packages`

## 4\. Coding Standards & Tooling

To maintain code quality and a consistent style, we use the following tools, which are automatically enforced by our pre-commit hooks.

  * **Prettier:** An opinionated code formatter that ensures all code in the project follows the same style.
  * **ESLint:** A static analysis tool that finds potential bugs, anti-patterns, and logical errors in the code.

You should install the [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) and [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) extensions for your code editor for the best development experience.

## 5\. Testing Strategy

We employ a multi-layered testing strategy. Your contributions should include tests for any new or modified logic.

  * **Unit Tests (High Priority):** These test the smallest units of code (a single function or component) in isolation. They are fast and form the foundation of our test suite. Write these for all business logic.
  * **Integration Tests (High Priority):** These test how multiple units work together. For the backend, this means testing API endpoints to ensure they are wired correctly. For the frontend, this means testing how several components interact on a page.
  * **End-to-End (E2E) Tests (Medium Priority):** These test critical user journeys from start to finish (e.g., login, creating a patient). These are added for stable, high-value features.

**To run tests:**

```bash
# For the backend
cd server
npm test

# For the frontend
cd client
npm test
```

## 6\. Core Architectural Principles

### Backend: `app.ts` vs. `server.ts`

You will notice the backend has two main entry files. This separation is intentional:

  * `app.ts`: Creates and configures the Express application itself (middleware, routes, etc.). It knows nothing about the network.
  * `server.ts`: Imports the `app` and connects it to the network by listening on a port.

We do this to make **testing** much easier. Our integration tests can import the `app` object directly and test it in memory without needing to run a live server on a network port.