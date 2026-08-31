# Testing Checklist - Admin Dashboard

Use this checklist to verify all features work correctly before deploying to production.

## ✅ Environment Setup

- [ ] Node.js v16+ installed
- [ ] npm/yarn installed
- [ ] Backend API running on http://localhost:8080
- [ ] .env file created with correct API URL
- [ ] Dependencies installed (`npm install`)

## 🔐 Authentication Testing

### Login Page

- [ ] Login page displays correctly
- [ ] Email input accepts valid emails
- [ ] Password input is masked (**\***)
- [ ] "Login" button is clickable
- [ ] Enter key submits form
- [ ] Error message displays for invalid credentials
- [ ] Loading state shows while logging in
- [ ] Successful login redirects to dashboard

### Session Management

- [ ] User stays logged in after page refresh
- [ ] Token is stored in localStorage
- [ ] Logout button works correctly
- [ ] After logout, redirected to login page
- [ ] Expired token triggers redirect to login

## 👥 Users Management

### View Users

- [ ] Users page loads without errors
- [ ] All users display in table
- [ ] Table shows: username, email, role, verified, created_at
- [ ] Loading spinner shows while fetching
- [ ] Empty state message if no users

### Create User

- [ ] "+ Add New User" button opens form modal
- [ ] Form fields: username, email, password, role
- [ ] Form validation works:
  - [ ] Username required
  - [ ] Email required and validated
  - [ ] Password required for new users
  - [ ] Role dropdown has options
- [ ] Form submit creates user and updates table
- [ ] Success message displays
- [ ] Modal closes after successful save
- [ ] Error message displays on API error

### Edit User

- [ ] "Edit" button opens form with user data
- [ ] Form title changes to "Edit User"
- [ ] Password field is optional (leave empty to keep)
- [ ] Form submit updates user
- [ ] Table updates with new values
- [ ] Success message displays

### Delete User

- [ ] "Delete" button shows confirmation dialog
- [ ] Cancel button closes dialog
- [ ] Confirm button deletes user
- [ ] Table updates after deletion
- [ ] Error message on deletion failure

## 📚 Topics Management

### View Topics

- [ ] Topics page loads without errors
- [ ] All topics display in table
- [ ] Table shows: name, description, created_at
- [ ] Loading spinner shows while fetching
- [ ] Empty state message if no topics

### Create Topic

- [ ] "+ Add New Topic" button opens form modal
- [ ] Form fields: name, description
- [ ] Form validation:
  - [ ] Name required
  - [ ] Description required
- [ ] Form submit creates topic
- [ ] Table updates with new topic
- [ ] Success message displays
- [ ] Modal closes after save

### Edit Topic

- [ ] "Edit" button opens form with topic data
- [ ] Form title changes to "Edit Topic"
- [ ] Form fields pre-filled with current values
- [ ] Form submit updates topic
- [ ] Table updates immediately
- [ ] Success message displays

### Delete Topic

- [ ] "Delete" button shows confirmation
- [ ] Confirm deletes topic from table
- [ ] Table updates after deletion

## ❓ Generate Questions

### Topic Selection

- [ ] Topic dropdown loads all topics
- [ ] Dropdown has placeholder text
- [ ] Can select topic from list
- [ ] Selected topic displays in dropdown

### Question Generation

- [ ] Number input accepts values 1-50
- [ ] File input accepts only PDF files
- [ ] File size validation (max 10MB)
- [ ] Generate button is clickable
- [ ] Loading state shows during generation
- [ ] Success message displays after generation

### Generated Questions Display

- [ ] Questions display in numbered format
- [ ] Question text shows correctly
- [ ] Multiple choice options display (A, B, C, D)
- [ ] Correct answer shows with green background
- [ ] Scrollable area if many questions

## 🎨 UI/UX Testing

### Layout

- [ ] Sidebar always visible on desktop
- [ ] Content area properly sized
- [ ] No layout breaks or overlaps
- [ ] Margins and padding consistent

### Sidebar Navigation

- [ ] Logo displays at top
- [ ] All menu items visible:
  - [ ] Dashboard
  - [ ] Users
  - [ ] Topics
  - [ ] Generate Questions
- [ ] Active page highlighted
- [ ] Menu items clickable
- [ ] User name displays
- [ ] Logout button accessible

### Forms

