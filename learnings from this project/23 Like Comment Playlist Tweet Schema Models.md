# 23 Like Comment Playlist Tweet Schema Models

## 1. Like Model

"Like" model used within the application is used to manage user likes across various resources like comments, videos, and tweets.

```jsx
import mongoose from "mongoose";

const likesSchema = new mongoose.Schema(
  {
    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
    },
    likedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    tweet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tweet",
    },
  },
  { timestamps: true }
);

export const Like = mongoose.model("Like", likesSchema);
```

**What it does:**

- Stores information about each "Like" action performed by a user.
- Tracks which resource (comment, video, or tweet) is being liked.
- Records the user who performed the like action.
- Automatically logs the date and time of each like.

**Structure:**

- **comment:** Reference to the associated comment (optional, only one can be set)
- **video:** Reference to the associated video (optional, only one can be set)
- **likedBy:** Reference to the user who performed the like (required)
- **tweet:** Reference to the associated tweet (optional, only one can be set)
- **timestamps:** Automatically created fields storing the date and time of like creation and update.

**Relationships:**

- Each "Like" belongs to one user (likedBy).
- Each "Like" can optionally be associated with one comment, video, or tweet (mutually exclusive).

**Use cases:**

- Implementing like functionality for comments, videos, and tweets.
- Tracking user engagement with different content types.
- Building features like "Most Liked" sections based on like counts.

**Important notes:**

- Only one resource (comment, video, or tweet) can be associated with a like.
- The user performing the like action is required information.

---

## 2. Comment Model

This module defines the "Comment" model used within the application to manage comments associated with videos.

```jsx
import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

commentSchema.plugin(mongooseAggregatePaginate);

export const Comment = mongoose.model("Comment", commentSchema);
```

**Purpose:**

- Stores information about individual comments submitted by users on videos.
- Tracks the content of the comment, the video it's associated with, and the user who wrote it.
- Automatically records the date and time of each comment creation and update.

**Structure:**

- **content:** Text content of the comment (required).
- **video:** Reference to the video the comment belongs to (required).
- **owner:** Reference to the user who wrote the comment (required and indexed).
- **timestamps:** Automatically created fields storing the date and time of comment creation and update.

**Relationships:**

- Each "Comment" belongs to one user (owner).
- Each "Comment" belongs to one video.

**Features:**

- This model includes the `mongoose-aggregate-paginate-v2` plugin, enabling efficient pagination of comments during retrieval.

**Use cases:**

- Implementing comment sections for videos.
- Displaying comments associated with specific videos.
- Building features like "Most Commented" videos based on comment count.

**Important notes:**

- Both content and video association are required fields for a valid comment.
- The owner of the comment is linked to a user profile.

---

## 3. Playlist Model

This module defines the "Playlist" model used within the application to manage user-created video playlists.

```jsx
import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    video: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

export const Playlist = mongoose.model("Playlist", playlistSchema);
```

**What it does:**

- Stores information about individual playlists created by users.
- Tracks the name, description (optional), and videos included in each playlist.
- Records the owner of the playlist (the user who created it).
- Automatically logs the date and time of playlist creation and update.

**Structure:**

- **name:** The title of the playlist (required).
- **description:** An optional description of the playlist's content.
- **video:** An array of references to video documents (required).
- **owner:** Reference to the user who created the playlist (required and indexed).
- **timestamps:** Automatically created fields storing the date and time of playlist creation and update.

**Relationships:**

- Each "Playlist" belongs to one user (owner).
- Each "Playlist" can contain multiple videos (referenced by "_id").

**Use cases:**

- Implementing user-defined video playlists.
- Displaying and managing playlists created by users.
- Building features like "Most Popular" playlists based on view count or user interaction.

**Important notes:**

- A playlist name is required, while a description is optional.
- At least one video reference is required for a valid playlist.
- Playlists are owned by individual users and linked to their profiles.

---

## 4. Tweet Model

This module defines the "Tweet" model within the application, used to manage individual tweets created by users.

```jsx
import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const tweetSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

tweetSchema.plugin(mongooseAggregatePaginate);

export const Tweet = mongoose.model("Tweet", tweetSchema);
```

**Purpose:**

- Stores information about each tweet posted by users.
- Tracks the content of the tweet, the user who posted it, and automatically records the date and time of its creation and updates.

**Structure:**

- **owner:** Reference to the user who posted the tweet (required and indexed).
- **content:** The text content of the tweet (required).
- **timestamps:** Automatically created fields storing the date and time of tweet creation and update.

**Relationships:**

- Each "Tweet" belongs to one user (owner).

**Features:**

- This model includes the `mongoose-aggregate-paginate-v2` plugin, enabling efficient pagination of tweets during retrieval.

**Use cases:**

- Implementing a Twitter-like feed of user-generated tweets.
- Displaying tweets posted by specific users or based on hashtags.
- Building features like "Most Liked" or "Most Retweeted" tweets based on user interactions.

**Important notes:**

- Both owner and content are required fields for a valid tweet.
- The owner of the tweet is linked to a user profile.

---