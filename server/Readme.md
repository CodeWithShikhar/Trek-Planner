1. Authentication APIs

1.1 POST /auth/signup

Purpose  
Create a new user account and log the user in immediately.

Access  
Public (no prior authentication required).

Request Body (JSON)  
•  name – User’s display name. Required; minimum length 2 characters.  
•  email – User’s email address. Required; must be a valid email format and unique.  
•  password – User’s password. Required; minimum length 6 characters.

Behavior  
1. Validates that name, email, and password are present and valid.  
2. Checks if a user with the same email already exists; if yes, returns an error.  
3. Creates a new user in MongoDB. The password is hashed using bcrypt before saving.  
4. Generates a JSON Web Token (JWT) containing the user’s ID.  
5. Sends the JWT back in two ways:
◦  As an httpOnly cookie named token (not accessible from frontend JavaScript).
◦  In the JSON response body, along with the user’s basic details.

Successful Response  
•  Status: 200 OK  
•  Body:
◦  token – The JWT string.
◦  user – Object with fields: id, name, email.

Possible Errors  
•  400 Bad Request – Missing fields or email already registered.  
•  500 Internal Server Error – Unexpected server or database error.



1.2 POST /auth/login

Purpose  
Authenticate an existing user and start a session.

Access  
Public.

Request Body (JSON)  
•  email – Registered email address. Required.  
•  password – Associated password. Required.

Behavior  
1. Validates that email and password are provided.  
2. Looks up a user by email. If not found, returns an error.  
3. Uses bcrypt to compare the provided password with the stored hashed password.  
4. On success, generates a JWT with the user’s ID.  
5. Sets the JWT in an httpOnly token cookie and returns it in the response body along with basic user info.

Successful Response  
•  Status: 200 OK  
•  Body:
◦  token – The JWT string.
◦  user – Object with id, name, email.

Possible Errors  
•  400 Bad Request – Missing fields or invalid credentials.  
•  500 Internal Server Error – Server/database error.



1.3 POST /auth/logout

Purpose  
Log the current user out.

Access  
Public (typically used by authenticated users).

Request Body  
None required.

Behavior  
1. Clears the token cookie from the client.  
2. Returns a simple confirmation message.

Successful Response  
•  Status: 200 OK  
•  Body: Message indicating logout success, e.g. "Logged out".



1.4 GET /auth/me

Purpose  
Retrieve the currently authenticated user based on the JWT token.

Access  
Protected (requires a valid JWT cookie or Authorization header).

Authentication  
•  Expects a valid JWT in:
◦  The token httpOnly cookie, or
◦  The Authorization: Bearer <token> header.

Behavior  
1. Middleware verifies the JWT; if invalid or missing, returns 401.  
2. If valid, extracts the user ID from the token.  
3. Looks up the user in the database and returns basic user information (excluding password).

Successful Response  
•  Status: 200 OK  
•  Body:
◦  user – Object with id, name, email.

Possible Errors  
•  401 Unauthorized – No token or invalid/expired token.  
•  404 Not Found – User id from token no longer exists.  
•  500 Internal Server Error – Server/database error.



2. Trek APIs

Data Model Summary (Trek)

Each trek includes (among other fields):

•  name – Name of the trek.  
•  location – Location description or name.  
•  difficulty – One of easy, moderate, or hard.  
•  price – Non-negative numeric price.  
•  images – Array of image URLs (in this app, at most one URL is used).  
•  owner – ID of the user who created the trek.



2.1 GET /treks

Purpose  
List treks with pagination and optional filtering.

Access  
Public.

Query Parameters  
•  page – Page number to fetch (starting at 1). Defaults to 1 if not provided.  
•  limit – Number of treks per page. Defaults to 10; maximum allowed is 50.  
•  difficulty – Optional difficulty filter. When given, only treks with that difficulty are returned.  
•  location – Optional location filter. Performs a case-insensitive substring match on the location field.

Behavior  
1. Reads page and limit, applying defaults and a maximum for limit.  
2. Builds a filter object based on difficulty and location if provided.  
3. Queries MongoDB for treks that match the filter:
◦  Sorts results by creation time (newest first).
◦  Skips items to respect the requested page.
◦  Limits the number of results to the page size.  
4. Counts the total number of matching treks to compute the total pages.  
5. Returns the current page of treks plus pagination metadata.

Successful Response  
•  Status: 200 OK  
•  Body:
◦  data – Array of trek objects for the current page.  
◦  page – Current page number.  
◦  totalPages – Total number of pages given the filters and limit.  
◦  total – Total number of treks that match the filters.



2.2 GET /treks/:id

Purpose  
Retrieve the details of a single trek.

Access  
Public.

