# Travel API

Node.js REST API using Express + MariaDB + Sequelize.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env`:

   ```env
   PORT=4000
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=travel_db
   DB_USER=root
   DB_PASS=your_password

   JWT_SECRET=super_secret_jwt_key
   JWT_EXPIRES_IN=7d
   ```

3. Run migrations:

   ```bash
   npx sequelize-cli db:migrate
   ```

4. Run Seed:

   ```bash
   npx sequelize-cli db:seed
   ```

5. Start dev server:

   ```bash
   npm run dev
   ```

## Main endpoints

- `POST /auth/login`
- `POST /users` (register)
- CRUD:
  - `/users`
  - `/hotels`
  - `/attractions`
  - `/tours`
  - `/bookings`
  - `/reviews`
  - `/favorites`
