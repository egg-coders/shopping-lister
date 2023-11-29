require 'mysql2'

client = Mysql2::Client.new(host: "localhost", username: "misaki", password: "r&B7%WZht5Usy6")



query = %q{select * from training.prefectures}
results = client.query(query)

# "row" => レコード,  "id" => カラム名,  "value" => "データ値"
results.each do |row|
  row.each do |key, value|
    puts "#{key} => #{value}"
  end
  puts "\n"
end
