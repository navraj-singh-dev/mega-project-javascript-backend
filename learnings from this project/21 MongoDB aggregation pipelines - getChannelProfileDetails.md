# 21 MongoDB aggregation pipelines: getChannelProfileDetails Controller

## Purpose:

Left Joining Two Collections From Database For Getting Required Channel’s Information (its subscribers, its own subscriptions etc.) and much more.

### Complete Code:

**Note: Code is not tested nor debugged, it might have some issues..**

```jsx
export const export const getChannelProfileDetails = asyncHandler(async (req, res) => {
  // find the given channel
  const { channelName } = req.params;

  if (!channelName.trim()) {
    const noChannelNameError = ApiError(400, "Please provide channel name");
    return res.status(noChannelNameError.statusCode).json(noChannelNameError);
  }

  // get profile details (subscribers, subscribed-to, etc.)
  const channelDetails = User.aggregate([
    // look for the channel in database
    {
      $match: {
        username: channelName?.toLowerCase().trim(),
      },
    },
    // get the number of subscribers
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "channelSubscribers",
      },
    },
    // get personal subscriptions
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "channelPersonalSubscriptions",
      },
    },
    // calculate personal subscriptions & subscribers
    {
      $addFields: {
        subscribers: {
          $size: "$channelSubscribers",
        },
        subscriberdTo: {
          $size: "$channelPersonalSubscriptions",
        },
        isActiveUserSubscribed: {
          $cond: {
            if: { $in: [req.user?._id, "$channelSubscribers.subscriber"] },
            then: true,
            else: false,
          },
        },
      },
    },
    // only give required & useful info
    {
      $project: {
        username: 1,
        fullName: 1,
        email: 1,
        avatar: 1,
        coverImage: 1,
        subscribers: 1,
        subscriberdTo: 1,
      },
    },
  ]);

  // console.log(channelDetails);

  const successResponse = ApiResponse(
    200,
    "Channel & its details obtained successfully",
    channelDetails[0]
  );

  return res.status(successResponse.statusCode).json(successResponse);
});
```

## Complete Explanation

This ExpressJS controller handles requests to retrieve a channel's profile details, which can be sent to the frontend for showing the channel’s details to a user, including:

- Username
- Full Name
- Email
- Avatar image
- Cover image
- Number of subscribers
- Number of channels subscribed to
- Whether the logged-in user is subscribed to this channel (if applicable)

**Example Image for illustrating what this code achieves in a simpler form:**

[https://freeimage.host/i/JEdNs5v](https://freeimage.host/i/JEdNs5v)

- This is how youtube show’s channel info when we go to a certain channel, i am making kind of a version related to it.
- My backend send back this data, which is calculated by using a little bit complex **aggregation pipeline.**
- Then the front end can show this data however it is suitable for front end.
- Basically the data is: logo (avatar), cover image, name of the channel, its subscribers count, and channel’s own personal subscription’s count etc.

**How it works:**

1. You provide the channel's name in the URL (e.g., `/api/some_name/`).
2. The controller checks if you included a channel name. If not, it returns an error message.
3. It looks up the channel in the database based on the provided name.
4. If the channel is found, it fetches various information like subscriber count, subscriptions, and user data using aggregation pipelines.
5. It calculates whether the logged-in user (if any) is subscribed to this channel.
6. It selects only the relevant and publicly available information about the channel.
7. If everything is successful, it returns a response with the channel details and a success message.
