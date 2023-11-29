# ディレクトリ概要

このディレクトリでは原美咲がMySQL2でサーバとDBを接続する実験をした結果の記録を共有します

# steps

### 1，sql_testディレクトリに移動してください
### 2，下記コマンドを自分のMySQLのuser名で実行してください

```bash
mysql < sql_test.sql --user=misaki --password
```
passwordが求められるので選択したuserのpasswordpasswordを入力



trainingデータベースに下記のprefecturesテーブルが作成されました

|id|name|
|:----|:----|
|1|tokyo|
|2|osaka|
|3|kyoto|


### 3，下記コマンドを実行してください

```bash
ruby sql_test.rb
```

これでターミナルにDBから情報を出力できました

# これから調べること

WEBrickとMySQL2をどう繋ぐか

