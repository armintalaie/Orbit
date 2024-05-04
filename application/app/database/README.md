# Data Model for Orbit

The database migrations and schema lives inside the app logic but is run independently for seperation of concerns. This sub-directory handles all the neccessary database migrations and iterations.

## Setup

1. Similar to most Node environments, make sure you have `node` and `npm` installed.
   1. you can verify this by running `node -v` and `npm -v`
2. Install dependencies `npm install` (same as the setup for the main app)

## Modifying the Schema

the migrations are live inside the `src/migrations` folder. Intentionally named based on the UNIX ms timestamp. The `index.ts` schema will run all the migration SQL scripts in their alphanumeric order. Hence, critical to follow the current naming conventions.

## Running Migrations

1. Ensure you have followed the [setup](#setup) steps
2. Insert the following in your terminal

```bash
npm run build
npm run db:up
```

## Resources

For more information on best practices and how to work with postgres databases:

- [https://www.postgresql.org/](https://www.postgresql.org/)
- [https://www.postgresqltutorial.com/](https://www.postgresqltutorial.com/)
- [https://kysely.dev/](https://kysely.dev/)

## Appendix

1. Why do we use Kysely?

   - Kysely is a lightweight SQL query builder that is easy to use and understand. It is also typesafe and has a very low learning curve. It is also very easy to integrate with Typescript.
   - It allows us to write SQL queries in a more readable and maintainable way.
   - It also allows us to write raw SQL queries when needed.
