function createVoterSession(req, voter, action) {
  req.session.uid = voter._id.toString();
  req.session.save(action);
}

module.exports = {
  createVoterSession,
};
