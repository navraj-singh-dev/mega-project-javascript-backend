# MongoDB Aggregation

## Introduction (Less Jargon)

Aggregation pipeline means a complete mission(bigger operation on data in mongoDB) which will be performed in a sequence of stages. You might want to do some one huge complex mission/ operations on data in mongoDB to get some final output, then aggregation pipelines are used to do that. In the pipeline we give number of stages, where each stages perform a particular task on the data and give the final output. 

Stage 1 output → Stage 2 input.

Stage 2 output → Stage 3 input → and so on.

It is the overall aggregation pipeline thing.

If the database has a collection and it has 100 documents, but output of stage 1 is 50 documents after some operations, then stage 2 will takes these 50 documents as input not the entire collection. Then if the output of stage 2 is 10 documents after some operations, then these 10 documents are input to the stage 3. Then if the stage 3 is final stage it will give the final output.

---

## Mock Data Used To Learn Aggregation Pipelines

### Spoiler → It’s Huge, But i trimmed it down for performance and fast load

```jsx
[
  {
    "_id": {
      "$oid": "65c5ce3d1a51d0cdf7ff2ca2"
    },
    "index": 0,
    "name": "Aurelia Gonzales",
    "isActive": false,
    "registered": {
      "$date": "2015-02-11T04:22:39.000Z"
    },
    "age": 20,
    "gender": "female",
    "eyeColor": "green",
    "favoriteFruit": "banana",
    "company": {
      "title": "YURTURE",
      "email": "aureliagonzales@yurture.com",
      "phone": "+1 (940) 501-3963",
      "location": {
        "country": "USA",
        "address": "694 Hewes Street"
      }
    },
    "tags": ["enim", "id", "velit", "ad", "consequat"]
  },
  {
    "_id": {
      "$oid": "65c5ce3d1a51d0cdf7ff2ca3"
    },
    "index": 1,
    "name": "Kitty Snow",
    "isActive": false,
    "registered": {
      "$date": "2018-01-23T04:46:15.000Z"
    },
    "age": 38,
    "gender": "female",
    "eyeColor": "blue",
    "favoriteFruit": "apple",
    "company": {
      "title": "DIGITALUS",
      "email": "kittysnow@digitalus.com",
      "phone": "+1 (949) 568-3470",
      "location": {
        "country": "Italy",
        "address": "154 Arlington Avenue"
      }
    },
    "tags": ["ut", "voluptate", "consequat", "consequat"]
  },
  {
    "_id": {
      "$oid": "65c5ce3d1a51d0cdf7ff2ca4"
    },
    "index": 2,
    "name": "Hays Wise",
    "isActive": false,
    "registered": {
      "$date": "2015-02-23T10:22:15.000Z"
    },
    "age": 24,
    "gender": "male",
    "eyeColor": "green",
    "favoriteFruit": "strawberry",
    "company": {
      "title": "EXIAND",
      "email": "hayswise@exiand.com",
      "phone": "+1 (801) 583-3393",
      "location": {
        "country": "France",
        "address": "795 Borinquen Pl"
      }
    },
    "tags": ["amet", "ad", "elit", "ipsum"]
  },
  {
    "_id": {
      "$oid": "65c5ce3d1a51d0cdf7ff2ca5"
    },
    "index": 3,
    "name": "Karyn Rhodes",
    "isActive": true,
    "registered": {
      "$date": "2014-03-11T03:02:33.000Z"
    },
    "age": 39,
    "gender": "female",
    "eyeColor": "green",
    "favoriteFruit": "strawberry",
    "company": {
      "title": "RODEMCO",
      "email": "karynrhodes@rodemco.com",
      "phone": "+1 (801) 505-3760",
      "location": {
        "country": "USA",
        "address": "521 Seigel Street"
      }
    },
    "tags": ["cillum", "exercitation", "excepteur"]
  },
  {
    "_id": {
      "$oid": "65c5ce3d1a51d0cdf7ff2ca6"
    },
    "index": 4,
    "name": "Alison Farmer",
    "isActive": false,
    "registered": {
      "$date": "2018-01-22T10:05:45.000Z"
    },
    "age": 33,
    "gender": "female",
    "eyeColor": "brown",
    "favoriteFruit": "banana",
    "company": {
      "title": "OTHERSIDE",
      "email": "alisonfarmer@otherside.com",
      "phone": "+1 (902) 572-3954",
      "location": {
        "country": "Italy",
        "address": "356 Newkirk Placez"
      }
    },
    "tags": ["deserunt", "et", "duis", "dolor"]
  },
  {
    "_id": {
      "$oid": "65c5ce3d1a51d0cdf7ff2ca7"
    },
    "index": 5,
    "name": "Grace Larson",
    "isActive": true,
    "registered": {
      "$date": "2014-04-20T11:37:23.000Z"
    },
    "age": 20,
    "gender": "female",
    "eyeColor": "blue",
    "favoriteFruit": "apple",
    "company": {
      "title": "OVOLO",
      "email": "gracelarson@ovolo.com",
      "phone": "+1 (930) 510-3310",
      "location": {
        "country": "USA",
        "address": "932 Linden Street"
      }
    },
    "tags": ["fugiat", "minim"]
  },
  
  {
    "_id": {
      "$oid": "65c5ce3d1a51d0cdf7ff2dce"
    },
    "index": 300,
    "name": "Rae Robertson",
    "isActive": true,
    "registered": {
      "$date": "2014-04-07T05:25:45.000Z"
    },
    "age": 27,
    "gender": "female",
    "eyeColor": "brown",
    "favoriteFruit": "banana",
    "company": {
      "title": "BILLMED",
      "email": "raerobertson@billmed.com",
      "phone": "+1 (836) 556-3008",
      "location": {
        "country": "USA",
        "address": "861 Haring Street"
      }
    },
    "tags": ["do", "commodo", "labore", "enim"]
  },
  {
    "_id": {
      "$oid": "65c5ce3d1a51d0cdf7ff2dcf"
    },
    "index": 301,
    "name": "Faye Clayton",
    "isActive": true,
    "registered": {
      "$date": "2016-10-04T06:09:44.000Z"
    },
    "age": 40,
    "gender": "female",
    "eyeColor": "blue",
    "favoriteFruit": "strawberry",
    "company": {
      "title": "BARKARAMA",
      "email": "fayeclayton@barkarama.com",
      "phone": "+1 (963) 448-2986",
      "location": {
        "country": "Germany",
        "address": "483 Granite Street"
      }
    },
    "tags": ["ut", "consectetur"]
  },
  {
    "_id": {
      "$oid": "65c5ce3d1a51d0cdf7ff2dd0"
    },
    "index": 302,
    "name": "Mcneil Terrell",
    "isActive": true,
    "registered": {
      "$date": "2017-03-08T02:08:08.000Z"
    },
    "age": 25,
    "gender": "male",
    "eyeColor": "brown",
    "favoriteFruit": "apple",
    "company": {
      "title": "ORBIN",
      "email": "mcneilterrell@orbin.com",
      "phone": "+1 (948) 430-3550",
      "location": {
        "country": "USA",
        "address": "596 Harwood Place"
      }
    },
    "tags": ["cupidatat", "sunt", "duis", "ad", "incididunt"]
  },
  {
    "_id": {
      "$oid": "65c5ce3d1a51d0cdf7ff2dd1"
    },
    "index": 303,
    "name": "Powell Sherman",
    "isActive": true,
    "registered": {
      "$date": "2016-10-15T07:20:01.000Z"
    },
    "age": 25,
    "gender": "male",
    "eyeColor": "blue",
    "favoriteFruit": "apple",
    "company": {
      "title": "ZILLIDIUM",
      "email": "powellsherman@zillidium.com",
      "phone": "+1 (913) 554-3499",
      "location": {
        "country": "Germany",
        "address": "863 Joval Court"
      }
    },
    "tags": ["fugiat", "officia", "enim"]
  },
  {
    "_id": {
      "$oid": "65c5ce3d1a51d0cdf7ff2dd2"
    },
    "index": 304,
    "name": "Lorna Lowery",
    "isActive": true,
    "registered": {
      "$date": "2014-09-03T12:37:55.000Z"
    },
    "age": 26,
    "gender": "female",
    "eyeColor": "brown",
    "favoriteFruit": "banana",
    "company": {
      "title": "NETAGY",
      "email": "lornalowery@netagy.com",
      "phone": "+1 (961) 565-3986",
      "location": {
        "country": "Italy",
        "address": "388 Prospect Avenue"
      }
    },
    "tags": ["fugiat", "amet", "labore", "consectetur", "duis"]
  },
  {
    "_id": {
      "$oid": "65c5ce3d1a51d0cdf7ff2dd3"
    },
    "index": 305,
    "name": "Gladys Harrison",
    "isActive": false,
    "registered": {
      "$date": "2014-08-13T06:59:34.000Z"
    },
    "age": 20,
    "gender": "female",
    "eyeColor": "blue",
    "favoriteFruit": "apple",
    "company": {
      "title": "GENMOM",
      "email": "gladysharrison@genmom.com",
      "phone": "+1 (970) 473-3842",
      "location": {
        "country": "Italy",
        "address": "596 Fanchon Place"
      }
    },
    "tags": ["nulla", "incididunt", "ullamco"]
  },
  {
    "_id": {
      "$oid": "65c5ce3d1a51d0cdf7ff2dd4"
    },
    "index": 306,
    "name": "Sheri Jensen",
    "isActive": false,
    "registered": {
      "$date": "2016-03-28T05:16:58.000Z"
    },
    "age": 33,
    "gender": "female",
    "eyeColor": "blue",
    "favoriteFruit": "strawberry",
    "company": {
      "title": "KRAGGLE",
      "email": "sherijensen@kraggle.com",
      "phone": "+1 (900) 583-3961",
      "location": {
        "country": "USA",
        "address": "873 Lake Street"
      }
    },
    "tags": ["nostrud", "minim"]
  },
]
```

