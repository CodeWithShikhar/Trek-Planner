Trek Planner is a small full-stack MERN application for managing trekking. It supports:

•  JWT-based authentication with httpOnly cookies
•  Trek CRUD (create, list with pagination, update, delete)
•  Difficulty/location filtering
•  Single-image upload per trek using Cloudinary
•  React SPA frontend styled with a modern dark UI


1. Tech Stack

Backend

•  Node.js + Express
•  MongoDB + Mongoose
•  JWT (JSON Web Token) authentication
•  bcrypt for password hashing
•  Cloudinary + multer for image upload
•  Cookie-based auth (httpOnly cookie)

Frontend

•  React (functional components, hooks)
•  Vite dev server/bundler
•  React Router
•  Axios
•  React Toastify
•  Custom CSS (no UI framework)



2. Project Structure

Task/
  server/       Node / Express / MongoDB backend
  client/       React + Vite frontend


3. Prerequisites

Before running the project, make sure you have:

1. Node.js
2. MongoDB
3. Cloudinary account


4. Backend Setup (server)

4.1 Install dependencies

cd server
npm install

This installs all backend dependencies (Express, Mongoose, bcryptjs, jsonwebtoken, multer, cloudinary.

4.2 Start the backend server

npm run dev

•  This starts the API on http://localhost:5000.
•  Nodemon is used, so changes to backend code will automatically restart the server.



5. Frontend Setup (client)

5.1 Install dependencies

cd client
npm install

This installs React, Vite, React Router, Axios, React Toastify, etc.

5.2 Start the frontend dev server

npm run dev

•  Local: http://localhost:5173/

6. Usage Guide

6.1 Sign Up and Login

1. Open http://localhost:5173 in the browser.
2. Navigate to /signup (or click “Sign up”).
3. Submit the form:
◦  The backend will:
   ▪  Create a new user.
   ▪  Hash the password with bcrypt before storing.
   ▪  Issue a JWT and set it in an httpOnly cookie.
◦  The frontend receives basic user info and stores it in context.

Then user can:

•  Log out via the Logout button in the trek list page.
•  Log back in via /login.

6.2 Session Persistence

•  The JWT is stored in an httpOnly cookie.
•  On page refresh:
   ◦  The frontend calls GET /auth/me.
   ◦  If the cookie is valid, it restores the user into context.
•  Result: You remain logged in across refreshes.

6.3 Treks: Create, View, Edit, Delete

Create a trek

1. Go to /treks.
2. Click Add Trek.
3. Fill in:
   ◦  Name
   ◦  Location
   ◦  Difficulty (easy, moderate, hard)
   ◦  Price
4. Upload image:
◦  Use the file input in the “Trek Image” section.
◦  The image is uploaded to Cloudinary.
◦  The returned URL is stored as the trek’s image.
5. Submit:
◦  The frontend sends a POST request to /treks.
◦  Backend saves the trek with the current user as owner.

View treks

•  /treks shows:
   ◦  Paginated list (10 per page by default).
   ◦  Filter controls:
▪  Difficulty dropdown.
▪  Location text search (case-insensitive).

Edit a trek

1. In the list, click Edit on a trek card.
2. Edit fields:
3. Image update:
   ◦  Click “Change / Remove” to clear the current image.
   ◦  Upload a new image file; it replaces the old one.
4. Save:
   ◦  Sends a PUT request to /treks/:id.
   ◦  Backend verifies you are the owner, updates the trek, and returns the updated document.

Delete a trek

1. In the list, click Delete.
2. Confirm the browser prompt.
3. The frontend sends DELETE /treks/:id.
4. Backend checks that:
◦  The trek exists.
◦  You are the owner.
5. If authorized, the trek is removed and the list refreshes.
