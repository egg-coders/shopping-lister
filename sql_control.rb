require 'json'
require "rubygems"
require "bundler/setup"
require 'mysql2'

class SQLControl
  def initialize
    @client = Mysql2::Client.new(host: "localhost", username: "K5", password: "G465j7R7^Nbgd$", database: "shopping_list")
  end

  def get_search_result(word="", id="")
    select_statement = %{
      SELECT r.id AS recipe_id, r.name AS name, r.img_url AS img_url
      FROM
        users AS u
        INNER JOIN recipes AS r ON u.id = r.user_id
        
      LIMIT 10
    }
    result = @client.query(select_statement)

    result.to_a.to_json
  end

  def get_user_data(mail, password)

    select_statement = %{}
    result = @client.query(select_statement)

    result.to_a.to_json
  end
end