---

## Learning Instance 1:

### Created a pipeline to get all the active users from the database

```jsx
// pipeline
[
  {
    $match: {
      isActive: true,
    },
  },
  {
    $count: "Number Of Active Users"
  }
]

// output
{
  "Number Of Active Users": 516
}
```

### Learnings from this instance

- Understood stages in pipelines
- Understood how the flow of pipelines work and how data travels
- $match operator
- $count operator

---

## Learning Instance 2 ($group use):

### 1. Created a pipeline to get average age of all users

```jsx
// pipeline
[
  {
    $group: {
      _id: null,
      averageAge: {
        $avg: "$age"
      }
    }
  }
]

// output
{
  "_id": null,
  "averageAge": 29.835
}
```

### Learnings from this instance

- $group operator
    - The null as a value selects all the documents with no grouping.
    - “$fieldName” is given to group by a certain field in documents
- $avg operator

### 2. Created a pipeline to put age of all users in different respective group, but also get documents that were grouped by $group

```jsx
// pipeline
[
  {
    $group: {
      _id: "$age",
      documents: {
        $push: { $mergeObjects: "$$ROOT" }, // get the complete documents
      },
    },
  },
]

// output
{
	_id: 32
	data: Array(38) // there are 38 documents that are 32 of age.
	
	_id: 35
	data: Array(51) // there are 51 documents that are 35 of age.

	_id: 20
	data: Array(46)
}
```

