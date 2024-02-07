# 19 Understanding Subscription Schema Model

## Problem

So the problem is that in youtube there are little components on webpage of some youtuber’s channel’s main page which shows how many subscribers the youtuber’s channel has, and how many channels the youtuber’s channel itself is subscribed to.

**Example:**

If i go to a  youtuber’s channel which has some name like, “ABC”. So how many subscribers does “ABC” has, and  how many other channels on youtube does “ABC” itself is subscribed to. 

So to implement this functionality to my backend project, it is quite challenging to implement it and make it feasible.

## Solution

### **The Subscription Schema**

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

**It will be used to know:**

- How many subscribers does a channel itself has. For example, how many subscribers does channel “ABC” has.
- How many other channels does “ABC” subscribes to. For example, “ABC” has its own subscribers, but how many subscribers “ABC” itself follows/ subscribes to.

**Understanding Subscription Schema:**

Look, you can see it has two fields: **subscriber** & **channel**. Both of these fields has same value, which is **userModel.** Why? well what is channel? It is simple youtube account which is called “User”. What is a subscriber? Again, it is a simple youtube account which is called a “User”. So when this user follows other user on youtube it is called subscribing to other user & subscribers of other user’s channel increases. Also, each user on youtube are already a channel they just don’t post any video. So this is why both these fields have same value.

**How does this subscription schema solves the problem?**

  

- To know how many subscribers the channel has we go to this schema model and we will look for the value of the field “channel”. Then we will count the documents that match this logic and we get the answer.
- To know how many other channels some particular independent channel itself subscribed to, we will look for the value of the field named “subscribers”. Then we will count the documents that match this logic and we get the answer.

**Illustration of how the document will look like:**

[![J1qAPWX.md.png](https://iili.io/J1qAPWX.md.png)](https://freeimage.host/i/J1qAPWX)

In the schema and in the document, “Channel” Field’s value represent the actual youtube “channel” name that a user is subscribed to. Keep in mind a channel is just a user, it is just put as a value in the “channel” field.

In the schema and in the document, “subscriber” Field’s value represent the name of user, user is subscribes to. Keep in mind a channel is just a user, it is just put as a value in the “channel” field.

**Example document of this schema,**

```jsx
{
  subscriber: "Navraj Singh"
  channel: "Justin Bieber"
 }

/*

The "subscriber" field value is subscribed to "channel" field value.
"Navraj Singh" is subscribed to "Justin Bieber".
"Navraj Singh" itself is both a user and a channel (because every user is by default a channel on youtube) & "Navraj Singh" is subsribed to "Justin Bieber".

*/
```

**A user can subscribe to many other channel (one to many relation):**

```jsx
{
  subscriber: "Navraj Singh"
  channel: "Pewdiepie"
 }

/*

The "subscriber" field value is subscribed to "channel" field value.
"Navraj Singh" is subscribed to "Pewdiepie".
"Navraj Singh" itself is both a user and a channel (because every user is by default a channel on youtube) & "Navraj Singh" is subsribed to "Pewdiepie".

*/
```

**A single user can have multiple user subscribing to itself (many to one relation):**

```jsx
{
  subscriber: "Justin Bieber"
  channel: "Navraj Singh"
 }

/*

The "subscriber" field value is subscribed to "channel" field value.
"Justin Bieber" is subscribed to "Navraj Singh".
"Justin Bieber" itself is both a user and a channel (because every user is by default a channel on youtube) & "Justin Bieber" is subsribed to "Navraj Singh".

*/
```

## Summary

- To know how many subscribers, Example “Navraj Singh” channel has, i will go to MongoDB and go to the subscriptionSchema and look for all the documents that have “channel” field set to user “Navraj Singh”. Counting these documents will give me output
- To know how many channels a single user subscribes to, Example… to know “Navraj Singh” channel’s personal subscriptions, i will go to MongoDB and go to the subscriptionSchema and look for all the documents that have “subscriber” field set to user “Navraj Singh”. Counting these documents will give me output.