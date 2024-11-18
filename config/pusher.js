const Pusher = require("pusher");

const pusher = new Pusher({
  appId: "1897597",
  key: "6cfc796921d6b404e425",
  secret: "8393cb43b8117a517920",
  cluster: "ap2",
  useTLS: true
});

module.exports = pusher;