### Learnings from this instance

- $push operator //creates a array and pushes the defined value in array.
- $$ROOT, it represents the original document, using this the original document can be accessed.
- $mergeObjects
    - **Mechanism:**
        1. **Deep copy:** When you use `$mergeObjects: "$$ROOT"` inside the `$push` operator, it essentially creates a deep copy of the entire original document (represented by `$$ROOT`). This means a new object is created that has the same field names and nesting arrangements as the source document.
        2. **Integration into the array:** This deep copy is then added to the `documents` array within the group object.
        
        **Result:**
        
        - Within each group, the `documents` array now holds objects that **mirror the original documents' structure exactly**. All fields and their hierarchical relationships are faithfully replicated.
        
        **Key takeaway:**
        
        - `$mergeObjects` is useful when you need to group documents while preserving their complete structure, ensuring that the resulting grouped documents maintain the same layout as the original ones.
        
        **Important caveat:**
        
        - While `$mergeObjects` preserves structure, it also prioritizes the **last merged document's value** for any fields with the same name across documents in the same group. This can lead to value overwrites, so be mindful if you need to retain multiple values for the same field.

### 3. Created a pipeline to get top 2 common fruits among all users

```jsx
// pipeline
[
  {
    '$group': {
      '_id': '$favoriteFruit', 
      'count': {
        '$sum': 1
      }
    }
  },
	{
    '$sort': {
      'count': 1
    }
  },
	{
    '$limit': 2
  }
]

// output
{
  "_id": "strawberry",
  "count": 323

  "_id": "apple",
  "count": 338
}
```

### Learnings from this instance

- $sum operator
- $limit operator
- $sort operator

### 4. Created a pipeline to know which top countries most common users come from

```jsx
// pipeline
[
  {
    $group: {
      _id: "$company.location.country", //drill down the nested objects
      count: {
        $sum: 1,
      },
    },
  },
  {
    $sort: {
      count: 1,
    },
  },
]

// output
{
  "_id": "Germany",
  "count": 261
}
{
  "_id": "USA",
  "count": 255
}
{
  "_id": "France",
  "count": 245
}
{
  "_id": "Italy",
  "count": 239
}

```

### Learnings from this instance

- Drill down to get nested objects using “.” operator

### 5. Created a pipeline to know the number of tags & name of tags per user

```jsx
db.getCollection('users').aggregate(
  [
    { $unwind: { path: '$tags' } },
    {
      $group: {
        _id: '$_id',
        countOfTags: { $sum: 1 },
        nameOfTags: { $push: '$tags' }
      }
    }
  ],
);

// output
{
  "_id": {
    "$oid": "65c5ce3d1a51d0cdf7ff2d2c"
  },
  "countOfTags": 2,
  "nameOfTags": [
    "reprehenderit",
    "elit"
  ]
}
```

### Learnings from this instance

- $unwind
- Understood that $mergeObjects cannot be used when there are multiple items in a array it will return only the last item by default.
    - **Understanding `$mergeObjects` in `$group`:**
        - It merges documents within a group, but it only considers the **last document encountered** for each field.
        - It doesn't create an array of merged documents; it merges them into a single object.

### 6. Created a pipeline to know the number of tags & total average of tags in whole collection

```jsx
[
  {
    $addFields: {
      numberOfTags: {
        $size: { $ifNull: ["$tags", []] },
      },
    },
  },
  {
    $group: {
      _id: null,
      Average: {
        $avg: "$numberOfTags",
      },
    },
  },
]

// output 
{
  "_id": null,
  "Average": 3.556
}
```

### Learnings from this instance

- $ifNull
- $addFields

---

## Learning Instance 3 ($match, $project):

### 1. Create a pipeline to get all the users with a specific tag

```jsx
[
  {
    $match: {
      tags: "ad"
    }
  },
  {
    $count: 'docWith ad Tag'
  }
]

// output
{
  "docWith ad Tag": 54
}
```

### Learnings from this instance

- $match
- $count

### 2. Create a pipeline to get name & age of all the users with a specific tag & each user must be not active

```jsx
[
  {
    $match: {
      isActive: false,
    },
  },
  {
    $match: {
      tags: "velit",
    },
  },
  {
    $group: {
      _id: null,
      name: {
        $push: {
          name: "$name",
          age: "$age",
        },
      },
    },
  },
]

// OR

[
  {
    $match: {
      isActive: false,
			tags: "velit"
    },
  },
  {
    $group: {
      _id: null,
      name: {
        $push: {
          name: "$name",
          age: "$age",
        },
      },
    },
  },
]
```

### Output Of Code

