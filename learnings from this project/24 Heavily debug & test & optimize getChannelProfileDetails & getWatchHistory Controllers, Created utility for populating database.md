# 24 Heavily debug & test & optimize getChannelProfileDetails & getWatchHistory Controllers, Created utility for populating database

## 1. getChannelProfileDetails

**Endpoint:** `/channel/:channelName`

**Method:** `GET`

**Controller: `getChannelProfileDetails`**

**Description:**  
This endpoint retrieves details about a specific channel's profile. It provides information such as the channel's username, full name, email, avatar, cover image, number of subscribers, number of channels the user has subscribed to, and whether the current authenticated user is subscribed to the channel.

**Request Parameters:**

- `channelName`: The username of the channel for which profile details are requested.

**Response:**

- `200 OK`: Profile details of the specified channel are successfully retrieved.
- `400 Bad Request`: If the `channelName` parameter is missing or empty.
- `404 Not Found`: If the specified channel is not found.
- `500 Internal Server Error`: If an unexpected error occurs while processing the request.

**Real Request:**

```
GET /channel/user2
```

**Actual Real Response:**

```json
{
    "statusCode": 200,
    "message": "Channel & its details obtained successfully",
    "success": true,
    "data": {
        "_id": "65d0ede68f02c97af8336c4f",
        "username": "user2",
        "email": "user2@example.com",
        "fullName": "User 2",
        "avatar": "avatar_url_here",
        "subscribers": [ // this field is for demonstration purpose only in production this much information in response is overkill
            {
                "username": "user20"
            },
            {
                "username": "user78"
            },
            {
                "username": "user25"
            },
            {
                "username": "user38"
            },
            {
                "username": "user73"
            },
            {
                "username": "user13"
            },
            {
                "username": "user29"
            },
            {
                "username": "user51"
            },
            {
                "username": "user80"
            },
            {
                "username": "user11"
            },
            {
                "username": "user85"
            },
            {
                "username": "user89"
            },
            {
                "username": "user98"
            },
            {
                "username": "user33"
            },
            {
                "username": "user55"
            }
        ],
        "subscribedTo": [ // this field is for demonstration purpose only in production this much information in response is overkill
            {
                "username": "user67"
            },
            {
                "username": "user60"
            },
            {
                "username": "user13"
            },
            {
                "username": "user82"
            },
            {
                "username": "user89"
            },
            {
                "username": "user83"
            },
            {
                "username": "user14"
            },
            {
                "username": "user48"
            },
            {
                "username": "user41"
            }
        ],
        "subscribersCount": 15,
        "subscribedToCount": 9,
        "isActiveUserSubscribed": false
    }
}
```

**Controller (Tested/ Debugged/ Optimized):**

```jsx
export const getChannelProfileDetails = asyncHandler(async (req, res) => {
  const { channelName } = req.params;

  // Validate channel name
  if (!channelName.trim()) {
    const error = new ApiError(400, "Please provide channel name");
    return res.status(error.statusCode).json(error);
  }

  try {
    const channelDetails = await User.aggregate([
      // Match the specified channel name
      { $match: { username: channelName.toLowerCase().trim() } },

      // Lookup channels that are subscribers to the specified channel
      {
        $lookup: {
          from: "subscriptions",
          let: { channelId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$channel", "$$channelId"] } } },
            {
              $lookup: {
                from: "users",
                localField: "subscriber",
                foreignField: "_id",
                as: "subscriberDetails",
              },
            },
            { $unwind: "$subscriberDetails" },
            { $project: { _id: 0, username: "$subscriberDetails.username" } },
          ],
          as: "subscribers",
        },
      },

      // Lookup channels that the specified channel is subscribed to
      {
        $lookup: {
          from: "subscriptions",
          let: { subscriberId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$subscriber", "$$subscriberId"] } } },
            {
              $lookup: {
                from: "users",
                localField: "channel",
                foreignField: "_id",
                as: "channelDetails",
              },
            },
            { $unwind: "$channelDetails" },
            { $project: { _id: 0, username: "$channelDetails.username" } },
          ],
          as: "subscribedTo",
        },
      },

      // Project required fields
      {
        $project: {
          username: 1,
          fullName: 1,
          email: 1,
          avatar: 1,
          coverImage: 1,
          subscribersCount: { $size: "$subscribers" },
          subscribedToCount: { $size: "$subscribedTo" },
          isActiveUserSubscribed: {
            $cond: {
              if: { $in: [req.user?.username, "$subscribers.username"] },
              then: true,
              else: false,
            },
          },
          subscribers: 1,
          subscribedTo: 1,
        },
      },
    ]);

    // Check if channel details found
    if (channelDetails.length === 0) {
      const error = new ApiError(404, "Channel not found");
      return res.status(error.statusCode).json(error);
    }

    const response = new ApiResponse(
      200,
      "Channel & its details obtained successfully",
      channelDetails[0]
    );
    return res.status(response.statusCode).json(response);
  } catch (error) {
    console.log(error);
    const err = new ApiError(500, "Internal Server Error");
    return res.status(err.statusCode).json(err);
  }
});
```

**Notes:**

