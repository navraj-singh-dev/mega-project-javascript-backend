# HTTP ( HyperText Transfer Protocol )

- It is a protocol (defined rules) for transffering text ( data ) over internet from client to server or server to client.
- HyperText mens hyperlinks, where one text is linked to another text and for that user just have to click on a particualr link to reach to that text. In modern web we can navigate web pages through these hyperlinks.

- ## HTTP Headers

  - when sending a HTTP request there is a need to define this request properly to the recieving end (maybe a server or client) by giving additional information about this request.
  - this additional information is called headers, headers are attached to the request and headers provide additional information about this request/response to the recieving end server/client. basically headers are metadata (data about data).
  - example:
    - general example can be,
      if there is a photo in smartphone then that photo has additional information like: size of photo (in MB), date created, location in disk, camera name that clicked this photo etc.
      just like that `headers` can or cannot contain information about HTTP request like: statusCode (500, 404), clientName, serverName (express, django), etc.
  - headers are in both req and res.

  - ## Information Headers Mostly Have:

    - ### some very common usage for headers is:
      - **Caching**
        - if a request was handled just some time ago and that same request came back again to server then cached information is used.
      - **Authentication**
        - headers can contain JWT token.
        - and session data.
        - and cookie data.
        - etc inforamtion about authentication.
      - **Manage State**
        - headers can have information like,
          is the user logged in, logged out, or any other information acc. to the certain scenario.

  - ## Types Of Headers (Unofficial and Custom made list of header's types made by some devs.):

    - **Request Headers**
      - come from client.
    - **Response Headers**
      - come from server.
      - like: statusCode, etc.
    - **Representation Headers**
      - used when data is compressed and encoded.
      - example razorpay/ zerodha.
      - network can hang if too much data is sent, thats why compression is performed.
      - in these scenarios this type is used.
    - **Payload Headers**
      - payload is fancy name for data.
      - this type of headers just contains `data` about user or something.
      - like: id, email, etc.

  - ## Most common fields in headers

    - accept: application/json (what form of data that is accepted like json, html),
    - user agent: (tool the user used to make the request like: postman, browser_name, etc.),
    - authorization: bearer "JWT_HERE" (tokens come here like: JWT),
    - content-type: (media/data type like: pdf, image, text, etc.),
    - cookie: (key value pair that contains some data),
    - cache-control: (keeping/ delteting some cached data etc.),
    - **header fields for CORS**
      - access-control-allow-origin,
      - acess-control-allow-credentials,
      - access-control-allow-method,
    - **header fields for Security**
      - cross-origin-embedder-policy,
      - cross-origin-opener-policy,
      - content-security-policy,
      - x-xss-protection,

  - ## Note For Headers
    - headers are just metadata, it is for the help of developer.. to understand and implement the request/response in a better way.
    - it is you who will see the headers and information in the headers,
      then write the logic and code for the application,
      headers themselves cant control or do anything as they are just some
      information for the developer to see and understand.

- ## HTTP Methods

  - ### NOTE:
    - mostly http methods are used to interact with database like mongoDB, SQL etc.

  1. **GET:**

  - a basic browser request is mostly GET.
  - it is used to retrieve some data/ resource.
  - go to a end point that gives some data(json, html),
    then use a GET request and receive it.

  2. **POST:**

  - interact with the resource.
  - it is used to recieve the data and add it.
  - all the forms use post method.
  - data recieved goes into body object.

  3. **PUT:**

  - it is used to replace a resource.
  - it is used to replace the complete resource.

  4. **PATCH:**

  - it is used to edit the resource.
  - it is used to only edit some part of the resource.

  5. **DELETE:**

  - remove a resource, mostly from a database.

  6. **HEAD:**

  - response headers recieved only.
  - no body recieved.

  7. **OPTIONS:**

  - this method is used to show available options on a specific endpoint.
  - for example:
    - '/users' endpoint have 'get', 'post' operations available.

  8. **TRACE:**

  - used for debugging.
  - it is used if a resource we want is behind some layers of proxies,
    so which proxies the request is going through and which proxies the response is coming back from and to do some debugging there.

- ## HTTP Status Codes

  - ### Note

    - status codes are just indicators and standarized practice.
      they dont do anything, they just indicate.
      so every company, mnc might have their own list/sheet of how to use the status codes.
    - never remember status codes, just know their overview and usage.

  - **100**
    - used to indicate some information.
  - **200**
    - used for indicate success for some operations.
  - **300**
    - used to indicate redirection of some resource, endpoint, method etc.
  - **400**
    - used to indicate cliemt side error.
  - **500**
    - used to indicate server side error.
