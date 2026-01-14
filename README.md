# Blog Post REST API

Simple RESTful API for managing blog posts.

## Setup

Clone the repository and install dependencies:

```bash
git clone https://github.com/katonsa/blog-rest-api.git
cd blog-rest-api
npm install
```

### Configuration

Create a `.env` file based on the example:

```bash
cp .env.example .env
```

Update `.env` with your database credentials:

```env
APP_PORT=3000
NODE_ENV=development

# Prisma
DATABASE_URL="mysql://username:password@localhost:3306/blog_rest_api"

# Database Connection
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=username
DATABASE_PASSWORD=password
DATABASE_NAME=blog_rest_api
```

### Database

Run migrations and generate the Prisma client:

```bash
npx prisma migrate dev
npx prisma generate
```

(Optional) Seed the database with sample data:

```bash
npx prisma db seed
```

## Running the Server

**Development**

```bash
npm run dev
```

**Production**

```bash
npm run build
npm start
```

Server runs on `http://localhost:3000` (or `http://localhost:{APP_PORT}`).

## Documentation

See [docs/api.md](docs/api.md) for API details.
