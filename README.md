# DougTV

### Live @ [dougtv.herokuapp.com](https://dougtv.herokuapp.com/)

[![Heroku](https://heroku-badge.herokuapp.com/?app=dougtv)](https://dougtv.herokuapp.com/)

**DougTV** is a One-To-Many Video Broadcast Full-Stack Web App that allows users to quickly launch a live broadcast video stream and be publicly seen and heard by an audience anywhere in the world!

Built with React.js with Hooks, Node.js with Express, and PostgreSQL. The video broadcast feature is facilitated by socket.io and a WebRTC RTCPeerConnection.

![DougTV Site Walkthrough](https://dougtv.herokuapp.com/DougTV.gif)

## Videos

<a href="http://www.youtube.com/watch?feature=player_embedded&v=MhrdFbG6gCU" target="_blank"><img src="http://img.youtube.com/vi/MhrdFbG6gCU/0.jpg" 
alt="Video Walkthrough Of DougTV" width="240" height="180" border="10" /></a>

* [Video Walkthrough Of DougTV](https://youtu.be/MhrdFbG6gCU)

<a href="http://www.youtube.com/watch?feature=player_embedded&v=fTE690MjbcA" target="_blank"><img src="http://img.youtube.com/vi/fTE690MjbcA/0.jpg" 
alt="Video Walkthrough Of DougTV" width="240" height="180" border="10" /></a>

* [Edge Case Fix For DougTV](https://youtu.be/fTE690MjbcA)

## Features

Users are able to:

* Search for active streams and quickly know if there are no active streams currently available
* Launch a new Broadcast by  
  * Entering a publicly visible display name  
  * Clicking _Connect_ to form stable connection  
  * Clicking _Start Broadcast_ to make the stream publicly visible on the home page
* End a Broadcast by  
  * Clicking _End Broadcast_
* Watch a Broadcast by  
  * Clicking a link to an active stream found on the Home Page  
  * Clicking _Connect_ on the Watch Page

A Manager is able to:

* Delete all disconnected Broadcasters who did not properly End Broadcast by
  * Clicking _Clear Database_ on the top secret Wipeout page

## Future Features

* Live text chat between Broadcaster and Watchers facilitated by socket.io
* Quick share link to the Watch Page listed directly on the Broadcast Page for broadcasters to quickly share on social media when they go live
* Allowing Broadcasters to reconnect to a Broadcast they launch through localstorage
* Secure and encrypted user accounts

## Technical Milestones

* This Full Stack Web App was created as both a tech demo and steppingstone in learning and utilizing WebRTC to launch a one-to-many Video Broadcast
* Lessons learned in creating DougTV were used in the creation of my award winning Pursuit 2020 Capstone Project, [Pantry Party](https://www.pantry-party.com/)
* Understanding what the RTCPeerConnection is and how it can be properly shared behind NAT Servers
* Learning how to collect the ICE credentials from two or more potential connecting peers
* Disabling audio on the Broadcast's video display so a broadcaster isn't bothered by a echo while presenting
* Having an accurate active viewer count displayed on the Broadcast page
* Disabling the _Start Broadcast_ button once a connection has been made and a stream is publicly displayed on the Home Page

## Technologies Used

* **Node.js & Express.js** For the HTTP backend server
* **React.js** For the front-end/client interface of my app
* **PostgreSQL** As my relation database management system
* **pg-promise** For interfacing with my database in my backend code
* **socket.io** For allowing real time real time interactions between two or more peers
* **WebRTC** The RTCPeerConnection is the data stream shared between peers
* **STUN Server** A Google provided simple server that shares the ICE credentials (the public facing IP address) to bypass the NAT Server and permit the RTCPeerConnection
* **CSS3**

## Local Setup

**NOTE: This repo has been configured for deployment on Heroku, but can be run locally after a few adjustments.**

You must install [Node.js](https://nodejs.org) as well as [PostgreSQL](https://www.postgresql.org/) in your computer.

You can check for these dependencies with `node -v` and `psql -v`. If your shell/terminal doesn't complain and you see version numbers you are good to go.

1. Clone this repo into a folder of your choice:
```
       git clone https://github.com/DouglasMacKrell/DougTV.git
```

2. Install dependencies for the Node/Express Server:
```
       npm install
```

3. Install dependencies for the React App (`client` folder):
```
       cd client && npm install
```

4. Create database and seed sample data. While inside the root directory, open the `seed.sql` file and:

    - Change  
    ```
         DROP TABLE IF exists broadcasters;
    ```

    - to 
    ``` 
         DROP DATABASE IF EXISTS dougtv;  
         CREATE DATABASE dougtv;  
         \c dougtv;
    ```

    - Then seed the new database from the root folder:  
    ```
       cd ..  
       psql -f seed.sql
    ```

> [Make sure PostgreSQL is running!](https://www.google.com/search?q=make+sure+postgres+is+running&oq=make+sure+postf&aqs=chrome.1.69i57j0l5.5280j1j7&client=ubuntu&sourceid=chrome&ie=UTF-8)

5. To launch the Node/Express server, inside the root folder run:
```
       npm start
```

6. Before you can launch the React App, you must target the ENDPOINT of the socket.io server within the three files that use this connection. In the `client` => `src` => `components` folder, open the `Broadcast.jsx` file within the `Broadcast` folder.

    - On line 28, change  
    ```
         const ENDPOINT = "https://dougtv.herokuapp.com/";
    ```

    - to  
    ```
         const ENDPOINT = "http://127.0.0.1:4004";
    ```

7. Next, from the `components` folder, open `Join.jsx` within the `Join` folder.

    - On line 13, change  
    ```
         const ENDPOINT = "https://dougtv.herokuapp.com/";
    ```

    - to  
    ```
         const ENDPOINT = "http://127.0.0.1:4004";
    ```

8. Finally, from the `components` folder, open `Watch.jsx` within the `Watch` folder.

    - On line 18, change  
    ```
         const ENDPOINT = "https://dougtv.herokuapp.com/";
    ```

    - to  
    ```
         const ENDPOINT = "http://127.0.0.1:4004";
    ```

9. To launch the React App, inside the `client` folder, and preferably in another terminal window run:
```
       npm start
```

10. A new browser tab should have been opened and the App should be running. If that is not the case check the terminals output for errors, if you are unable to troubleshoot the problem, I would be happy to address issues so open [one](/issues)

---

### Please check out my other work at [DouglasMacKrell.com](https://douglasmackrell.com)

---

[![DougTV Social Media](https://dougtv.herokuapp.com/DougTV-Social.png)](https://dougtv.herokuapp.com)

** **

<details>
    <summary>
        Before you leave, please take note:
    </summary>

You're the best! Thank you for visiting!

Please give this project a star and be sure to check out my [YouTube Channel](https://youtube.com/BigMacKrell)!

</details>
