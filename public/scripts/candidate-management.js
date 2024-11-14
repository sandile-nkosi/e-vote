const deleteCandidateBtnElements = document.querySelectorAll(".candidate-item button");

async function deleteCandidate(event) {
  try {
    const buttonElement = event.target;
    const candidateId = buttonElement.dataset.candidateid;
    const response = await axios.delete(`/api/comissioner/candidates/${candidateId}`);

    if (response.status !== 200) {
      alert("Something went wrong!");
      return;
    }

    buttonElement.closest(".candidate-item").remove();
  } catch (error) {
    alert("Something went wrong!");
  }
}

deleteCandidateBtnElements.forEach(btn => btn.addEventListener("click", deleteCandidate));