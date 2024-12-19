const express = require("express");
const { google } = require("googleapis");
const cookieParser = require("cookie-parser");
const fs = require("fs");

const app = express();
app.use(cookieParser());
app.use(express.json());

// Load OAuth2 credentials
require("dotenv").config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;



// Initialize OAuth2 Client
const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// Route for Google OAuth login
app.get("/auth", (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/documents.readonly"],
  });
  res.redirect(authUrl);
});

// Route for OAuth2 callback
app.get("/oauth2callback", async (req, res) => {
  const { code } = req.query;
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    res.cookie("tokens", JSON.stringify(tokens)); // Save tokens in a cookie
    res.redirect("http://localhost:3000"); // Redirect to your frontend
  } catch (error) {
    res.status(500).send("Error during authentication");
  }
});

// Route to fetch Google Doc content
app.get("/doc/:docId", async (req, res) => {
  const { docId } = req.params;
  const tokens = JSON.parse(req.cookies.tokens);
  oauth2Client.setCredentials(tokens);

  const docs = google.docs({ version: "v1", auth: oauth2Client });
  try {
    const doc = await docs.documents.get({ documentId: docId });
    res.json(doc.data);
  } catch (error) {
    res.status(500).send("Error fetching document");
  }
});

// Start the server
app.listen(5000, () => {
  console.log("Server running at http://localhost:5000");
});

app.get("/auth", (req, res) => {
  console.log("Auth route hit");
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/documents.readonly"],
  });
  console.log("Generated auth URL:", authUrl); // Log the auth URL
  res.redirect(authUrl);
});

app.get("/oauth2callback", async (req, res) => {
  console.log("OAuth2 callback hit");
  const { code } = req.query;
  try {
    console.log("Authorization code received:", code);
    const { tokens } = await oauth2Client.getToken(code);
    console.log("Tokens received:", tokens); // Log tokens for debugging
    oauth2Client.setCredentials(tokens);
    res.cookie("tokens", JSON.stringify(tokens)); // Save tokens in a cookie
    res.redirect("http://localhost:3000"); // Redirect to your frontend
  } catch (error) {
    console.error("Error during OAuth callback:", error); // Log detailed errors
    res.status(500).send("Error during authentication");
  }
});
