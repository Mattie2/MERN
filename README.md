# DevConnector Application (MERN Stack Personal Project)

## Backend Dependencies

- **Node.js**: v20.16.0

## Frontend Dependencies

### Installing Dependencies

To install all of the dependencies, run the following commands in the root directory:

```bash
npm install
```

### Environment Variables

Create an `default.json` file in the config directory and add the keys:

mongoURI=_mongo_db_connection_string_
jwtSecret=_your_jwt_secret_
jwtExpirationTime=_default is 3600 (its in milliseconds)_
githubClientId=_go to github.com/settings/applications to find_
githubSecret=_go to github.com/settings/applications to create_

### Running Application

```bash
npm run server
```

The server will auto-restart everytime that the source code is updated