```jsx
{
  "_id": null,
  "name": [
    {
      "name": "Aurelia Gonzales",
      "age": 20
    },
    {
      "name": "Hahn Pope",
      "age": 21
    },
    {
      "name": "Milagros Levy",
      "age": 33
    },
    {
      "name": "Briana Flores",
      "age": 36
    },
    {
      "name": "Berry Marsh",
      "age": 26
    },
    {
      "name": "Becker Lara",
      "age": 32
    },
    {
      "name": "Obrien Tucker",
      "age": 20
    },
    {
      "name": "Mcclure Potter",
      "age": 39
    },
    {
      "name": "Lenore Mccullough",
      "age": 40
    },
    {
      "name": "Ferrell Pollard",
      "age": 23
    },
    {
      "name": "Barbara Battle",
      "age": 38
    },
    {
      "name": "Tonia Morgan",
      "age": 37
    },
    {
      "name": "Velazquez Carroll",
      "age": 21
    },
    {
      "name": "Eddie Franklin",
      "age": 34
    },
    {
      "name": "Billie Lopez",
      "age": 20
    },
    {
      "name": "Lillie Lloyd",
      "age": 30
    },
    {
      "name": "Leta Foreman",
      "age": 21
    },
    {
      "name": "Thompson Hewitt",
      "age": 38
    },
    {
      "name": "Janelle Calhoun",
      "age": 23
    },
    {
      "name": "Adams Hernandez",
      "age": 32
    },
    {
      "name": "Stephanie Torres",
      "age": 26
    },
    {
      "name": "Massey Parrish",
      "age": 36
    },
    {
      "name": "Mcleod Gomez",
      "age": 38
    },
    {
      "name": "Hendricks Church",
      "age": 29
    },
    {
      "name": "Turner Dale",
      "age": 23
    },
    {
      "name": "Shana Fry",
      "age": 39
    },
    {
      "name": "Carrillo Mccarty",
      "age": 31
    },
    {
      "name": "Valenzuela Mcknight",
      "age": 28
    },
    {
      "name": "Britney Bell",
      "age": 39
    }
  ]
}
```

### Learnings from this instance

- Complex use of $match & &group & $push

### 2.1 Create a pipeline to get name & age of all the users with a specific tag & each user must be not active (using $project)

```jsx
[
  {
    $match: {
      isActive: false,
      tags: "velit"
    },
  },
  {
    $project: {
      name: 1,
      age: 1
    }
  }
]

// output
{
  "_id": {
    "$oid": "65c5ce3d1a51d0cdf7ff2ca2"
  },
  "name": "Aurelia Gonzales",
  "age": 20
}
```

### Learnings from this instance

- $project

### 3. Create a pipeline to get the count of users that have their phone starting from +1 (940)

```jsx
[
  {
    $match: {
      "company.phone": /^\+1 \(940\)/,
    },
  },
  {
    $count: 'Prefix Phone'
  }
]

// output
{
  "Prefix Phone": 5
}
```

### Learnings from this instance

- using . operator to get a nested field
- using regular expression to do the logic

---

## Learning Instance 4 ($all)

### 1. Create a pipeline to find top 5 most registered users in database

**Way 1**

```jsx
[
  {
    $sort: {
      registered: -1
    }
  },
  {
    $limit: 5
  },
  {
    $project: {
      name: 1,
      age: 1,
      registered: 1,
    }
  }
]

// output

{
  "_id": {
    "$oid": "65c5ce3d1a51d0cdf7ff2f64"
  },
  "name": "Stephenson Griffith",
  "age": 22
}
{
  "_id": {
    "$oid": "65c5ce3d1a51d0cdf7ff2e55"
  },
  "name": "Sonja Galloway",
  "age": 33
}
// and..so on.....
```

### Learnings from this instance

- How to use $sort on fields with date/ time.

**Way 2**

```jsx
[
  {
    $sort: {
      registered: -1,
    },
  },
  {
    $limit: 5,
  },
  {
    $group: {
      _id: null,
      latestUsers: {
        $push: {
          name: "$name",
          age: "$age",
          registered: "$registered",
        },
      },
    },
  },
]

```

### Output

```jsx
{
  "_id": null,
  "latestUsers": [
    {
      "name": "Stephenson Griffith",
      "age": 22,
      "registered": {
        "$date": "2018-04-14T03:16:20.000Z"
      }
    },
    {
      "name": "Sonja Galloway",
      "age": 33,
      "registered": {
        "$date": "2018-04-11T12:52:12.000Z"
      }
    },
    {
      "name": "Mcpherson Christensen",
      "age": 28,
      "registered": {
        "$date": "2018-04-11T07:18:42.000Z"
      }
    },
    {
      "name": "Mamie Bradford",
      "age": 20,
      "registered": {
        "$date": "2018-04-09T04:54:20.000Z"
      }
    },
    {
      "name": "Elisabeth Adams",
      "age": 34,
      "registered": {
        "$date": "2018-04-09T03:38:27.000Z"
      }
    }
  ]
}
```

### Learnings from this instance

- How to use $group to make a new field in group, which has a array of objects as value which contains the specific selected fields in it.

### 2. Create a pipeline to get only those users whose tags array has “ad” as value at “1” index

```jsx
[
  {
    $match: {
      "tags.1" : "ad"
    }
  },
  {
    $count: 'ad At idx 1'
  }
]

// output
{
  "ad At idx 1": 12
}

```

### Learnings from this instance

- To use $match with . operator to access the particular index of a array
- $match is mostly used with arrays i think. it automatically iterates on arrays making things easier.

