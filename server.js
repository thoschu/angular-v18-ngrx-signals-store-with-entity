const express = require("express")
const cors = require("cors")
const webpush = require("web-push")
const bodyParser = require("body-parser")
const path = require("path")

const vapidKeys = webpush.generateVAPIDKeys()
const PORT = 3333

// Create express app.
const app = express()

app.use(cors())

// Use body parser which we will use to parse request body that sending from client.
app.use(bodyParser.json())

// We will store our client files in ./dist directory.
// app.use(express.static(path.join(__dirname, "dist")))

const publicVapidKey = vapidKeys.publicKey
const privateVapidKey = vapidKeys.privateKey

// Setup the public and private VAPID keys to web-push library.
webpush.setVapidDetails(
  "mailto:thoschulte@gmail.com",
  publicVapidKey,
  privateVapidKey,
)

// Create route for allow client to subscribe to push notification.
app.post("/subscribe", (req, res) => {
  const subscription = req.body

  const notificationPayload = {
    notification: {
      title: "Angular News",
      body: "Newsletter Available!",
      icon: "https://cdn-icons-png.flaticon.com/512/943/943593.png",
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1,
      },
      actions: [
        {
          action: "explore",
          title: "Go to the site",
        },
      ],
    },
  }

  webpush
    .sendNotification(subscription, JSON.stringify(notificationPayload))
    .then((result) => {
      res.status(201).json(result)
    })
    .catch(console.error)
})

app.listen(PORT, () => {
  console.log("Server started on port " + PORT)
  console.log("vapidKeys: " + JSON.stringify(vapidKeys))
})
