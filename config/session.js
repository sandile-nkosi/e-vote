const expressSession = require('express-session');
const mongoDbStore = require('connect-mongodb-session');


function createSessionStore () {
  const MongoDBStore  = mongoDbStore(expressSession);


  const store = new MongoDBStore({
    uri: process.env.MONGOOSE_URI,
    collection: 'sessions'
  });

  return store;
}


function createSessionConfig() {
  return {
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: createSessionStore(),
    cookie: {
      maxAge: 0.5 * 24 * 60 * 60
    }
  };
}


module.exports = createSessionConfig;