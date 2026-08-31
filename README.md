# Skill Drill Admin Dashboard

A modern web admin dashboard built with Svelte for managing the Skill Drill platform.

## Features

- 🔐 **Admin Authentication** - Secure login system with JWT tokens
- 👥 **User Management** - Create, read, update, and delete users
- 📚 **Topic Management** - Manage study topics and categories
- ❓ **Generate Questions** - AI-powered question generation from PDF documents
- 📊 **Responsive Design** - Mobile-friendly UI with sidebar navigation
- 🎨 **Clean Interface** - Modern, intuitive user interface

## Installation

### Prerequisites

- Node.js 16+ and npm/yarn
- Running Skill Drill API server (Go backend)

### Setup

1. Clone the repository (if not already done):

```bash
cd admin
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file from `.env.example`:

```bash
cp .env.example .env
```

4. Configure your API endpoint in `.env`:

```env
VITE_API_URL=http://localhost:8080/api
```

## Development

Start the development server:

```bash
npm run dev
```

The admin dashboard will be available at `http://localhost:5173`

## Building for Production

Build the project:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Project Structure

```
admin/
├── src/
│   ├── api/
│   │   └── client.ts          # API client with axios
│   ├── components/
│   │   ├── Layout.svelte      # Main layout component
│   │   ├── Sidebar.svelte     # Navigation sidebar
│   │   ├── Table.svelte       # Reusable table component
│   │   ├── UserForm.svelte    # User form modal
│   │   └── TopicForm.svelte   # Topic form modal
│   ├── pages/
│   │   ├── Dashboard.svelte   # Dashboard page
│   │   ├── Login.svelte       # Login page
│   │   ├── Users.svelte       # Users management page
│   │   ├── Topics.svelte      # Topics management page
│   │   └── GenerateQuestions.svelte  # Question generation page
│   ├── stores/
│   │   ├── auth.ts            # Authentication store
│   │   └── router.ts          # Router store
│   ├── utils/
│   │   ├── helpers.ts         # Utility functions
│   │   └── router.ts          # Router utilities
│   ├── App.svelte             # Root component
│   ├── app.css                # Global styles
│   └── main.ts                # Entry point
├── index.html                 # HTML template
├── tsconfig.json              # TypeScript configuration
├── vite.config.ts             # Vite configuration
├── svelte.config.js           # Svelte configuration
├── package.json               # Dependencies
└── README.md                  # This file
```

## Usage

### Login

1. Navigate to the dashboard
2. Enter your admin credentials (email and password)
3. Click "Login"

### Users Management

1. Go to **Users** section
2. View all users in the table
3. Click **Edit** to modify a user
4. Click **Delete** to remove a user
5. Click **+ Add New User** to create a new user

### Topics Management

1. Go to **Topics** section
2. View all study topics
3. Click **Edit** to modify a topic
4. Click **Delete** to remove a topic
5. Click **+ Add New Topic** to create a new topic

### Generate Questions

1. Go to **Generate Questions** section
2. Select a topic from the dropdown
3. Specify the number of questions (1-50)
4. Optionally upload a PDF file (max 10MB)
5. Click **Generate Questions**
6. View the generated questions with options and answers

## API Integration

The admin dashboard connects to the Skill Drill backend API with the following endpoints:

### Authentication

- `POST /api/auth/login` - Login with email and password
- `POST /api/auth/logout` - Logout user

### Users (Admin Only)

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Topics (Admin Only)

- `GET /api/topics` - Get all topics
- `GET /api/topics/:id` - Get topic by ID
- `POST /api/topics` - Create new topic
- `PUT /api/topics/:id` - Update topic
- `DELETE /api/topics/:id` - Delete topic

### Questions (Admin Only)

- `POST /api/admin/generate-questions` - Generate questions from PDF

## Authentication

The app uses JWT tokens stored in localStorage for authentication:

- Tokens are automatically sent with every API request
- If a token expires (401 response), the user is redirected to login
- User information is stored in localStorage for session persistence

## Styling

The dashboard uses CSS custom properties (variables) for theming:

```css
--primary: #3366cc; /* Primary blue color */
--secondary: #8899dd; /* Secondary blue color */
--danger: #dd3333; /* Red for delete actions */
--success: #33aa33; /* Green for success messages */
--warning: #ffaa00; /* Orange for warnings */
--text: #333333; /* Text color */
--bg: #f5f5f5; /* Background color */
--border: #dddddd; /* Border color */
--radius: 8px; /* Border radius */
--shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* Box shadow */
```

## Troubleshooting

### API Connection Issues

If you see "Failed to load" errors:

1. Check that the backend API is running on `http://localhost:8080`
2. Verify the API URL in `.env` file
3. Check CORS settings in the backend

### Login Issues

- Ensure your admin account exists in the database
- Verify your credentials are correct
- Check backend logs for authentication errors

### PDF Upload Issues

- Maximum file size is 10MB
- Only PDF files (.pdf) are accepted
- Ensure the backend PDF extraction service is running

## Development Tips

- Use `npm run check` to run TypeScript checks
- Svelte components use `.svelte` extension
- API responses are typed with TypeScript interfaces
- The app uses Svelte stores for state management

## Contributing

When adding new features:

1. Create reusable components in `src/components/`
2. Add new pages in `src/pages/`
3. Update the API client in `src/api/client.ts`
4. Add type definitions for new models
5. Update this README

## License

This project is part of the Skill Drill platform.
