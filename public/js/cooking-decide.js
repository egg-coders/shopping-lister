// fetchの通信確認
function handleResponse(response) {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

// 料理のレンダリング
function renderRecipes(data) {
  const recipeContainer = document.getElementById("recipe-name");
  Object.values(data["recipes"]).forEach((recipeName) => {
    const recipeItem = document.createElement("li");
    recipeItem.textContent = recipeName;
    recipeContainer.appendChild(recipeItem);
  });
}

// spanタグの追加
function appendSpanElement(text, idName, parentElement) {
  const span = document.createElement("span");
  span.classList.add(idName);
  span.textContent = text;
  parentElement.appendChild(span);
}

// 材料のレンダリング
function renderIngredients(data) {
  const materialContainer = document.getElementById("material-name");
  Object.values(data["ingredients"]).forEach((ingredientData) => {
    const div = document.createElement("div");
    div.id = ingredientData.ingredient_id;
    div.classList.add("ingredient-item");

    // 材料名・数量・単位のspanタグの作成及び追加
    appendSpanElement(ingredientData.ingredient_name, "name", div);
    appendSpanElement(ingredientData.amount, "amount", div);
    appendSpanElement(ingredientData.unit, "unit", div);

    // 材料一覧に格納
    materialContainer.appendChild(div);
  });
}

// HTML取得後の処理
document.addEventListener("DOMContentLoaded", () => {
  fetch("/get-shopping-list", {
    method: "POST",
    body: sessionStorage.getItem("listId"),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(handleResponse)
    .then((data) => {
      renderRecipes(data);
      renderIngredients(data);
      document.getElementById("textarea").value = data["memo"];

      const confirmButton = document.getElementById("confirm-button");
      confirmButton.addEventListener("click", handleConfirmClick);
    })
    .catch((error) => console.error("Fetch error:", error));
});
