# 17 Subscription mongoose model

## Explanation for this model

```jsx
import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    subscriber: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    channel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Subscription = mongoose.model("Subscription", subscriptionSchema);
```

- This model is for imitating subscribers like on youtube.
- A channel on youtube is nothing but a user that created account on youtube, like a account on instagram is nothing but a user with its details.
- A subscriber is what? well its a user too.
- So this model is very simple and self explanatory, it just have some fields which are referencing to “User” schema model made earlier in project.