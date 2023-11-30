function getJsonData() {
  let formData = new FormData(document.getElementById("login-form"));
  let object = {};
  formData.forEach((value, key) => {
    object[key] = value;
  });
  return JSON.stringify(object);
}

function handleResponse(response) {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

function postFormData(url) {
  return fetch(url, {
    method: "POST",
    body: getJsonData(),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => handleResponse(response))
    .catch((error) => console.error("Fetch error:", error));
}

let registerBtn = document.getElementById("register-btn");
registerBtn.addEventListener("click", () => {
  postFormData("/user-register").then((data) => {
    console.log(data);
  });
});

let loginBtn = document.getElementById("login-btn");
loginBtn.addEventListener("click", () => {
  postFormData("/user-login").then((data) => {
    console.log(data);
    window.location.href = "cooking-select.html";
  });
});
