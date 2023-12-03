require 'json'
require "rubygems"
require "bundler/setup"
require 'mysql2'

class SQLControl
  def initialize
    # ここのusername と passwordをそれぞれ書き換えて運用する
    @client = Mysql2::Client.new(host: "localhost", username: "misaki", password: "r&B7%WZht5Usy6", database: "shopping_list")
  end

  def get_search_result(word=[])
    key = word.map {|w| "(.*" + w + ".*)"}.join("|")
    key = "(.*.*)" if key == "" || nil
    select_statement = %{
      SELECT id, name, img_url
      FROM
        recipes
        WHERE name REGEXP ('#{key}');
    }
    result = @client.query(select_statement)

    result.to_a
  end

  def get_recipe_ingredient(recipes)
    select_statement %{
      SELECT i.id AS ingredient_id, i.name AS ingredient_name, SUM(i.amount) AS ingredient_amount
      FROM
        recipes AS r
        INNER JOIN ingredients_amount AS ia ON r.id = ia.recipe_id
        INNER JOIN ingredients AS i ON ia.ingredient_id = i.id
        WHERE r.id = "#{recipes[0]}"
        GROUP BY i.id, i.name;
    }

    result = @client.query(select_statement)

    result.to_a
  end

  def get_list_history(uid="")
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
    sql_result = sql_result.map do |ele|
      ele["date"] = ele["date"].to_date
      ele
    end
    result = create_list_history(sql_result)
    result
  end

  def get_user_data(mail, password)

    select_statement = %{}
    result = @client.query(select_statement)

    result.to_a
  end

  # 画面4へ材料を送るときのsql
  def get_recipe_name(ids)
    arr = ids.join(", ")
    arr = "0" if arr == ""
    select_statement = %{
      SELECT id, name
        FROM
          recipes
          WHERE id IN (#{arr})
    }

    sql_result = @client.query(select_statement).to_a
    result = create_id_name_hash(sql_result)
    result
  end

  def create_id_name_hash(array)
    result = array.reduce({}) do |r, ele|
      r[ele["id"]] = ele["name"]
      r
    end
    result
  end

  def get_ingredient(ids)
    arr = ids.join(", ")
    arr = "0" if arr == ""
    select_statement = %{
      SELECT i.id AS ingredient_id, i.name AS ingredient_name, i.unit AS unit, SUM(a.amount) AS amount
        FROM
          recipes AS r
          INNER JOIN ingredients_amount AS a ON r.id = a.recipe_id
          INNER JOIN ingredients AS i ON i.id = a.ingredient_id
          WHERE r.id IN (#{arr})
          GROUP BY i.id, i.name, i.unit
    }

    result = @client.query(select_statement).to_a
    result
  end

  def get_shopping_list_recipes(list_id)
    select_statement = %{
      SELECT r.id AS id, r.name AS name
        FROM
          shopping_lists AS l
          INNER JOIN list_recipes AS lr ON l.id = lr.shopping_list_id
          INNER JOIN recipes AS r ON r.id = lr.recipe_id
          WHERE l.id = #{list_id}
    }

    sql_result = @client.query(select_statement).to_a
    result = create_id_name_hash(sql_result)
    return result
  end

  def get_shopping_list_ingredient(list_id)
    select_statement = %{
      SELECT i.id AS ingredient_id, i.name AS ingredient_name, i.unit AS unit, li.amount AS amount
        FROM
          shopping_lists AS l
          INNER JOIN list_ingredients AS li ON l.id = li.shopping_list_id
          INNER JOIN ingredients AS i ON i.id = li.ingredient_id
          WHERE l.id = #{list_id}
    }

    sql_result = @client.query(select_statement).to_a
    return sql_result
  end

  def get_list_memo(list_id)
    select_statement = @client.prepare(%{
      SELECT memo
        FROM
          shopping_lists
          WHERE id = ?
    })
    sql_result = select_statement.execute(list_id).to_a[0]["memo"]

    return sql_result
  end

  def insert_list(data)
    begin
      @client.query("start transaction;")
      list_id = create_new_list(data["memo"])
      set_list_recipes(list_id, data["recipe_ids"])
      set_list_ingredients(list_id, data["ingredients"])
      @client.query("commit;")
    rescue Mysql2::Error => e
      @client.query("rollback;")
      puts "Error message: #{e.message}"
      File.open('error.txt', 'a') do |f|
        f.puts "#{e.message}"
      end
      list_id = 0
    end
    list_id
  end

  def create_new_list(memo)
    stmt = @client.prepare("INSERT INTO shopping_lists(user_id, memo) VALUES (1, ?);")
    res = stmt.execute(memo)

    @client.last_id
  end

  def set_list_recipes(list_id, recipe_ids)
    ids = recipe_ids[1, recipe_ids.length - 2].split(",")
    stmt = @client.prepare(%{
      INSERT INTO
        list_recipes (shopping_list_id, recipe_id)
      VALUES (#{list_id}, ?);
    })

    ids.each do |id|
      res = stmt.execute(id)
    end

    true
  end

  def set_list_ingredients(list_id, ingredients)
    stmt = @client.prepare(%{
      INSERT INTO
        list_ingredients (
            shopping_list_id,
            ingredient_id,
            amount
        )
      VALUES (#{list_id}, ?, ?);
    })

    ingredients.each do |ele|
      res = stmt.execute(ele["id"], ele["amount"])
    end

    true
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