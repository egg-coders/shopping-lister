require 'json'
require "rubygems"
require "bundler/setup"
require 'mysql2'

class SQLControl
  def initialize
    # ここのusername と passwordをそれぞれ書き換えて運用する
    @client = Mysql2::Client.new(host: "localhost", username: "", password: "", database: "shopping_list")
  end

  def get_search_result(word="", id="")
    select_statement = %{
      SELECT r.id AS recipe_id, r.name AS name, r.img_url AS img_url
      FROM
        users AS u
        INNER JOIN recipes AS r ON u.id = r.user_id
        WHERE r.name LIKE "%#{word}%"
      LIMIT 10;
    }
    result = @client.query(select_statement)

    result.to_a.to_json
  end

  def get_recipe_ingredient(recipes)
    select_statement %{
      SELECT i.id AS ingredient_id, i.name AS ingredient_name, SUM(ia.amount) AS ingredient_amount
      FROM
        recipes AS r
        INNER JOIN ingredients_amount AS ia ON r.id = ia.recipe_id
        INNER JOIN ingredients AS i ON ia.ingredient_id = i.id
        WHERE r.id = "#{recipes[0]}"
        GROUP BY i.id, i.name;
    }

    result = @client.query(select_statement)

    result.to_a.to_json
  end

  def get_list_result(uid="")
    select_statement = %{
      SELECT l.id AS list_id, r.name AS recipe_name, l.created_at AS date
        FROM
          shopping_lists AS l
          INNER JOIN list_recipes AS lr ON l.id = lr.shopping_list_id
          INNER JOIN recipes AS r ON lr.recipe_id = r.id
          GROUP BY l.id, r.name, l.created_at
          ORDER BY l.created_at DESC
          LIMIT 120;
    }

    sql_result = @client.query(select_statement).to_a
    result = create_list_history(sql_result).to_json

    result
  end

  def get_user_data(mail, password)

    select_statement = %{}
    result = @client.query(select_statement)

    result.to_a.to_json
  end

  def create_list_history(arr)
    ids = []
    res = []

    arr.each do |ele|
      if ids.include?(ele["list_id"])
        index = ids.index(ele["list_id"])
        res[index]["recipe_names"].push(ele["recipe_name"])
      else
        ids.push(ele["list_id"])
        if ids.length > 10
          break
        end
        res.push({"list_id" => ele["list_id"], "recipe_names" => [ele["recipe_name"]], "date" => ele["date"]})
      end
    end
    res
  end
end