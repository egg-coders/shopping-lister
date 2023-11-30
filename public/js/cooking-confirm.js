function handleResponse(response){
  if(!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  return response.json;
}
//ページ３からsessioStorageで貰ったデータを受け取る
 const idListStr = sessionStorage.getItem("selectedIdList");
 window.onload = function(){
  fetch("/get-ingredient", {
    method: "POST",
    body: idListStr,
    headers: {
      "Content-Type": "application/json",
    },
  })
  .then((response) => handleResponse(response))
  .then((data) => {
    Object.values(data["recipes"]).forEach(ele => {
      const recipe = document.getElementById("recipe-name");
      recipe.insertAdjacentHTML("afterbegin",`<li>${ele}</li>`);
    });
    Object.values(data["ingredients"]).forEach(ele =>{
      const material = document.getElementById("material-name");
      material.insertAdjacentHTML
      ("afterbegin",
      `<div id = ${ele.ingredent_id}>
        <input type ='checkbox' id='material-check' >
        <span id = material>${ele.ingredient_name}</span>
        <input type = 'text' id = 'amount' size ='1'>${ele.amount}
        <span id= 'unit' >${ele.unit}</span>
      </div>`);
    });
    const materialCheck = document.getElementById("material-check")
    materialCheck.addEventListener('change', function(){
      const deleteMaterial = document.getElementById("delete-material");
      deleteMaterial.insertAdjacentHTML
      ("afterbegin",materialCheck.parentElement.innerHTML);
      const listElement = document.getElementById('mate');
      listElement.remove();
    });
  })
  .catch((error) => console.error("Fetch error:", error));
}

//resipe id と材料idとメモを材料の個数をフェッチでおくる

const cookingName = document.createElement("p");
cookingName.textContent = recipe.name;
cookingContent.appendChild(cookingName);