### 3. Create a pipeline to get only those users whose tags array has both “ad” & “enim” in it.

```jsx
[
  {
    $match: {
      tags: {
        $all: ["ad", "enim"],
      },
    },
  },
]

// output
{
  "_id": {
    "$oid": "65c5ce3d1a51d0cdf7ff2ca2"
  },
  "index": 0,
  "name": "Aurelia Gonzales",
  "isActive": false,
  "registered": {
    "$date": "2015-02-11T04:22:39.000Z"
  },
  "age": 20,
  "gender": "female",
  "eyeColor": "green",
  "favoriteFruit": "banana",
  "company": {
    "title": "YURTURE",
    "email": "aureliagonzales@yurture.com",
    "phone": "+1 (940) 501-3963",
    "location": {
      "country": "USA",
      "address": "694 Hewes Street"
    }
  },
  "tags": [
    "enim",
    "id",
    "velit",
    "ad",
    "consequat"
  ]
}
// ... so on ...
```

### Learnings from this instance

- To use $match with $all operator

### 4. Create a pipeline to get only those users whose tags array has both “ad” & “enim” in it.

```jsx
[
  {
    $match: {
      "company.location.country": "USA",
    },
  },
  {
    $group: {
      _id: null,
      companies: {
        $push: {
          company: "$company.title",
          location: "$company.location.country",
        },
      },
    },
  },
]

```

### Output → Large In Size

