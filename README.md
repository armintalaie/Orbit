# Orbit

A simple, intuitive, and beautiful way to manage your projects. Similar to Linear, Asana, and Trello.

## How it works

- This is a web application that allows users to create projects and tasks.
- The backend is a GraphQL API built with the Bun runtime and express.
- Frontend is a Next.js application that uses Apollo Client to interact with the API.
- The database is a PostgreSQL database hosted on Supabase.

## Features

- Workspaces: Encapsulated area for people to track members, projects, and tasks.
- Teams: Groups of people that work together on projects. They can have their own workflows and permissions.
- Projects: A collection of tasks that need to be completed. They can be assigned to teams or individuals.
- Tasks: A unit of work that needs to be completed. They can be assigned to teams or individuals.

- User Management: Users can create an account, login, and logout. Admins can manage users and their permissions.
- Advanced querying: Users can filter, sort, and paginate projects and tasks.
- Real-time updates: Users can see updates in real-time when other users create, update, or delete projects and tasks.


## Setup

You need to have the following installed on your machine:

- Node.js - Check the [official website](https://nodejs.org/) for instructions on how to install it.
- Bun - Check the [Bun documentation](https://bun.sh/) for instructions on how to install it.


1. Clone the repository
2. Setup the backend
    2.1. Install the dependencies in the `backend` directory
    ```bash
        bun install
    ```
    2.2. Create a `.env` file in the `backend` directory and add the following environment variables
    ```bash
        DATABASE_URL=postgres://username:password@localhost:5432/orbit
        SUPABASE_URL=https://<supabase-url>.supabase.co
        SUPABASE_KEY=<supabase-key>
    ```
    2.3. Run the backend
    ```bash
        bun run dev
    ```
3. Setup the frontend
    3.1. Install the dependencies in the `application` directory
    ```bash
        bun install
    ```
    3.2. Create a `.env.local` file in the `application` directory and add the following environment variables
    ```bash
        NEXT_PUBLIC_API_URL=http://localhost:4000/graphql
    ```
    3.3. Run the frontend
    ```bash
        bun run dev
    ```
4. Open your browser and go to `http://localhost:3000` to see the application

Note: The frontend and backend need to be running at the same time for the application to work.