URL Parameter  
•  :id – The unique identifier of the trek.

Behavior  
1. Looks up the trek in the database by its ID.  
2. If found, returns the full trek document, including fields like name, location, difficulty, price, images, owner info, and timestamps.  
3. If not found, returns 404.

Successful Response  
•  Status: 200 OK  
•  Body: The trek object.

Possible Errors  
•  404 Not Found – If no trek with the given ID exists.  
•  500 Internal Server Error – Server/database error.



2.3 POST /treks

Purpose  
Create a new trek owned by the currently authenticated user.

Access  
Protected (requires a valid JWT; user must be logged in).

Request Body (JSON)  
•  name – Trek name. Required.  
•  location – Trek location. Required.  
•  difficulty – Difficulty level: easy, moderate, or hard. Required.  
•  price – Non-negative number representing trek price. Required.  
•  images – Array of image URLs (Cloudinary URLs). Optional but typically a single-element array.

Behavior  
1. JWT middleware verifies the user and injects the user ID into the request.  
2. Validates that required fields are present and valid.  
3. Creates a new trek in MongoDB with:
◦  The provided properties.
◦  owner set to the current user’s ID.
4. Returns the created trek.

Successful Response  
•  Status: 201 Created  
•  Body: The created trek object.

Possible Errors  
•  401 Unauthorized – No or invalid token.  
•  400 Bad Request – Validation errors (missing fields, invalid difficulty, negative price, etc.).  
•  500 Internal Server Error – Server/database error.



2.4 PUT /treks/:id

Purpose  
Update an existing trek that belongs to the current user.

Access  
Protected; only the owner of the trek can update it.

URL Parameter  
•  :id – The ID of the trek to update.

Request Body (JSON)  
May include any combination of:
•  name – New trek name.  
•  location – New location.  
•  difficulty – New difficulty (must still be one of easy, moderate, hard).  
•  price – New price.  
•  images – New array of image URLs (in this app, either empty or a single URL in the array).

Fields not provided remain unchanged.

Behavior  
1. JWT middleware checks the user and attaches req.user.id.  
2. Looks up the trek by ID.  
3. If trek not found, returns 404.  
4. Checks if the trek’s owner matches the current user’s ID:
◦  If not, returns 403 (not authorized).  
5. For each field present in the request body, updates that field; missing fields are left as-is.  
6. Saves the updated trek; MongoDB re-validates the data.  
7. Returns the updated trek.

Successful Response  
•  Status: 200 OK  
•  Body: Updated trek object.

Possible Errors  
•  401 Unauthorized – Not logged in or token invalid.  
•  403 Forbidden – Logged-in user is not the owner of this trek.  
•  404 Not Found – Trek does not exist.  
•  400 Bad Request – New values fail validation.  
•  500 Internal Server Error – Server/database error.



2.5 DELETE /treks/:id

Purpose  
Delete an existing trek that belongs to the current user.

Access  
Protected; only the owner can delete.

URL Parameter  
•  :id – The ID of the trek to delete.

Behavior  
1. Validates the JWT and identifies the current user.  
2. Finds the trek with the specified ID.  
3. If trek not found, returns 404.  
4. Verifies that the requester is the trek’s owner:
◦  If not, returns 403.  
5. Deletes the trek from the database.  
6. Returns a confirmation message.

Successful Response  
•  Status: 200 OK  
•  Body: Message confirming deletion, e.g. "Trek deleted".

Possible Errors  
•  401 Unauthorized – Not logged in or invalid token.  
•  403 Forbidden – User does not own the trek.  
•  404 Not Found – Trek does not exist.  
•  500 Internal Server Error – Server/database error.



3. Image Upload API

3.1 POST /uploads/image

Purpose  
Upload a single image for a trek, store it in Cloudinary, and return its public URL.

Access  
Protected (requires a valid JWT).

Request Format  
•  Content type: multipart/form-data.  
•  Field: image – The image file to upload (single file).

Behavior  
1. JWT middleware checks and authenticates the user.  
2. Multer parses the multipart form data and temporarily saves the uploaded file to disk.  
3. The server uploads the file from disk to Cloudinary into a specific folder.  
4. On successful upload, Cloudinary returns a secure URL for the image.  
5. The temporary local file is deleted.  
6. The API returns that URL in the response.  
7. The frontend includes this URL in the trek’s images array (usually as the only item), which is persisted via the trek create or update endpoints.

Successful Response  
•  Status: 201 Created  
•  Body:
◦  url – The public Cloudinary URL for the uploaded image.

Possible Errors  
•  401 Unauthorized – Token missing or invalid.  
•  400 Bad Request – No file provided with the expected field name.  
•  500 Internal Server Error – Failure when uploading to Cloudinary or internal server error.