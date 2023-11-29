DROP DATABASE IF EXISTS training;
CREATE DATABASE IF NOT EXISTS training;

CREATE TABLE 
  training.prefectures (
    id   int,
    name varchar(32)
);

INSERT INTO training.prefectures (id, name) VALUES 
(1, "tokyo"),
(2, "osaka"),
(3, "kyoto");