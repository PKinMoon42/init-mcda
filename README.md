## Initialize user and projects on MCDA

This tiny script can come in handy whenever you have to wipe your MCDA project database.

It currently does the followings:
- Creates a user for you
- "Resets" the password for that user
- Creates new projects
    - including the cover photo uploads

### Usage

All you have to do is:
- Clone this repo
- Run `npm install`
- Open `init.js` in the root folder
- Set up the values of the following variables according to your needs
    - `apiUrl` - the URL that you use to access the backend 
    - `admin` - the admin credentials needed to log in to create the first user
    - `user` - YOUR user credentials
    - `projects` - array of the projects you want to create
- Save `init.js`
- Run `node init.js` or `npm start` from your terminal
    
And that's it! :) You can just start the frontend and log in with your desired user.

> I'm planning to extend this tool once we implement new features to the app (e.g. new properties to add to a project, etc)

Enjoy! :)
