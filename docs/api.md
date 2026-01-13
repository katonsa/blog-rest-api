## API Reference

### Base URL

```
http://localhost:3000
```

### Endpoints Overview

| Method | Endpoint     | Description             |
| ------ | ------------ | ----------------------- |
| GET    | `/posts`     | List all posts          |
| GET    | `/posts/:id` | Get a specific post     |
| POST   | `/posts`     | Create a new post       |
| PUT    | `/posts/:id` | Update an existing post |
| DELETE | `/posts/:id` | Delete a post           |

---

### GET /posts

Returns a paginated list of blog posts.

**Query Parameters**

| Parameter | Type   | Default | Description               |
| --------- | ------ | ------- | ------------------------- |
| `page`    | number | 1       | Page number               |
| `limit`   | number | 10      | Items per page (max: 100) |

**Example Request**

```bash
# Standard request
curl -X GET http://localhost:3000/posts

# With pagination
curl -X GET "http://localhost:3000/posts?page=1&limit=5"
```

**Success Response**

```json
{
  "data": [
    {
      "id": 1,
      "title": "My First Post",
      "content": "This is the content of my first post.",
      "createdAt": "2026-01-14T10:00:00.000Z",
      "updatedAt": "2026-01-14T10:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

---

### GET /posts/:id

Fetches a single post by its unique ID.

**Example Request**

```bash
curl -X GET http://localhost:3000/posts/1
```

**Success Response**

```json
{
  "id": 1,
  "title": "My First Post",
  "content": "This is the content of my first post.",
  "createdAt": "2026-01-14T10:00:00.000Z",
  "updatedAt": "2026-01-14T10:00:00.000Z"
}
```

**Error Response (404)**

```json
{
  "message": "Post not found",
  "code": "ERR_NOT_FOUND"
}
```

---

### POST /posts

Creates a new blog post.

**Request Body**

| Field     | Type   | Required | Description                |
| --------- | ------ | -------- | -------------------------- |
| `title`   | string | Yes      | Post title (max 255 chars) |
| `content` | string | Yes      | Post content               |

**Example Request**

```bash
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My New Post",
    "content": "This is the content of my new blog post."
  }'
```

**Success Response (201)**

```json
{
  "id": 2,
  "title": "My New Post",
  "content": "This is the content of my new blog post.",
  "createdAt": "2026-01-14T10:30:00.000Z",
  "updatedAt": "2026-01-14T10:30:00.000Z"
}
```

**Validation Error (422)**

```json
{
  "message": "Validation failed",
  "code": "ERR_VALIDATION",
  "errors": [
    {
      "code": "too_small",
      "minimum": 1,
      "type": "string",
      "inclusive": true,
      "exact": false,
      "message": "Title is required",
      "path": ["title"]
    }
  ]
}
```

---

### PUT /posts/:id

Updates the content or title of an existing post.

**Request Body**

| Field     | Type   | Required | Description                |
| --------- | ------ | -------- | -------------------------- |
| `title`   | string | No       | Post title (max 255 chars) |
| `content` | string | No       | Post content               |

> Note: You must provide at least one field (`title` or `content`).

**Example Request**

```bash
curl -X PUT http://localhost:3000/posts/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Post Title",
    "content": "This is the updated content."
  }'
```

**Success Response**

```json
{
  "id": 1,
  "title": "Updated Post Title",
  "content": "This is the updated content.",
  "createdAt": "2026-01-14T10:00:00.000Z",
  "updatedAt": "2026-01-14T11:00:00.000Z"
}
```

**Error Response (404)**

```json
{
  "message": "Resource not found",
  "code": "ERR_NOT_FOUND"
}
```

**Error Response (422)**

```json
{
  "message": "At least one field is required",
  "code": "ERR_UNPROCESSABLE_ENTITY"
}
```

---

### DELETE /posts/:id

Permanently removes a post.

**Example Request**

```bash
curl -X DELETE http://localhost:3000/posts/1
```

**Success Response (204)**

Empty response body.

**Error Response (404)**

```json
{
  "message": "Resource not found",
  "code": "ERR_NOT_FOUND"
}
```

## Error Reference

| HTTP Status | Code                       | Description                  |
| ----------- | -------------------------- | ---------------------------- |
| 400         | `ERR_INVALID_JSON`         | Invalid JSON in request body |
| 400         | `ERR_VALIDATION`           | Prisma validation error      |
| 404         | `ERR_NOT_FOUND`            | Resource not found           |
| 409         | `ERR_CONFLICT`             | Resource already exists      |
| 422         | `ERR_VALIDATION`           | Input validation failed      |
| 422         | `ERR_UNPROCESSABLE_ENTITY` | Missing required fields      |
| 500         | `ERR_INTERNAL_ERROR`       | Internal server error        |
