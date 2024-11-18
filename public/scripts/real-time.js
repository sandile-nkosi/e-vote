const votesTotalElement = document.getElementById("votesTotal");
const listElement = document.getElementById("candidates-grid"); // Ensure the ID matches the `ul` in your HTML

// Enable pusher logging - don't include this in production
Pusher.logToConsole = true;

// Initialize Pusher
var pusher = new Pusher("6cfc796921d6b404e425", {
  cluster: "ap2",
});

// Subscribe to the "e-vote" channel
var channel = pusher.subscribe("e-vote");

// Listen for "votes" events
channel.bind("votes", function (data) {
  // Update the total votes
  votesTotalElement.innerText = "Votes Cast: " + data.votesTotal;

  // Find the specific candidate element
  const candidateElement = document.getElementById(`candidate-${data.candidateId}`);
  
  if (candidateElement) {
    // Update the vote counts for the candidate
    const nationalVotesElement = candidateElement.querySelector(".nationalVotes");
    const provincialVotesElement = candidateElement.querySelector(".provincialVotes");

    nationalVotesElement.textContent = `National votes: ${data.nationalVotes}`;
    provincialVotesElement.textContent = `Provincial votes: ${data.provincialVotes}`;
  }
});
