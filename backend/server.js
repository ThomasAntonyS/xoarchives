const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config()


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const allowedOrigins = [
  "http://localhost:5173",
  "https://xoarchives.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS policy does not allow this origin"), false);
    }
  },
  credentials: true
}));

app.post('/apod', async(req,res)=>{
  
  const {startDate,endDate} = req.body
  const API_KEY = process.env.NASA_API_KEY

  try {
    const data = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&start_date=${startDate}&end_date=${endDate}`)
    const response = await data.json()
    return res.send(response).status(200);
  } catch (error) {
    console.log("Error Fetcing data")
  }
})

app.get("/", async (req, res) => {
  res.send("Welcome to xoarchive backend.");
});

if (process.env.NODE_ENV !== "production") {
  const PORT = 5000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;