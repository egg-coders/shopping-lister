//料理名を追加する関数
window.onload = function (){
  const recipeName = document.getElementById('recipe-name');
  let text = '<li>追加テキスト</li>';
  recipeName.insertAdjacentHTML('afterbegin',text);
}

//材料をチェックボックス付きのテキストで追加する関数
window.onload = function(){
  const materialName = document.getElementById('material-name');
  let text = '<div><input type="checkbox" id="check" name="check" >追加テキスト<div>';
  materialName.insertAdjacentHTML('afterbegin',text);
}

function mycheck() {
  let flag = false;//チェックされているかを判定する変数
  (let i = 0; i < document.form.check.lenth; i++){
    
  }
}