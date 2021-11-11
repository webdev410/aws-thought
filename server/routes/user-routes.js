const express = require("express");
const router = express.Router();
const AWS = require("aws-sdk");

const awsConfig = {
	region: "us-east-2",
};

AWS.config.update(awsConfig);
const dynamodb = new AWS.DynamoDB.DocumentClient();
const table = "Thoughts";

// get users thoughts
router.get("/users", (req, res) => {
	const params = {
		TableName: table,
	};
	// Scan return all items in the table
	dynamodb.scan(params, (err, data) => {
		if (err) {
			res.status(500).json(err); // if error occured
		} else {
			res.json(data.Items);
		}
	});
});

// Pass username from client to server
// get thoughts from a user
router.get("/users/:username", (req, res) => {
	console.log(`Querying for thought(s) from ${req.params.username}.`);
	const params = {
		TableName: table,
		KeyConditionExpression: "#un = :user",
		ExpressionAttributeNames: {
			"#un": "username",
			"#ca": "createdAt",
			"#th": "thought",
			"#img": "image", // add the image attribute alias
		},
		ExpressionAttributeValues: {
			":user": req.params.username,
		},
		ProjectionExpression: "#un, #th, #ca, #img", // add the image to the database response
		ScanIndexForward: false, // false makes the order descending(true is default)
	};
	// database call ..
	// Retrieve single user's thoughts from database
	dynamodb.query(params, (err, data) => {
		if (err) {
			console.error(
				"Unable to query. Error:",
				JSON.stringify(err, null, 2)
			);
			res.status(500).json(err);
		} else {
			console.log("Query succeeded.");
			res.json(data.Items); // Response data from the database is located in the Items property
		}
	});
});

// Create Post route for new thought
router.post("/users", (req, res) => {
	const params = {
		TableName: table,
		Item: {
			username: req.body.username,
			createdAt: Date.now(),
			thought: req.body.thought,
			image: req.body.image,
		},
	};
	// database call
	dynamodb.put(params, (err, data) => {
		if (err) {
			console.error(
				"Unable to add item. Error JSON:",
				JSON.stringify(err, null, 2)
			);
			res.status(500).json(err);
		} else {
			console.log("Added item:", JSON.stringify(data, null, 2));
			res.json({ Added: JSON.stringify(data, null, 2) });
		}
	});
});

module.exports = router;
