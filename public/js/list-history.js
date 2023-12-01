function handleResponse(response) {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

document.addEventListener("DOMContentLoaded", () => {
  fetch("get-list-test")
    .then((response) => handleResponse(response))
    .then((data) => {
      data.forEach((list_data) => {
        const tableItem = document.createElement("tr");
        tableItem.classList.add("table-item");
        tableItem.id = list_data["list_id"];

        const createDate = document.createElement("td");
        createDate.classList.add("create-date");
        const linkDate = document.createElement("a");
        linkDate.classList.add("link-history");
        linkDate.textContent = list_data["date"];
        createDate.appendChild(linkDate);
        tableItem.appendChild(createDate);

        const cookingName = document.createElement("td");
        cookingName.classList.add("cooking-name");
        const linkNames = document.createElement("a");
        linkNames.classList.add("link-history");
        linkNames.textContent = list_data["recipe_names"];
        cookingName.appendChild(linkNames);
        tableItem.appendChild(cookingName);

        const table = document.querySelector("table");
        table.appendChild(tableItem);
      })

      //履歴をクリックした時の処理
      const linkHistories = document.querySelectorAll(".link-history");
      linkHistories.forEach((linkHistory) => {
        linkHistory.addEventListener("click", () => {
          const listId = JSON.stringify(linkHistory.parentElement.parentElement.id);
          sessionStorage.setItem("listId", listId);
          window.location.href = "/decide";
        });
      });
    });
});
