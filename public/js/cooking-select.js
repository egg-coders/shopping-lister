function handleResponse(response) {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

let recipesNameList = {};
document.addEventListener("DOMContentLoaded", () => {
  fetch("/get-recipes")
    .then((response) => handleResponse(response))
    .then((date) => {
      console.log(date);
      date.forEach((recipe) => {
        //バックエンドから料理データ取得＆レンダリング
        const cookingContent = document.createElement("a");
        cookingContent.classList.add("cooking-content");
        cookingContent.href = "#";

        const cookingImg = document.createElement("img");
        cookingImg.classList.add("cooking-img");
        cookingImg.src = recipe.img_url;
        cookingImg.alt = recipe.name;
        cookingContent.appendChild(cookingImg);

        const cookingName = document.createElement("p");
        cookingName.textContent = recipe.name;
        cookingContent.appendChild(cookingName);

        const cookingContents = document.getElementById("cooking-contents");
        cookingContents.appendChild(cookingContent);

        // ハッシュに追加
        recipesNameList[recipe.name] = recipe.id;
      });

      // 料理選択時の処理
      document.querySelectorAll(".cooking-content").forEach((cookingContent) => {
        cookingContent.addEventListener("click", (event) => {
          event.preventDefault();
          const newSelectedItem = document.createElement("li");
          newSelectedItem.classList.add("selected-item");

          const itemName = document.createElement("span");
          itemName.textContent = cookingContent.lastChild.textContent;
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
    })
    .catch((error) => console.error("Fetch error:", error));

  // 決定ボタンのクリック処理
  const decideButton = document.getElementById("decide-button");
  decideButton.addEventListener("click", () => {
    const selectedIdList = [];
    const selectedRecipes = document.querySelectorAll(".selected-item");
    selectedRecipes.forEach((selectedRecipe) => {
      selectedIdList.push(recipesNameList[selectedRecipe.firstChild.textContent]);
    });

    const selectedIdListString = JSON.stringify(selectedIdList);
    sessionStorage.setItem("selectedIdList", selectedIdListString);
    window.location.href = "/confirm";
  });
});
