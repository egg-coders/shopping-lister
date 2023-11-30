require 'json'
require 'rubygems'
require 'bundler/setup'
require 'webrick'
require 'mysql2'
require_relative './sql_control.rb'

client = SQLControl.new
document_root = File.expand_path("./public/")


server = WEBrick::HTTPServer.new({
  DocumentRoot: document_root,
  BindAddress: '127.0.0.1',
  Port: 8000,
  MimeTypes: WEBrick::HTTPUtils::DefaultMimeTypes.merge({"js"=>"application/javascript"}),
  # ディレクトリがurl指定されたときに配信されるファイルの指定
  DirectoryIndex: ["index.html","index.htm","index.cgi","index.rhtml"],
})


server.mount('/', WEBrick::HTTPServlet::FileHandler, File.join(document_root, ""))
server.mount('/confirm', WEBrick::HTTPServlet::FileHandler, File.join(document_root, "cooking-confirm.html"))
server.mount('/decide', WEBrick::HTTPServlet::FileHandler, File.join(document_root, "cooking-decide.html"))
server.mount('/select', WEBrick::HTTPServlet::FileHandler, File.join(document_root, "cooking-select.html"))
server.mount('/history', WEBrick::HTTPServlet::FileHandler, File.join(document_root, "list-history.html"))
server.mount('/recipeConfirm', WEBrick::HTTPServlet::FileHandler, File.join(document_root, "recipe-save-confim.html"))
server.mount('/recipe', WEBrick::HTTPServlet::FileHandler, File.join(document_root, "recipe-save.html"))

server.mount_proc '/user-register' do |req, res|
  resBody = JSON.parse(req.body)

  # ここにsqlへの問い合わせ
  # check処理を書く
  v = resBody['password'] == '9999'

  data = {validator: v}
  res.body = data.to_json
  res['Content-Type'] = 'application/json'
end

server.mount_proc '/user-login' do |req, res|
  resBody = JSON.parse(req.body)

  # ここにsqlへの問い合わせを書く
  # check処理を書く
  v = resBody['password'] == '9999'

  data = {validator: v}
  res.body = data.to_json
  res['Content-Type'] = 'application/json'
end

server.mount_proc '/get-recipes' do |req, res|
  data = client.get_search_result

  res.body = data
  res['Content-Type'] = 'application/json'
end

server.mount_proc '/get-recipes-test' do |req, res|
  data = [
    {"id" => "1", "name" => "寿司", "img_url" => "./images/nigirizushi_moriawase.png"},
    {"id" => "2", "name" => "ハンバーグ", "img_url" => "./images/hanbagu.jpg"},
    {"id" => "3", "name" => "親子丼", "img_url" => "./images/oyakodon.jpg"},
    {"id" => "4", "name" => "ペペロンチーノ", "img_url" => "./images/Peperoncino.png"},
  ]

  res.body = data.to_json
  res['Content-Type'] = 'application/json'
end

server.mount_proc '/get-ingredient' do |req, res|
  data = [
    {"ingredient_id" => "1", "ingredient_name" => '酢飯', "amount" => '1'},
    {'ingredient_id' => '2', 'ingredient_name' => '鮮魚', 'amount' => '200'},
    {'ingredient_id' => '3', 'ingredient_name' => '海苔', 'amount' => '4'},
    {'ingredient_id' => '4', 'ingredient_name' => 'わさび', 'amount' => '1'},
  ]

  res.body = data.to_json
  res['Content-Type'] = 'application/json'
end

server.mount_proc '/get-list' do |req, res|
  data = client.get_list_result

  res.body = data
  res['Content-Type'] = 'application/json'
end

server.mount_proc '/get-list-test' do |req, res|
  data = [
    {"list_id"=>1, "recipe_names"=>["寿司", "ピザ"], "date"=>Time.local(2023, 12, 1)},
    {"list_id"=>2, "recipe_names"=>["寿司", "ピザ", "ラーメン"], "date"=>Time.local(2023, 12, 1)},
    {"list_id"=>3, "recipe_names"=>["寿司", "ピザ", "親子丼", "味噌汁", "カルボナーラ"], "date"=>Time.local(2023, 12, 1)},
    {"list_id"=>4, "recipe_names"=>["中華スープ", "麻婆豆腐"], "date"=>Time.local(2023, 12, 1)},
    {"list_id"=>5, "recipe_names"=>["ボンゴレロッソ"], "date"=>Time.local(2023, 12, 1)},
  ]

  res.body = data.to_json
  res['Content-Type'] = 'application/json'
end

trap('INT'){server.shutdown}

server.start