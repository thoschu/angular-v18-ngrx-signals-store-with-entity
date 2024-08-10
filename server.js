require("dotenv").config()

const express = require("express")
const cors = require("cors")
const webpush = require("web-push")
const bodyParser = require("body-parser")
const path = require("path")

const vapidKeys = webpush.generateVAPIDKeys()
const PORT = process.env.EXPRESS_PORT || 3000

// Create express app.
const app = express()
const subscriptions = new Set()

app.use(cors())

// Use body parser which we will use to parse request body that sending from client.
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// We will store our client files in ./dist directory.
app.use(express.static(path.join(__dirname, "dist/estimateuai/browser")))

const publicVapidKey = vapidKeys.publicKey
const privateVapidKey = vapidKeys.privateKey

// Setup the public and private VAPID keys to web-push library.
webpush.setVapidDetails(process.env.MAILTO, publicVapidKey, privateVapidKey)

// Create route for allow client to subscribe to push notification.
app.post("/subscribe", (req, res) => {
  const subscription = req.body

  console.dir(subscription)

  subscriptions.add(subscription)

  // https://developer.mozilla.org/en-US/docs/Web/API/Notification
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

  subscriptions.forEach((value) => {
    console.log(value)
  })

  webpush
    .sendNotification(subscription, JSON.stringify(notificationPayload), {})
    .then((result) => {
      res.status(201).json(result)
    })
    .catch(console.error)
})

app.listen(PORT, () => {
  console.log("Server started on port " + PORT)
  console.log("vapidKeys: " + JSON.stringify(vapidKeys))

  setInterval(() => {
    const notificationPayload = {
      notification: {
        title: "Angular Update !!!",
        body: "Update Available...",
        data: {},
        requireInteraction: true,
        renotify: true,
      },
    }

    subscriptions.forEach((subscription) => {
      console.log(subscription)

      webpush
        .sendNotification(subscription, JSON.stringify(notificationPayload))
        .then((result) => {
          console.log(result)
        })
        .catch((err) => {
          console.error(err)
          subscriptions.delete(subscription)
        })
    })
  }, 10000)
})
