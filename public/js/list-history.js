function handleResponse(response) {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

document.addEventListener("DOMContentLoaded", () => {
  fetch("/get-history")
    .then((response) => handleResponse(response))
    .then((data) => {
      date;
    });
});

const linkHistories = document.querySelectorAll(".link-history");
linkHistories.forEach((linkHistory) => {
  linkHistory.addEventListener("click", () => {
    d;
  });
});
