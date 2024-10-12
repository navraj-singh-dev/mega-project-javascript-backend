## These JSON files includes the following collections:

1. Playlist
2. Tweet
3. Comment
4. User
5. Video

## To use these in Postman:

1. Open Postman.
2. Click on "Import" in the top left corner.
3. Select all these JSON files.
4. Click "Import" to create the collections from these JSON files.

## Make sure to set up your environment variables in Postman:

- `{{baseUrl}}`: Your API base URL (e.g., `http://localhost:8080`)
- `{{accessToken}}`: Your JWT access token for authenticated requests
- `{{refreshToken}}`: Your JWT access token for authenticated requests

## What are these JSON files ?

- Well when a API (like this project) is created, POSTMAN application is popularly used to test the API.
- You can open POSTMAN enter the http://<"your endpoint"> then enter your data and access tokens if needed and then send a request to check if you backend/API is working.
- But entering all these endpoints/routes and then setting up fields for data, authentication, params, headers etc. in postman one by one will be tiring.
- So i created these JSON files, these will automatically create all the API endpoints with right http method, right data fields, right header fields, right params etc. in few seconds.
- So import these JSON files and also set the environment variables in POSTMAN and just start testing my project without having to waste any time.
