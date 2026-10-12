const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Blog data
const posts = [
  {
    id: 1,
    title: "Learn Node.js",
    slug: "learn-nodejs",
    description: "Learn Node.js basics",
    content: "Node.js lets you run JavaScript outside the browser.",
    status: "published",
    created: new Date().toISOString()
  },
  {
    id: 2,
    title: "Learn React",
    slug: "learn-react",
    description: "Learn React fundamentals",
    content: "React is a JavaScript library for building user interfaces.",
    status: "published",
    created: new Date().toISOString()
  },
  {
    id: 3,
    title: "Express Middleware",
    slug: "express-middleware",
    description: "Learn Express middleware",
    content: "Middleware functions run during the request-response cycle.",
    status: "draft",
    created: new Date().toISOString()
  }
];

// Global logger middleware
app.use((req, res, next) => {
  console.log(
    new Date().toISOString(),
    req.method,
    req.url
  );
  next();
});

// Authentication middleware
const auth = (req, res, next) => {
  const token = req.headers.authorization;

  if (token !== "Bearer my-secret-token") {
    return res.status(401).json({
      message: "Unauthorized! Token required."
    });
  }

  next();
};

// API 1: Get all blogs
app.get("/posts", (req, res) => {
  res.json(posts);
});

// API 2: Get one blog by slug
app.get("/posts/:slug", auth, (req, res) => {
  const post = posts.find(
    (item) => item.slug === req.params.slug
  );

  if (!post) {
    return res.status(404).json({
      message: "Blog not found"
    });
  }

  res.json(post);
});

// Start server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});