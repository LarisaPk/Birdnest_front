# Project Title

**Birdnest_frontend**

Project for the Reaktor Developer Trainee, summer 2023 application. Frontend.

## Table of Contents

- [About](#about)
- [Objectives](#objectives)
- [Application structure](#application_structure)
- [Getting Started](#getting_started)
- [Installation](#installing)
- [Usage](#usage)
- [Deployed version](#deployed)
- [Author](#author)

## About

This is the pre-assignment project for Reaktor's Developer Trainee, summer 2023 programme.

According to the pre-assignment, there is a birdnest of a very rare bird. Territory arround it is monitored by the equipment that locates drones presistance. Territorry with the 100 meters raduis and the birdnest in the center stated as No Fly Zone for the drones. The goal is to create an application that will display a list of pilots who ricently violated No Fly Zone.

### Given data:

- Drone positions : GET assignments.reaktor.com/birdnest/drones
  Updated about once every 2 seconds. The equipment is set up right next to the nest. XML format.
- Pilot information : GET assignments.reaktor.com/birdnest/pilots/:serialNumber
  Only query this information for the drones violating the NDZ. Sometimes pilot information may not be found, indicated by a 404 status code.
- The position of the drones are reported as X and Y coordinates, both floating point numbers between 0-500000 (within a 500 by 500 meter square)
- The no-fly zone is a circle with a 100 meter radius, origin at position 250000,250000

Full text of the pre-assingment task can be found here: https://assignments.reaktor.com/birdnest/

This is the Frontend of the project.
Backend can be found here: https://github.com/LarisaPk/Birdnest_back

## Objectives

### Objectives of the pre-assignment

Build and deploy a web application which lists all the pilots who recently violated the NDZ perimeter.

- Persist the pilot information for 10 minutes since their drone was last seen by the equipment
- Display the closest confirmed distance to the nest
- Contain the pilot's name, email address and phone number
- Immediately show the information from the last 10 minutes to anyone opening the application
- Not require the user to manually refresh the view to see up-to-date information

### Objectives of this frontend project

- Repeatedly fetch and display all drones postions data to visualise the current situation arount the birdnest.
- Repeatedly fetch updated pilots information and display it in the table.

## Application structure

This application is done with React, a JavaScript library for building user interfaces (https://reactjs.org/)

Application has an App component that fecthes data and passes it in props to two children components that used to display data.

- Canvas component uses HTML canvas to display position of the nest and drones
- PilotsList component uses Material UI (https://mui.com/) table to display pilots infromation.

How data is fetched:

- All drones and pilots data is fetched on first render and set in state.
- All drones data then fetched every time when state changes, with 2 seconds timeout.
- Pilots info data is fetched every time when state changes with 10 seconds timeout, since it is not nesessarylly needed to fetch it more often. It can be changed if needed.

No new API calls created before old once get to be resolved or cancelled. To avoid having more requests in the queue that could be processd. For example if the Internet speed is slow. (Downside of this is that backend deployed on free service will not work with the desired frequency and will send fewer requests to the external API than it should. But this is what we get for free...)

## Getting Started

### Prerequisites

- Node.js
  Check that you are running the latest version of Node on your computer. Run the command `node -v` in your console to see which version you have running. If its less than 18 then you need to upgrade.

- npm (installed together with Node.js) to check version run `npm -v`<br />
  Link to Node.js installation: https://nodejs.org/en/

### Installation

- Download data from a remote repository. (Using `git clone https://github.com/LarisaPk/Birdnest_front.git` or "Download ZIP" option in GitHub repo)<br />
  See instructions: https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository<br />
- Create .env file in the root of the project. Add following to the file (links to the external APIs):

```
VITE_DRONESAPI = "http://localhost:3001/api/drones/now"
VITE_PILOTSAPI = "http://localhost:3001/api/pilots"
```

- Go to the project root directory using CLI and run `npm install`

- Download and start the backend. See instructions in README file here: https://github.com/LarisaPk/Birdnest_back

Everything should be installed now.

## Usage

- In the project root directory using CLI run `npm run dev`<br />
  App should be working by now on port 5173.

- Go to http://localhost:5173/ to see the app.

If there is no data yet available it will indicate about it. Just wait a bit...

## Deployed version

Deployed version can be found here : https://birdnest-frontend.netlify.app/<br />

It works with backend deployed on cyclic.sh and it's limitations are described in the backend README file.

## Author

Larisa Pyykölä.
