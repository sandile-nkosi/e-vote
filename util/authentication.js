function createVoterSession(req, voter, action) {
  req.session.uid = voter._id.toString();
  req.session.isAdmin = voter.isAdmin;
  req.session.save(action);
}

function destroyVoterAuthSession(req) {
  req.session.uid = null;
  req.session.isAdmin = null;
}

function createComissionerSession(req, comissioner, action) {
  req.session.uid = comissioner._id.toString();
  req.session.isAdmin = comissioner.isAdmin;
  req.session.save(action);
}

function destroyComissionerAuthSession(req) {
  req.session.uid = null;
  req.session.isAdmin = null;
}

module.exports = {
  createVoterSession,
  destroyVoterAuthSession,
  createComissionerSession,
  destroyComissionerAuthSession
};
