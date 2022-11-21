const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.90qadcl.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send({ message: "Unauthorized Access" });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.JW_TOKEN, function (err, decoded) {
    
    if (err) {
      return res.status(403).send({ message: "Forbidden Access" });
    }
    req.decoded = decoded;
    next();
  });
};

const run = async () => {
  try {
    const serviceCollection = client.db("Clinox").collection("Services");
    const reviewCollection = client.db("Clinox").collection("Reviews");

    // JW Token
    app.post("/jwt", (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.JW_TOKEN, { expiresIn: "1h" });

      res.send({ token });
    });

    // All services
    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const result = await cursor.toArray();

      res.send(result);
    });

    // service highlight (only 3 service)
    app.get("/servicesH", async (req, res) => {
      const serviceHighlight = JSON.parse(req.query.dataCount);
      const cursor = serviceCollection.find({});
      const result = await cursor.limit(serviceHighlight).toArray();

      res.send(result);
    });

    // Get specific service by id
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await serviceCollection.findOne(query);

      res.send(service);
    });

    // Add Review
    app.post("/reviews", async (req, res) => {
      const reviews = req.body;
      const result = await reviewCollection.insertOne(reviews);

      res.send(result);
    });

    // Find all review by specific service id
    app.get("/reviews/:id", async (req, res) => {
      const serviceId = req.params.id;
      const query = { id: serviceId };
      const cursor = reviewCollection.find(query);
      const result = await cursor.toArray();

      res.send(result);
    });

    // Update review by specific review id
    app.put("/reviews/:id",verifyJWT, async (req, res) => {
      const reviewId = req.params.id;
      const updatedFeedback = req.body.feedback;

      const query = { _id: ObjectId(reviewId) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          feedback: updatedFeedback,
        },
      };
      const result = await reviewCollection.updateOne(
        query,
        updateDoc,
        options
      );

      res.send(result);
    });

    // Find specific review by review id
    app.get("/editReviews/:id", async (req, res) => {
      const reviewId = req.params.id;
      const query = { _id: ObjectId(reviewId) };
      const cursor = reviewCollection.find(query);
      const result = await cursor.toArray();

      res.send(result);
    });

    // Find all review by specific email
    app.post("/myReview", verifyJWT, async (req, res) => {
      const decoded = req.decoded;
     

      if (decoded.email !== req.body.email) {
        res.status(403).send({ message: "Unauthorized Access" });
      }


      let query = {};
      if(req.body.email){
        query = {
          email:req.body.email
        }
      }
      const cursor = reviewCollection.find(query);
      const result = await cursor.toArray();

      res.send(result);
    });

    // Delete review by specific id
    app.delete("/deleteReview/:id",verifyJWT, async (req, res) => {
      const reviewId = req.params.id;
      const query = { _id: ObjectId(reviewId) };
      const result = await reviewCollection.deleteOne(query);

      res.send(result);
    });
  } catch {}
};

run().catch(console.dir);

// Default Root
app.get("/", (req, res) => {
  res.send("Server is Running");
});

// Listen Port
app.listen(port, () => {
  console.log("Server is running on port: ", port);
});