- The `subscribers` field contains the usernames of channels that are subscribed to the specified channel.
- The `subscribedTo` field contains the usernames of channels that the specified channel is subscribed to.
- The `isActiveUserSubscribed` field indicates whether the authenticated user is subscribed to the specified channel.

---

## 2. getWatchHistory

**Endpoint:** `/get-watch-history`

**Method:** `GET`

**Description:**
This endpoint retrieves the watch history of the logged-in user. It returns a list of videos that the user has previously watched, along with details such as the video title, owner's username, full name, and avatar.

**Request Headers:**

- `Authorization`: Token containing user authentication information.

**Response:**

- `200 OK`: Watch history successfully retrieved.
- `400 Bad Request`: If the user is not logged in.
- `404 Not Found`: If no watch history is found for the user.
- `500 Internal Server Error`: If an unexpected error occurs while processing the request.

**Real Request:**

```
GET /get-watch-history
```

**Actual Real Response:**

```json
{
    "statusCode": 200,
    "message": "History fetched succesfully",
    "success": true,
    "data": [
        {
            "_id": "65d0edf18f02c97af8336e73",
            "videoFile": "video_file_url_here",
            "thumbnail": "thumbnail_url_here",
            "title": "Video 2 by user81",
            "owner": "65d0edee8f02c97af8336ced",
            "description": "Description for Video 2",
            "duration": 0,
            "views": 0,
            "isPublished": true,
            "createdAt": "2024-02-17T17:33:37.489Z",
            "updatedAt": "2024-02-17T17:33:37.489Z",
            "__v": 0,
            "ownerDoc": {
                "_id": "65d0edee8f02c97af8336ced",
                "username": "user81",
                "fullName": "User 81",
                "avatar": "avatar_url_here"
            }
        },
        {
            "_id": "65d0edf78f02c97af8337383",
            "videoFile": "video_file_url_here",
            "thumbnail": "thumbnail_url_here",
            "title": "Video 9 by user44",
            "owner": "65d0edea8f02c97af8336ca3",
            "description": "Description for Video 9",
            "duration": 0,
            "views": 0,
            "isPublished": true,
            "createdAt": "2024-02-17T17:33:43.488Z",
            "updatedAt": "2024-02-17T17:33:43.488Z",
            "__v": 0,
            "ownerDoc": {
                "_id": "65d0edea8f02c97af8336ca3",
                "username": "user44",
                "fullName": "User 44",
                "avatar": "avatar_url_here"
            }
        },
        {
            "_id": "65d0edf88f02c97af8337405",
            "videoFile": "video_file_url_here",
            "thumbnail": "thumbnail_url_here",
            "title": "Video 10 by user3",
            "owner": "65d0ede68f02c97af8336c51",
            "description": "Description for Video 10",
            "duration": 0,
            "views": 0,
            "isPublished": true,
            "createdAt": "2024-02-17T17:33:44.344Z",
            "updatedAt": "2024-02-17T17:33:44.344Z",
            "__v": 0,
            "ownerDoc": {
                "_id": "65d0ede68f02c97af8336c51",
                "username": "user3",
                "fullName": "User 3",
                "avatar": "avatar_url_here"
            }
        },
		{...more}
    ]
}
```

**Controller (Tested/ Debugged/ Optimized):** 

```jsx
export const getWatchHistory = asyncHandler(async (req, res) => {
  // make sure user is logged-in
  if (!req.user) {
    const notLoggedIn = new ApiError(400, "User is not logged-In");
    return res.status(notLoggedIn.statusCode).json(notLoggedIn);
  }

  try {
    // get user history using aggregation
    const history = await User.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(req.user?._id),
        },
      },
      {
        $lookup: {
          from: "videos",
          localField: "watchHistory",
          foreignField: "_id",
          as: "watchedVideosDocs",
          pipeline: [
            {
              $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "ownerDoc",
                pipeline: [
                  {
                    $project: {
                      username: 1,
                      fullName: 1,
                      avatar: 1,
                    },
                  },
                ],
              },
            },
            {
              $addFields: {
                ownerDoc: {
                  $first: "$ownerDoc",
                },
              },
            },
          ],
        },
      },
    ]);

    // return error response if aggregation gave no data
    if (!history) {
      const historyNotFoundError = new ApiError(400, "No History Found");
      res.status(historyNotFoundError.statusCode).json(historyNotFoundError);
    }

    const successResponse = new ApiResponse(
      200,
      "History fetched succesfully",
      history[0].watchedVideosDocs
    );
    res.status(successResponse.statusCode).json(successResponse);
  } catch (error) {
    console.log(error);
    const serverError = new ApiError(500, "Internal Server Error");
    return res.status(serverError.statusCode).json(serverError);
  }
});
```

**Notes:**

- The response contains an array of videos watched by the user.
- Each video object includes the title of the video and details of the owner (username, full name, and avatar).
- The request must include a valid authorization token for the logged-in user.

---

## 3. Created a utility to populate database with data for testing

`/utils/createFakeData.js` is the utility which is a used to populate these collections in the database:

```jsx
import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
```

As these models have some of their fields linked with each other and are dependent on each other creating fake data and populating collection was a challenge but with the little help of A.I I was able to pull this off. All these collections are populated but logically and keeping their connections and links with each other in mind.

All the testing and debugging of above controllers & routes would never have been possible if this utility was not created. So this utility is very important.