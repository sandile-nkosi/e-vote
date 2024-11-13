function createVoterSession(req, voter, action) {
  req.session.uid = voter._id.toString();
  req.session.isAdmin = voter.isAdmin;
  req.session.save(action);
}

function destroyVoterAuthSession(req) {
  req.session.uid = null;
}

module.exports = {
  createVoterSession,
  destroyVoterAuthSession,
};
