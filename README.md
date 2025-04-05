# YouApp Backend

A fully-featured backend application built with NestJS, MongoDB, and WebSockets for a social/dating app with profiles and real-time chat functionality.

## Features

- **Authentication**: Complete JWT-based authentication system
- **User Profiles**: Create and manage detailed user profiles
- **Real-time Chat**: WebSocket-based messaging system
- **MongoDB Integration**: Schema-based data models with Mongoose
- **Validation**: Request validation using class-validator
- **Security**: JWT token authentication and password hashing

## Tech Stack

- **NestJS**: Progressive Node.js framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **Socket.io**: Real-time bidirectional event-based communication
- **Passport.js**: Authentication middleware
- **JWT**: JSON Web Tokens for secure authentication
- **Docker**: Containerization for easy deployment
- **TypeScript**: Type-safe JavaScript

## Project Structure

```
src/
├── auth/             # Authentication module
├── users/            # Users management
├── profiles/         # User profiles
├── chat/             # Real-time messaging
└── main.ts           # Application entry point
```

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- Docker and Docker Compose
- MongoDB (or use the Docker container)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

### Running the Application

#### Using Docker (Recommended)

Start the application and MongoDB with Docker Compose:

```bash
docker-compose up
```

The API will be available at http://localhost:3000.

#### Without Docker

1. Make sure MongoDB is running
2. Set environment variables:
   - `MONGODB_URI`: MongoDB connection string
   - `JWT_SECRET`: Secret key for JWT
   - `JWT_EXPIRATION`: Token expiration time

3. Start the application:

```bash
npm run start:dev
```

## API Endpoints

### Authentication

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login
- `GET /auth/me` - Get current user information

### Profiles

- `POST /profiles` - Create or update profile
- `GET /profiles/me` - Get current user's profile
- `PATCH /profiles/me` - Update current user's profile

### Chat

- `POST /chat/messages` - Send a new message
- `GET /chat/conversations/:userId` - Get conversation with specific user
- `GET /chat/unread-count` - Get count of unread messages

## WebSocket Events

The application uses Socket.io for real-time communication:

### Client to Server Events

- `join` - Join the chat with userId
- `send_message` - Send a message
- `mark_as_read` - Mark a message as read

### Server to Client Events

- `receive_message` - Receive a new message

## Running Tests

```bash
# Unit tests
npm run test

# Test coverage
npm run test:cov
```

## Development

### Code Formatting

```bash
npm run format
```

### Linting

```bash
npm run lint
```

## Deployment

The application is containerized and can be easily deployed to any environment that supports Docker.

For production deployment, use:

```bash
docker-compose -f docker-compose.prod.yml up -d
```

## License

This project is licensed under the ISC License.
