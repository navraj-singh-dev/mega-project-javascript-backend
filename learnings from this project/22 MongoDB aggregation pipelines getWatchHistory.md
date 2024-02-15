# 22 MongoDB aggregation pipelines: getWatchHistory Controller

## Complete Code:

**Note: No testing or debugging performed, minor bugs & problems may be there.**

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
      {
        $addFields: {
          watchedVideosDocs: {
            $first: "$watchedVideosDocs",
          },
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

## Visual aid to know what this code tries to achieve

**Gets Watch History Of User Like Feature In Youtube**

![https://www.security.org/app/uploads/2023/05/YouTube-watch-history-as-it-appears-on-Chrome.png](https://www.security.org/app/uploads/2023/05/YouTube-watch-history-as-it-appears-on-Chrome.png)

## Simple Explanation

This controller helps you access your video watch history in a simple way:

**What it does:**

1. It checks if you're logged in. If not, it reminds you to log in first.
2. If you're logged in, it retrieves your watch history from the database using aggregation pipelines.
3. It processes the history to include details about the videos you watched.
4. It fetches information about the video owners (username, name, profile picture).
5. If everything works well, it sends you a list of videos you've watched along with their owner information.

**Things to know:**

- It only retrieves basic information about video owners for privacy reasons.
- If you haven't watched any videos yet, you'll see a message saying "No History Found".
- If anything unexpected happens, you'll see a generic "Internal Server Error" message.