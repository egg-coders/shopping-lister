require 'mysql2'

puts "MySQLのユーザー名を入力してください"
Username = gets.chomp
puts "MySQLのパスワードを入力してください"
Password = gets.chomp

client = Mysql2::Client.new(host: "localhost", username: Username, password: Password)



query = %q{select * from training.prefectures}
results = client.query(query)

# "row" => レコード,  "id" => カラム名,  "value" => "データ値"
results.each do |row|
  row.each do |key, value|
    puts "#{key} => #{value}"
  end
  puts "\n"
end
