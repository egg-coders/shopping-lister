require 'json'
require 'rubygems'
require 'bundler/setup'
require 'webrick'


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

trap('INT'){server.shutdown}

server.start