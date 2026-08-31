# 📊 Features Documentation - Admin Dashboard

Complete documentation of all admin dashboard features.

## Table of Contents

1. [Authentication](#authentication)
2. [Users Management](#users-management)
3. [Topics Management](#topics-management)
4. [Generate Questions](#generate-questions)
5. [Dashboard](#dashboard)
6. [Navigation](#navigation)

---

## 🔐 Authentication

### Overview

Secure JWT-based authentication system with token persistence.

### Login Page

**File:** `src/pages/Login.svelte`

**Features:**

- Email and password input fields
- Form validation
- Loading state during login
- Error message display
- Remember session (auto-login on page refresh)
- Keyboard support (Enter to submit)

**Visual Design:**

- Blue gradient background
- White card centered on screen
- Professional typography
- Responsive for all devices

**Technical Details:**

```
Endpoint: POST /api/auth/login
Headers: Content-Type: application/json
Body: { email: string, password: string }
Response: { token: string, user: { id, username, email, role } }
```

### Session Management

**File:** `src/stores/auth.ts`

**Features:**

- JWT token stored in localStorage
- User info stored in localStorage
- Auto-load session on app start
- Logout clears all session data
- Token auto-injection in all API requests

**API Interceptor:**

- All requests include `Authorization: Bearer {token}` header
- 401 responses trigger redirect to login
- Token cleared on logout

### Logout

- Click "Logout" button in sidebar
- Clears token and user data
- Redirects to login page
- Session cleared completely

---

## 👥 Users Management

### Overview

Complete CRUD (Create, Read, Update, Delete) interface for managing application users.

### Features

#### 📋 View Users

**File:** `src/pages/Users.svelte`

**Display:**

- Table with all users
- Columns: Username, Email, Role, Verified, Created At
- Sort by clicking column headers
- Responsive table on mobile

**Data:**

```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "role": "student",
  "is_verified": true,
  "created_at": "2024-01-15T10:30:00Z"
}
```

#### ➕ Create User

**Modal Form:** `src/components/UserForm.svelte`

**Fields:**
| Field | Type | Required | Validation |
|-------|------|----------|-----------|
| Username | Text | ✅ | Non-empty |
| Email | Email | ✅ | Valid email format |
| Password | Password | ✅ | Non-empty |
| Role | Select | ✅ | student/admin |

**Process:**

1. Click "+ Add New User" button
2. Modal form opens
3. Fill in user details
4. Click "Save"
5. API creates user
6. Table updates automatically
7. Success message shows

**Validation:**

- Client-side: Email format, required fields
- Server-side: Duplicate email check, password rules

#### ✏️ Edit User

**Modal Form:** `src/components/UserForm.svelte`

**Editable Fields:**

- Username
- Email
- Password (optional - leave blank to keep current)
- Role

**Process:**

1. Click "Edit" button on user row
2. Modal opens with pre-filled data
3. Modify fields
4. Click "Save"
5. API updates user
6. Table reflects changes
7. Success message shows

**API:**

```
Endpoint: PUT /api/users/:id
Body: { username, email, password?, role }
```

#### 🗑️ Delete User

**Process:**

1. Click "Delete" button on user row
2. Confirmation dialog appears
3. Click "Confirm"
4. API deletes user
5. User removed from table
6. Success message shows

**API:**

```
Endpoint: DELETE /api/users/:id
Response: 204 No Content
```

### User Roles

#### Student Role

- Can access study modules
- Cannot access admin features
- Can submit study sessions

#### Admin Role

- Full access to admin dashboard
- Can manage users and topics
- Can generate questions
- Can view all student data

### Error Handling

- Invalid email format → Error message
- Duplicate email → Server error displayed
- Network error → Retry option
- 401 Unauthorized → Redirect to login

---

## 📚 Topics Management

### Overview

Create and manage study topics that organize questions and learning material.

### Features

#### 📋 View Topics

**File:** `src/pages/Topics.svelte`

**Display:**

- Table with all topics
- Columns: Topic Name, Description, Created At
- Sortable columns
- Loading state while fetching

**Data:**

```json
{
  "id": 1,
  "name": "Mathematics",
  "description": "Algebra, Geometry, Calculus",
  "created_at": "2024-01-10T09:00:00Z"
}
```

#### ➕ Create Topic

**Modal Form:** `src/components/TopicForm.svelte`

**Fields:**
| Field | Type | Required | Validation |
|-------|------|----------|-----------|
| Topic Name | Text | ✅ | Unique, non-empty |
| Description | Textarea | ✅ | Non-empty, max 500 chars |

**Process:**

1. Click "+ Add New Topic" button
2. Modal form opens
3. Enter topic name and description
4. Click "Save"
5. Topic created via API
6. Table updates with new topic
7. Success message shows

#### ✏️ Edit Topic

**Process:**

1. Click "Edit" button on topic row
2. Modal opens with current data
3. Modify name and/or description
4. Click "Save"
5. Updates sent to API
6. Table refreshes
7. Success message shows

#### 🗑️ Delete Topic

**Process:**

1. Click "Delete" button on topic row
2. Confirmation dialog appears
3. Click "Confirm"
4. Topic deleted via API
5. Removed from table
6. Success message shows

**Note:** Topics can typically only be deleted if they have no associated questions.

### Topic Use Cases

- **Mathematics:** Algebra, Geometry, Trigonometry, Calculus
- **Science:** Physics, Chemistry, Biology, Earth Science
- **Languages:** English, Spanish, French, German, Japanese
- **Technology:** Programming, Web Development, Data Science
- **Other:** History, Geography, Economics, etc.

---

## ❓ Generate Questions

### Overview

AI-powered question generation from PDF documents or text input.

**File:** `src/pages/GenerateQuestions.svelte`

### Features

#### 1. Topic Selection

**UI:**

- Dropdown list of all available topics
- Searchable (type to filter)
- Required field

#### 2. Quantity Settings

**UI:**

- Number input field
- Range: 1-50 questions
- Default: 5 questions
- Error if outside range

#### 3. PDF Upload (Optional)

**UI:**

- File input (accepts .pdf only)
- Maximum size: 10MB
- Shows selected filename
- File preview

**Validation:**

- File must be .pdf format
- File size < 10MB
- Clear error messages if validation fails

#### 4. Question Generation

**Process:**

1. Select topic from dropdown
2. Enter number of questions (1-50)
3. Optionally upload PDF
4. Click "Generate Questions"
5. Loading spinner shows
6. AI processes request
7. Questions display

**API:**

```
Endpoint: POST /api/admin/generate-questions
Method: POST
Content-Type: multipart/form-data

Fields:
- topic_id: number (required)
- num_questions: number (required, 1-50)
- file_pdf: File (optional)

Response:
{
  "success": true,
  "data": {
    "questions": [
      {
        "text": "What is 2+2?",
        "options": ["3", "4", "5", "6"],
        "answer": "4"
      }
    ]
  }
}
```

#### 5. Display Generated Questions

**Format:**

- Question number with colored circle badge
- Question text in bold
- Multiple choice options (A, B, C, D)
- Correct answer highlighted in green
- Copy/export functionality (can be added)

**Example Display:**

```
Q1
What is the capital of France?
A. London
B. Berlin
C. Paris  ← GREEN (Correct)
D. Madrid

Answer: C. Paris
```

### Question Generation Methods

#### From Topic Only

- Uses LLM to generate questions based on topic
- Creates realistic, relevant questions
- No document needed

#### From PDF File

- Extracts text from PDF
- Generates questions based on content
- More contextual and specific questions

### Error Handling

- Topic not selected → Error message
- Invalid number range → Error message
- File format invalid → Error message
- File too large → Error message
- Generation timeout → Retry button
- API error → Friendly error message

---

## 📊 Dashboard

### Overview

Main overview page for admin dashboard.

**File:** `src/pages/Dashboard.svelte`

### Current Features

- Welcome message
- Quick links to other sections
- (Can be enhanced with stats, charts, etc.)

### Future Enhancements

- User statistics (total users, new users this month)
- Topic statistics (total topics, questions generated)
- Recent activity log
- Quick action buttons
- Charts and graphs
- System health status

---

## 🧭 Navigation

### Sidebar Navigation

**File:** `src/components/Sidebar.svelte`

**Components:**

- Logo/brand at top
- Navigation menu
- User section at bottom

**Menu Items:**

1. **Dashboard** 📊
   - Overview page
   - Quick stats
   - Recently updated

2. **Users** 👥
   - User management CRUD
   - View all users
   - Manage roles

3. **Topics** 📚
   - Topic management CRUD
   - View topics
   - Manage categories

4. **Generate Questions** ❓
   - AI question generation
   - Upload PDF
   - Generate Q&A

5. **Logout** 🔓
   - Clear session
   - Redirect to login

### Active Page Indicator

- Current page highlighted with blue background
- Blue left border on active menu item
- Clear visual feedback

### Responsive Behavior

- **Desktop (>1024px):** Sidebar always visible on left
- **Tablet (768-1024px):** Sidebar adjusted width
- **Mobile (<768px):** Sidebar becomes horizontal top bar

---

## 🎨 UI Components

### Reusable Components

#### 1. Layout Component

**File:** `src/components/Layout.svelte`
**Purpose:** Wraps pages with sidebar and proper spacing
**Props:** `title` (page title)

#### 2. Sidebar Component

**File:** `src/components/Sidebar.svelte`
**Purpose:** Navigation menu
**Features:** Active page tracking, responsive design

#### 3. Table Component

**File:** `src/components/Table.svelte`
**Purpose:** Display tabular data
**Features:**

- Custom columns
- Actions (Edit/Delete)
- Loading states
- Empty states

#### 4. UserForm Component

**File:** `src/components/UserForm.svelte`
**Purpose:** Modal form for user CRUD
**Features:** Validation, error messages, edit mode

#### 5. TopicForm Component

**File:** `src/components/TopicForm.svelte`
**Purpose:** Modal form for topic CRUD
**Features:** Validation, textarea for description

---

## 🎯 Common Workflows

### Workflow 1: Add a New Student

1. Login as admin
2. Go to Users section
3. Click "+ Add New User"
4. Fill in student details
5. Set Role to "student"
6. Click Save
7. Student account created

### Workflow 2: Setup a New Topic and Generate Questions

1. Go to Topics section
2. Click "+ Add New Topic"
3. Enter topic name and description
4. Click Save
5. Go to Generate Questions
6. Select the new topic
7. Set number of questions
8. Click Generate Questions
9. Questions appear for the topic

### Workflow 3: Manage Student Permissions

1. Go to Users section
2. Find student in table
3. Click Edit
4. Change role to "admin" if needed
5. Click Save
6. Student now has admin privileges

---

## 📱 Responsive Design Details

### Desktop Layout (> 1024px)

```
┌─────────────────────────────────┐
│         SIDEBAR    │  CONTENT    │
│  (250px)           │  (rest)     │
│                    │             │
│  Dashboard         │  Page Title │
│  Users             │             │
│  Topics            │  Main       │
│  Generate Q        │  Content    │
│  Logout            │             │
└─────────────────────────────────┘
```

### Mobile Layout (< 768px)

```
┌─────────────────────────────────┐
│  Logo │ User │ Logout           │  (Horizontal nav)
├─────────────────────────────────┤
│                                 │
│  Page Title                     │
│                                 │
│  Main Content (Full Width)      │
│  - Stacked forms                │
│  - Scrollable tables            │
│                                 │
└─────────────────────────────────┘
```

---

## 🔐 Security & Permissions

### Authentication Required

- All pages require login
- Auto-redirect if not authenticated
- Token validation on each request

### Admin-Only Operations

- All CRUD operations require admin role
- API enforces permission on backend
- Frontend prevents access to admin routes

### Data Protection

- Passwords hashed on backend
- Sensitive data not exposed in API
- HTTPS recommended for production

---

## ⚙️ Configuration

### Environment Variables

```env
VITE_API_URL=http://localhost:8080/api
```

### API Configuration

- **Base URL:** Configurable via .env
- **Timeout:** 30 seconds (can be adjusted)
- **Retry:** Auto-retry on network error
- **Token:** Auto-injected in all requests

---

## 🚀 Performance Features

### Optimization

- Lazy loading of components
- Efficient re-renders with Svelte
- Minimal bundle size
- Fast API responses

### Caching

- User data cached in localStorage
- Session persistence
- Reduced API calls on navigation

---

## 🆘 Error Handling

### Types of Errors

#### Validation Errors

- Missing required fields
- Invalid email format
- File size exceeded
- **Display:** Red error message below field

#### Server Errors

- Failed API requests
- Database errors
- Permission denied
- **Display:** Error toast at top

#### Network Errors

- No internet connection
- Timeout
- **Display:** Error message with retry button

#### Auth Errors

- Invalid credentials
- Token expired
- **Display:** Redirect to login

---

**For more detailed information, see:**

- [README.md](./README.md) - Full documentation
- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Setup instructions
- [QUICKSTART.md](./QUICKSTART.md) - Quick start guide
- [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) - Technical summary