- [ ] Form labels clear and visible
- [ ] Input fields properly styled
- [ ] Focus states visible (blue border)
- [ ] Error messages appear below fields
- [ ] Submit button enabled/disabled correctly
- [ ] Modal close button works (X button)
- [ ] Clicking outside modal closes it

### Messages

- [ ] Error messages styled in red
- [ ] Success messages styled in green
- [ ] Messages appear at top of content
- [ ] Messages disappear after timeout

### Buttons

- [ ] Primary buttons blue
- [ ] Danger buttons red
- [ ] Secondary buttons gray
- [ ] Disabled state shows visual feedback
- [ ] Buttons have hover effects
- [ ] Buttons have proper padding/size

## 📱 Responsive Design

### Desktop (> 1024px)

- [ ] Sidebar visible on left
- [ ] Content fills remaining space
- [ ] Tables display properly
- [ ] Forms aligned correctly

### Tablet (768px - 1024px)

- [ ] Layout adapts to smaller screen
- [ ] Sidebar adjusts width
- [ ] Content readable
- [ ] Tables scrollable if needed

### Mobile (< 768px)

- [ ] Sidebar becomes horizontal top bar
- [ ] Content full width
- [ ] Table scrollable horizontally
- [ ] Forms stack vertically
- [ ] Buttons sized for touch
- [ ] No horizontal scroll on body

## 🔌 API Integration

### Network Requests

- [ ] Open DevTools Network tab
- [ ] Check all API calls successful
- [ ] Status codes correct (200, 201, 400, 401, etc)
- [ ] Request headers include Authorization token
- [ ] Request/response payloads correct format

### Error Handling

- [ ] 400 errors show validation message
- [ ] 401 errors redirect to login
- [ ] 404 errors show "not found" message
- [ ] 500 errors show generic error message
- [ ] Network errors handled gracefully

### CORS

- [ ] No CORS errors in console
- [ ] Requests go to correct API URL
- [ ] API URL from .env is used

## 🔒 Security

### Tokens

- [ ] JWT token stored in localStorage
- [ ] Token sent in Authorization header
- [ ] Token cleared on logout
- [ ] Sensitive data not logged
- [ ] Passwords never sent back in responses

### Form Validation

- [ ] Client-side validation works
- [ ] HTML5 input type validation works
- [ ] Server validation errors handled

### HTTPS (Production)

- [ ] API URL uses HTTPS
- [ ] No mixed content warnings
- [ ] SSL certificate valid

## 📊 Performance

### Load Times

- [ ] Initial page load < 3 seconds
- [ ] API requests < 1 second
- [ ] No UI freezing during requests
- [ ] Smooth animations

### Memory

- [ ] No console errors
- [ ] No console warnings (except expected)
- [ ] DevTools memory stable
- [ ] No memory leaks on navigation

## 🐛 Browser Compatibility

Test in:

- [ ] Chrome/Chromium
- [ ] Firefox
- [ ] Safari
- [ ] Edge

## 📝 Documentation Review

- [ ] README.md is accurate
- [ ] SETUP_GUIDE.md is complete
- [ ] QUICKSTART.md works as described
- [ ] Code comments are helpful
- [ ] API endpoints documented

## 🚀 Production Readiness

- [ ] .env.example has all required variables
- [ ] .env not committed to git
- [ ] No debug code left in
- [ ] No TODO comments without context
- [ ] Build completes without warnings
- [ ] Production build size reasonable
- [ ] Favicon configured
- [ ] Page title correct
- [ ] Meta tags appropriate

## ✨ Final Checklist

- [ ] All features working as expected
- [ ] No console errors or warnings
- [ ] No broken links
- [ ] No placeholder text remaining
- [ ] UI looks professional
- [ ] Ready for production deployment

---

## Test Scenarios

### Scenario 1: New Admin First Time

1. Open dashboard
2. See login page
3. Enter admin credentials
4. Login successful
5. See users/topics data
6. Add new user
7. Add new topic
8. Generate questions

### Scenario 2: Admin Workflow

1. Login
2. View all users
3. Create new student user
4. Edit user role to admin
5. Delete test user
6. View topics
7. Create physics topic
8. Generate 10 questions for physics topic

### Scenario 3: Mobile User

1. Open on mobile browser
2. See mobile-friendly layout
3. Navigate sidebar
4. Interact with tables
5. Submit forms
6. All features work on small screen

---

**Use this checklist before deploying to production!**

Print it out or keep it handy while testing.
