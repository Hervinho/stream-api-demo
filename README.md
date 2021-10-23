This is base structure for all my Node.js with MongoDB backend projects.

We are using Express and Mongoose for the database.

We have 4 models in the database:
- User: to store user/account information
- Profile: to store all profiles linked to a certain user/account
- Video: to store all videos information
- WatchLog: to store streaming data, i.e. what video is being watched by what user/account, on which profile and at what time.

The idea is that when a profile starts watching a video, an API call will be made to check if the user/account is already streaming. If there are already 3 streams, user cannot stream. Otherwise user can stream.

When user starts streaming, an API call is made to insert data into the watchLog database. That data includes userID, profileID, videoID and the current timestamp. API first checks if there already is an entry for the same profile and video, if so then we just update the timestamp to make sure we only have the latest entry for the specific profile and video (usser/profile/video). If not then we create a new entry.

Ideally in the real-world, while watching a video, watch log data should be created in real-time or near real-time, using memcached or Redis instead of direct read/write from DB. But for the purpose of this small demo, I went with the logic to assume that to be every 10 seconds. Meaning, while the user is streaming, the system is meant to call the watchLog API (POST /api/watchlogs) at every 10 second mark to update our watch logs providing the userID (or account ID), the profile ID and the video ID. So there will always be a unique entry for each profile

So when another profile to the same user/account is about to stream, the API GET /api/watchlogs/latest/users/:id will receive the userID and check how many entries in the watchLog table we have for the given user (account) within the last 10 seconds, regardless of which profile is streaming. If we have more than 3 records for that user (account) within the last 10 seconds, the user cannot start a new streaming and proper message will be returned. Otherwise the user can start streaming.

Additional information
- A dump of the Mongo database is provided under the db-dump/stream_demo folder
- Logs will be found under logs folder (only logging errors but anything can be logged)
- There's a daily rotate of log files, and max size is 20MB
- JSON Postman collection to test APIs is provided in the root folder of the app (Stream-demo.postman_collection.json)
- For deployment, run build.sh will will install dependencies and create a .zip for the project.
  Use scripts under scripts folder to start/stop app when it's deployed.
- To run app on local environment: npm run server