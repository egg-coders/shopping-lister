// fetchの通信確認
function handleResponse(response) {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

// 材料のチェックボックス処理
function changeList(checkbox) {
  const checkboxChecked = checkbox.checked;
  const checkboxElement = checkbox;
  const materialItem = checkboxElement.parentElement;
  const materialContainer = document.getElementById("material-name");
  const deleteMaterialContainer = document.getElementById("delete-material");

  if (checkboxChecked) {
    deleteMaterialContainer.appendChild(materialItem);
  } else {
    materialContainer.appendChild(materialItem);
  }
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

// 材料のレンダリング
function renderIngredients(data) {
  const materialContainer = document.getElementById("material-name");
  Object.values(data["ingredients"]).forEach((ingredientData) => {
    const div = document.createElement("div");
    div.id = ingredientData.ingredient_id;
    div.classList.add("ingredient-item");

    // チェックボックスを作成
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = "material-check";
    checkbox.addEventListener("change", () => changeList(checkbox));
    div.appendChild(checkbox);

    // 材料名を表示するspanを作成
    const spanName = document.createElement("span");
    spanName.id = "material";
    spanName.textContent = ingredientData.ingredient_name;
    div.appendChild(spanName);

    // 数量を入力するテキストフィールドを作成
    const inputAmount = document.createElement("input");
    inputAmount.type = "text";
    inputAmount.id = "amount";
    inputAmount.size = "5";
    inputAmount.value = ingredientData.amount;
    div.appendChild(inputAmount);

    // 単位を表示するspanを作成
    const spanUnit = document.createElement("span");
    spanUnit.id = "unit";
    spanUnit.textContent = ingredientData.unit;
    div.appendChild(spanUnit);

    // 材料一覧に格納
    materialContainer.appendChild(div);
  });
}

// 決定ボタンのクリック処理
function handleConfirmClick() {
  const selectedList = {
    recipe_ids: sessionStorage.getItem("selectedIdList"),
    ingredients: [],
    memo: document.getElementById("textarea").value,
  };

  const ingredientContainer = document.querySelectorAll(".ingredient-item");
  ingredientContainer.forEach((ingredient) => {
    const ingredientAmount = ingredient.querySelector("#amount").value;
    selectedList["ingredients"].push({ id: ingredient.id, amount: ingredientAmount });
  });

  fetch("/post-selected-ingredients", {
    method: "POST",
    body: JSON.stringify(selectedList),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(handleResponse)
    .then((data) => {
      sessionStorage.setItem("listId", JSON.stringify(data));
      window.location.href = "/decide";
    })
    .catch((error) => console.error("Fetch error:", error));
}

// HTML取得後の処理
document.addEventListener("DOMContentLoaded", () => {
  fetch("/get-ingredient", {
    method: "POST",
    body: sessionStorage.getItem("selectedIdList"),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(handleResponse)
    .then((data) => {
      renderRecipes(data);
      renderIngredients(data);

      const confirmButton = document.getElementById("confirm-button");
      confirmButton.addEventListener("click", handleConfirmClick);
    })
    .catch((error) => console.error("Fetch error:", error));
});
