function handleRespons(response){
  if(!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  return response.json;
}

//料理名にリストで挿入する
window.onload = function cook(){
  const recipe = document.getElementById("recipe-name");
  recipe.insertAdjacentHTML("afterbegin","<li>料理名</li>");
}

//材料一覧にチェックボックス付きでデータを挿入。チェックボックスが選択されたら削除した材料に挿入
window.onload = function matelial(){
  const material = document.getElementById("material-name");
  material.insertAdjacentHTML
  ("afterbegin","<div><input type ='checkbox' id=material-check >材料<input type = 'text' id = amount size ='1'><span>個</span></div>");
  material-check.addEventListener('change', function(){
    const deleteMaterial = document.getElementById("delete-material");
    deleteMaterial.insertAdjacentHTML
    ("afterbegin","<li>チェックされた材料</li>");
  });
}