```jsx
{
  "_id": null,
  "companies": [
    {
      "company": "YURTURE",
      "location": "USA"
    },
    {
      "company": "RODEMCO",
      "location": "USA"
    },
    {
      "company": "OVOLO",
      "location": "USA"
    },
    {
      "company": "CANDECOR",
      "location": "USA"
    },
    {
      "company": "JAMNATION",
      "location": "USA"
    },
    {
      "company": "PHARMEX",
      "location": "USA"
    },
    {
      "company": "INVENTURE",
      "location": "USA"
    },
    {
      "company": "PARAGONIA",
      "location": "USA"
    },
    {
      "company": "ELENTRIX",
      "location": "USA"
    },
    {
      "company": "NEPTIDE",
      "location": "USA"
    },
    {
      "company": "RECRISYS",
      "location": "USA"
    },
    {
      "company": "TURNABOUT",
      "location": "USA"
    },
    {
      "company": "FIREWAX",
      "location": "USA"
    },
    {
      "company": "SULTRAXIN",
      "location": "USA"
    },
    {
      "company": "ROUGHIES",
      "location": "USA"
    },
    {
      "company": "SATIANCE",
      "location": "USA"
    },
    {
      "company": "CONJURICA",
      "location": "USA"
    },
    {
      "company": "JOVIOLD",
      "location": "USA"
    },
    {
      "company": "TECHMANIA",
      "location": "USA"
    },
    {
      "company": "EGYPTO",
      "location": "USA"
    },
    {
      "company": "RECOGNIA",
      "location": "USA"
    },
    {
      "company": "EPLODE",
      "location": "USA"
    },
    {
      "company": "BIZMATIC",
      "location": "USA"
    },
    {
      "company": "ZIALACTIC",
      "location": "USA"
    },
    {
      "company": "ECOLIGHT",
      "location": "USA"
    },
    {
      "company": "AUSTECH",
      "location": "USA"
    },
    {
      "company": "HIVEDOM",
      "location": "USA"
    },
    {
      "company": "BIFLEX",
      "location": "USA"
    },
    {
      "company": "MAINELAND",
      "location": "USA"
    },
    {
      "company": "ANIMALIA",
      "location": "USA"
    },
    {
      "company": "STUCCO",
      "location": "USA"
    },
    {
      "company": "NEOCENT",
      "location": "USA"
    },
    {
      "company": "PROXSOFT",
      "location": "USA"
    },
    {
      "company": "KNEEDLES",
      "location": "USA"
    },
    {
      "company": "DAYCORE",
      "location": "USA"
    },
    {
      "company": "FUTURIS",
      "location": "USA"
    },
    {
      "company": "ZAPHIRE",
      "location": "USA"
    },
    {
      "company": "EXOSIS",
      "location": "USA"
    },
    {
      "company": "ZENTRY",
      "location": "USA"
    },
    {
      "company": "EVENTAGE",
      "location": "USA"
    },
    {
      "company": "MAGNEMO",
      "location": "USA"
    },
    {
      "company": "GADTRON",
      "location": "USA"
    },
    {
      "company": "CIRCUM",
      "location": "USA"
    },
    {
      "company": "DOGTOWN",
      "location": "USA"
    },
    {
      "company": "KOZGENE",
      "location": "USA"
    },
    {
      "company": "ZILLAR",
      "location": "USA"
    },
    {
      "company": "BITENDREX",
      "location": "USA"
    },
    {
      "company": "SLAX",
      "location": "USA"
    },
    {
      "company": "HOUSEDOWN",
      "location": "USA"
    },
    {
      "company": "ARCHITAX",
      "location": "USA"
    },
    {
      "company": "LEXICONDO",
      "location": "USA"
    },
    {
      "company": "KIOSK",
      "location": "USA"
    },
    {
      "company": "CONCILITY",
      "location": "USA"
    },
    {
      "company": "VALREDA",
      "location": "USA"
    },
    {
      "company": "OCTOCORE",
      "location": "USA"
    },
    {
      "company": "CALCU",
      "location": "USA"
    },
    {
      "company": "SIGNIDYNE",
      "location": "USA"
    },
    {
      "company": "PROFLEX",
      "location": "USA"
    },
    {
      "company": "ISOPLEX",
      "location": "USA"
    },
    {
      "company": "SENTIA",
      "location": "USA"
    },
    {
      "company": "VERAQ",
      "location": "USA"
    },
    {
      "company": "AEORA",
      "location": "USA"
    },
    {
      "company": "HONOTRON",
      "location": "USA"
    },
    {
      "company": "VANTAGE",
      "location": "USA"
    },
    {
      "company": "EARTHWAX",
      "location": "USA"
    },
    {
      "company": "ENVIRE",
      "location": "USA"
    },
    {
      "company": "GEEKOL",
      "location": "USA"
    },
    {
      "company": "TASMANIA",
      "location": "USA"
    },
    {
      "company": "PLASTO",
      "location": "USA"
    },
    {
      "company": "SPEEDBOLT",
      "location": "USA"
    },
    {
      "company": "BRAINCLIP",
      "location": "USA"
    },
    {
      "company": "KOOGLE",
      "location": "USA"
    },
    {
      "company": "ZAJ",
      "location": "USA"
    },
    {
      "company": "COMCUR",
      "location": "USA"
    },
    {
      "company": "DIGIQUE",
      "location": "USA"
    },
    {
      "company": "ISOSURE",
      "location": "USA"
    },
    {
      "company": "TELPOD",
      "location": "USA"
    },
    {
      "company": "PROTODYNE",
      "location": "USA"
    },
    {
      "company": "FARMEX",
      "location": "USA"
    },
    {
      "company": "ISOSPHERE",
      "location": "USA"
    },
    {
      "company": "AQUOAVO",
      "location": "USA"
    },
    {
      "company": "BILLMED",
      "location": "USA"
    },
    {
      "company": "ORBIN",
      "location": "USA"
    },
    {
      "company": "KRAGGLE",
      "location": "USA"
    },
    {
      "company": "EXERTA",
      "location": "USA"
    },
    {
      "company": "COFINE",
      "location": "USA"
    },
    {
      "company": "IMAGEFLOW",
      "location": "USA"
    },
    {
      "company": "DEEPENDS",
      "location": "USA"
    },
    {
      "company": "XINWARE",
      "location": "USA"
    },
    {
      "company": "DATACATOR",
      "location": "USA"
    },
    {
      "company": "APPLIDEC",
      "location": "USA"
    },
    {
      "company": "VIRVA",
      "location": "USA"
    },
    {
      "company": "MINGA",
      "location": "USA"
    },
    {
      "company": "PLAYCE",
      "location": "USA"
    },
    {
      "company": "IMAGINART",
      "location": "USA"
    },
    {
      "company": "SOPRANO",
      "location": "USA"
    },
    {
      "company": "EVENTIX",
      "location": "USA"
    },
    {
      "company": "LUDAK",
      "location": "USA"
    },
    {
      "company": "PORTICA",
      "location": "USA"
    },
    {
      "company": "SPACEWAX",
      "location": "USA"
    },
    {
      "company": "MOREGANIC",
      "location": "USA"
    },
    {
      "company": "COMTREK",
      "location": "USA"
    },
    {
      "company": "ZENSURE",
      "location": "USA"
    },
    {
      "company": "TRIPSCH",
      "location": "USA"
    },
    {
      "company": "ACCIDENCY",
      "location": "USA"
    },
    {
      "company": "MOMENTIA",
      "location": "USA"
    },
    {
      "company": "GLUID",
      "location": "USA"
    },
    {
      "company": "COMFIRM",
      "location": "USA"
    },
    {
      "company": "TRANSLINK",
      "location": "USA"
    },
    {
      "company": "INDEXIA",
      "location": "USA"
    },
    {
      "company": "BYTREX",
      "location": "USA"
    },
    {
      "company": "TURNLING",
      "location": "USA"
    },
    {
      "company": "KAGE",
      "location": "USA"
    },
    {
      "company": "GENEKOM",
      "location": "USA"
    },
    {
      "company": "GALLAXIA",
      "location": "USA"
    },
    {
      "company": "INSURITY",
      "location": "USA"
    },
    {
      "company": "AMTAP",
      "location": "USA"
    },
    {
      "company": "HAWKSTER",
      "location": "USA"
    },
    {
      "company": "QUILK",
      "location": "USA"
    },
    {
      "company": "ZYPLE",
      "location": "USA"
    },
    {
      "company": "PLEXIA",
      "location": "USA"
    },
    {
      "company": "EXOSPEED",
      "location": "USA"
    },
    {
      "company": "DANJA",
      "location": "USA"
    },
    {
      "company": "ZAPPIX",
      "location": "USA"
    },
    {
      "company": "BOILCAT",
      "location": "USA"
    },
    {
      "company": "ASSITIA",
      "location": "USA"
    },
    {
      "company": "CUBICIDE",
      "location": "USA"
    },
    {
      "company": "TOURMANIA",
      "location": "USA"
    },
    {
      "company": "MEMORA",
      "location": "USA"
    },
    {
      "company": "NSPIRE",
      "location": "USA"
    },
    {
      "company": "EQUITOX",
      "location": "USA"
    },
    {
      "company": "ENERFORCE",
      "location": "USA"
    },
    {
      "company": "ACCRUEX",
      "location": "USA"
    },
    {
      "company": "CRUSTATIA",
      "location": "USA"
    },
    {
      "company": "PROSELY",
      "location": "USA"
    },
    {
      "company": "SNIPS",
      "location": "USA"
    },
    {
      "company": "SILODYNE",
      "location": "USA"
    },
    {
      "company": "ZOGAK",
      "location": "USA"
    },
    {
      "company": "MIXERS",
      "location": "USA"
    },
    {
      "company": "JASPER",
      "location": "USA"
    },
    {
      "company": "PORTICO",
      "location": "USA"
    },
    {
      "company": "PROWASTE",
      "location": "USA"
    },
    {
      "company": "POWERNET",
      "location": "USA"
    },
    {
      "company": "SARASONIC",
      "location": "USA"
    },
    {
      "company": "COMVEYER",
      "location": "USA"
    },
    {
      "company": "SYNKGEN",
      "location": "USA"
    },
    {
      "company": "ZAGGLE",
      "location": "USA"
    },
    {
      "company": "KINDALOO",
      "location": "USA"
    },
    {
      "company": "BIOSPAN",
      "location": "USA"
    },
    {
      "company": "TOYLETRY",
      "location": "USA"
    },
    {
      "company": "GEEKY",
      "location": "USA"
    },
    {
      "company": "PHOTOBIN",
      "location": "USA"
    },
    {
      "company": "NORSUP",
      "location": "USA"
    },
    {
      "company": "SENMEI",
      "location": "USA"
    },
    {
      "company": "MEDIFAX",
      "location": "USA"
    },
    {
      "company": "ZILLACON",
      "location": "USA"
    },
    {
      "company": "QUINTITY",
      "location": "USA"
    },
    {
      "company": "ECLIPTO",
      "location": "USA"
    },
    {
      "company": "PLASMOSIS",
      "location": "USA"
    },
    {
      "company": "STREZZO",
      "location": "USA"
    },
    {
      "company": "BIOHAB",
      "location": "USA"
    },
    {
      "company": "WEBIOTIC",
      "location": "USA"
    },
    {
      "company": "LINGOAGE",
      "location": "USA"
    },
    {
      "company": "NURPLEX",
      "location": "USA"
    },
    {
      "company": "XIIX",
      "location": "USA"
    },
    {
      "company": "OBLIQ",
      "location": "USA"
    },
    {
      "company": "TSUNAMIA",
      "location": "USA"
    },
    {
      "company": "ZIPAK",
      "location": "USA"
    },
    {
      "company": "VISUALIX",
      "location": "USA"
    },
    {
      "company": "HINWAY",
      "location": "USA"
    },
    {
      "company": "ZILIDIUM",
      "location": "USA"
    },
    {
      "company": "XERONK",
      "location": "USA"
    },
    {
      "company": "KYAGURU",
      "location": "USA"
    },
    {
      "company": "ASSISTIX",
      "location": "USA"
    },
    {
      "company": "BLEEKO",
      "location": "USA"
    },
    {
      "company": "POLARAX",
      "location": "USA"
    },
    {
      "company": "ATOMICA",
      "location": "USA"
    },
    {
      "company": "YOGASM",
      "location": "USA"
    },
    {
      "company": "TERRAGO",
      "location": "USA"
    },
    {
      "company": "PETIGEMS",
      "location": "USA"
    },
    {
      "company": "RODEOCEAN",
      "location": "USA"
    },
    {
      "company": "RONELON",
      "location": "USA"
    },
    {
      "company": "ESSENSIA",
      "location": "USA"
    },
    {
      "company": "ANARCO",
      "location": "USA"
    },
    {
      "company": "SULTRAX",
      "location": "USA"
    },
    {
      "company": "ENERSOL",
      "location": "USA"
    },
    {
      "company": "DOGSPA",
      "location": "USA"
    },
    {
      "company": "PYRAMIS",
      "location": "USA"
    },
    {
      "company": "ECLIPSENT",
      "location": "USA"
    },
    {
      "company": "KENEGY",
      "location": "USA"
    },
    {
      "company": "QUALITERN",
      "location": "USA"
    },
    {
      "company": "COMTOUR",
      "location": "USA"
    },
    {
      "company": "XUMONK",
      "location": "USA"
    },
    {
      "company": "LIMOZEN",
      "location": "USA"
    },
    {
      "company": "VOIPA",
      "location": "USA"
    },
    {
      "company": "TERSANKI",
      "location": "USA"
    },
    {
      "company": "AUTOMON",
      "location": "USA"
    },
    {
      "company": "KEEG",
      "location": "USA"
    },
    {
      "company": "BESTO",
      "location": "USA"
    },
    {
      "company": "BLUEGRAIN",
      "location": "USA"
    },
    {
      "company": "VOLAX",
      "location": "USA"
    },
    {
      "company": "NETBOOK",
      "location": "USA"
    },
    {
      "company": "PASTURIA",
      "location": "USA"
    },
    {
      "company": "SHOPABOUT",
      "location": "USA"
    },
    {
      "company": "OTHERWAY",
      "location": "USA"
    },
    {
      "company": "ILLUMITY",
      "location": "USA"
    },
    {
      "company": "INTERLOO",
      "location": "USA"
    },
    {
      "company": "QIAO",
      "location": "USA"
    },
    {
      "company": "ZILLADYNE",
      "location": "USA"
    },
    {
      "company": "MARQET",
      "location": "USA"
    },
    {
      "company": "CONFRENZY",
      "location": "USA"
    },
    {
      "company": "ENDIPINE",
      "location": "USA"
    },
    {
      "company": "MANGELICA",
      "location": "USA"
    },
    {
      "company": "AUTOGRATE",
      "location": "USA"
    },
    {
      "company": "OPTICOM",
      "location": "USA"
    },
    {
      "company": "VELITY",
      "location": "USA"
    },
    {
      "company": "GOKO",
      "location": "USA"
    },
    {
      "company": "POOCHIES",
      "location": "USA"
    },
    {
      "company": "GORGANIC",
      "location": "USA"
    },
    {
      "company": "ISOLOGICS",
      "location": "USA"
    },
    {
      "company": "SULFAX",
      "location": "USA"
    },
    {
      "company": "COMSTRUCT",
      "location": "USA"
    },
    {
      "company": "IDETICA",
      "location": "USA"
    },
    {
      "company": "ELECTONIC",
      "location": "USA"
    },
    {
      "company": "MENBRAIN",
      "location": "USA"
    },
    {
      "company": "KIDSTOCK",
      "location": "USA"
    },
    {
      "company": "VINCH",
      "location": "USA"
    },
    {
      "company": "KONGLE",
      "location": "USA"
    },
    {
      "company": "TELLIFLY",
      "location": "USA"
    },
    {
      "company": "UNDERTAP",
      "location": "USA"
    },
    {
      "company": "TALAE",
      "location": "USA"
    },
    {
      "company": "GEEKNET",
      "location": "USA"
    },
    {
      "company": "POLARIA",
      "location": "USA"
    },
    {
      "company": "RAMJOB",
      "location": "USA"
    },
    {
      "company": "PROSURE",
      "location": "USA"
    },
    {
      "company": "KOG",
      "location": "USA"
    },
    {
      "company": "IMMUNICS",
      "location": "USA"
    },
    {
      "company": "ISOLOGIX",
      "location": "USA"
    },
    {
      "company": "SENMAO",
      "location": "USA"
    },
    {
      "company": "XIXAN",
      "location": "USA"
    },
    {
      "company": "SURELOGIC",
      "location": "USA"
    },
    {
      "company": "ZANILLA",
      "location": "USA"
    },
    {
      "company": "MANTRIX",
      "location": "USA"
    },
    {
      "company": "AQUASSEUR",
      "location": "USA"
    },
    {
      "company": "QOT",
      "location": "USA"
    },
    {
      "company": "MEDCOM",
      "location": "USA"
    },
    {
      "company": "VALPREAL",
      "location": "USA"
    },
    {
      "company": "UNQ",
      "location": "USA"
    },
    {
      "company": "IZZBY",
      "location": "USA"
    },
    {
      "company": "TROPOLI",
      "location": "USA"
    },
    {
      "company": "THREDZ",
      "location": "USA"
    },
    {
      "company": "VERTON",
      "location": "USA"
    },
    {
      "company": "VITRICOMP",
      "location": "USA"
    },
    {
      "company": "YURTURE",
      "location": "USA"
    },
    {
      "company": "DIGITALUS",
      "location": "USA"
    }
  ]
}
```

