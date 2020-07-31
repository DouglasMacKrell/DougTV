# DougTV

![DougTV Logo and Broadcast Page](https://dougtv.herokuapp.com/static/media/DougTV-Social.82bcc0c1.png)

### Live @ [dougtv.herokuapp.com](https://dougtv.herokuapp.com/)

**DougTV** is a One-To-Many Video Broadcast Full-Stack Web App that allows users to quickly launch a broadcast and be publicly seen and heard by an audience anywhere in the world! 

Built with React.js with Hooks, Node.js with Express, PostgreSQL, and facilitated by socket.io and a WebRTC RTCPeerConnection.

## Features

Users are able to:

* Search for active streams and quickly know if there are no active streams available
* Launch a new Broadcast by 
 * Entering a publicly visible display name
 * 

## Future Features

* Live text chat between Broadcaster and Watchers facilitated by socket.io
* Allowing Broadcasters to reconnect to a Broadcast they launch through localstorage
* Secure and encrypted user accounts

## Technical Milestones
* This Full Stack Web App was created as a tech demo and steppingstone in learning and utilizing WebRTC for a one-to-many Video Broadc

## Technologies Used

* **Node.js & Express.js** For the HTTP backend server.
* **React.js** For the front-end/client interface of our app.
* **PostgreSQL** As our relation database management system.
* **pg-promise** For interfacing with our database in our backend code.
* **socket.io** For allowing real time real time interactions between two or more peers.
* **WebRTC** The RTCPeerConnection is the data stream shared between peers.
* **STUN Server** A Google provided simple server that shares the ICE credentials (the public facing IP address) to bypass the NAT Server and permit the RTCPeerConnection.
* **CSS3**

## Local Setup

You must have installed [Node.js](https://nodejs.org) as well as [PostgreSQL](https://www.postgresql.org/) in your computer.

You can check for these dependencies with `node -v` and `psql -v`. If your shell/terminal doesn't complain and you see version numbers you are good to go.

  1. Clone this repo and change directory to it: 

         git clone git@github.com:alejo4373/GameOn.git && cd GameOn 

  2. Install dependencies for the Node/Express Server (`backend` folder):

         cd backend && npm install

  3. Install dependencies the React App (`frontend` folder):

         cd frontend && npm install

  4. Create database and seed sample data while being in the `GameOn` directory with:

         psql -f ./backend/db/GameOnDB.sql
        > [Make sure PostgreSQL is running!](https://www.google.com/search?q=make+sure+postgres+is+running&oq=make+sure+postf&aqs=chrome.1.69i57j0l5.5280j1j7&client=ubuntu&sourceid=chrome&ie=UTF-8)

  5. To launch the Node/Express server, inside the `backend` folder run: 

          npm start

  6. To launch the React App, inside the `frontend` folder, and preferably in another terminal window run: 

          npm start

  7. A new browser tab should have been opened and the App should be running. If that is not the case check the terminals output for errors, if you are unable to troubleshoot the problem, I would be happy to address issues so open [one](/issues)