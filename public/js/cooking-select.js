function handleResponse(response) {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

document.addEventListener("DOMContentLoaded", () => {
  //バックエンドから料理データ取得＆レンダリング
  fetch("/get-recipes")
    .then((response) => response.json())
    .then((date) => {
      console.log(date);
      date.forEach((recipe) => {
        const cookingContent = document.createElement("div");
        cookingContent.classList.add("cooking-content");

        const cookingImg = document.createElement("img");
        cookingImg.classList.add("selected-item");
        cookingImg.src = recipe.img_url;
        cookingImg.alt = recipe.name;
        cookingContent.appendChild(cookingImg);

        const cookingName = document.createElement("p");
        cookingName.textContent = recipe.name;
        cookingContent.appendChild(cookingName);

        const cookingContents = document.getElementById("cooking-contents");
        cookingContents.appendChild(cookingContent);
      });
    })
    .catch((error) => console.error("Fetch error:", error));

  // 料理選択時の処理
  document.querySelectorAll(".cooking-content").forEach((cookingContent) => {
    cookingContent.addEventListener("click", () => {
      const newSelectedItem = document.createElement("li");
      newSelectedItem.classList.add("selected-item");

      const itemName = document.createElement("span");
      itemName.textContent = "仮だよ！！！！！！";
      newSelectedItem.appendChild(itemName);

      const deleteButton = document.createElement("button");
      deleteButton.classList.add("delete-button");
      deleteButton.textContent = "☓";
      deleteButton.addEventListener("click", () => deleteButton.parentElement.remove());
      newSelectedItem.appendChild(deleteButton);

      const selectedList = document.getElementById("selected-list");
      selectedList.appendChild(newSelectedItem);
    });
  });
});