### Learnings from this instance

- To use $match with $all operator

---

## Learning Instance 5 ($lookup, left join)

### MOCK data collections used for $lookup & left join

```jsx
// books collection complete
{
  "_id": 1,
  "title": "The Great Gatsby",
  "author_id": 100,
  "genre": "Classic"
}
{
  "_id": 2,
  "title": "Nineteen Eighty-Four",
  "author_id": 101,
  "genre": "Dystopian"
}
{
  "_id": 3,
  "title": "To Kill a Mockingbird",
  "author_id": 102,
  "genre": "Classic"
}
```

```jsx
// auhors collection complete
{
  "_id": 100,
  "name": "F. Scott Fitzgerald",
  "birth_year": 1896
}
{
  "_id": 101,
  "name": "George Orwell",
  "birth_year": 1903
}
{
  "_id": 102,
  "name": "Harper Lee",
  "birth_year": 1926
}
```

### 1. Create a pipeline to left join using $first

```jsx
[
  {
    $lookup: {
      from: "authors",
      localField: "author_id",
      foreignField: "_id",
      as: "New",
    },
  },
  {
    $addFields: {
      imported_Author: {
        $first: "$New"
      }
    }
  }
]

// output
{
  "_id": 1,
  "title": "The Great Gatsby",
  "author_id": 100,
  "genre": "Classic",
  "New": {
    "_id": 100,
    "name": "F. Scott Fitzgerald",
    "birth_year": 1896
  }
}

// so on...
```

### Learnings from this instance

- Understood the $lookup deeply
- from is the different collection, local field is the current collection’s field, foreign field is another collection’s field, “as” is the name of new field where result will be stored in a array of object.

### 2. Create a pipeline to left using $arrayElemtAt

```jsx
[
  {
    $lookup: {
      from: "authors",
      localField: "author_id",
      foreignField: "_id",
      as: "New",
    },
  },
  {
    $addFields: {
      New: {
        $arrayElemAt: ["$New", 0]
      }
    }
  }
]
```

### Learnings from this instance

- $arrayElemAt, it take a array, where name of array and element index is needed.

---

## Aggregation Pipeline Series Ended.