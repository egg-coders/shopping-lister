function handleResponse(response){
  if(!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  return response.json;
}
//ページ３から
const idListStr = sessionStorage.getItem("selectedIdList");
const idList = JSON.parse(idListStr);

//料理名にリストで挿入する
window.onload = function cook(){
  const recipe = document.getElementById("recipe-name");
  recipe.insertAdjacentHTML("afterbegin","<li>料理名</li>");
}

//材料一覧にチェックボックス付きでデータを挿入。チェックボックスが選択されたら削除した材料に挿入
window.onload = function matelial(){
  const material = document.getElementById("material-name");
  material.insertAdjacentHTML
  ("afterbegin","<div id = 'mate'><input type ='checkbox' id='material-check' >材料<input type = 'text' id = 'amount' size ='1'><span id= 'unit' >個</span></div>");
  const materialCheck = document.getElementById("material-check")
  materialCheck.addEventListener('change', function(){
    const deleteMaterial = document.getElementById("delete-material");
    deleteMaterial.insertAdjacentHTML
    ("afterbegin","<div id = 'mate'><input type ='checkbox' id='material-check' >材料<input type = 'text' id = 'amount' size ='1'><span id= 'unit' >個</span></div>");
    const listElement = document.getElementById('mate');
    listElement.remove();
  });
}


