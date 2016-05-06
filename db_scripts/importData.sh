mongoimport --host=127.0.0.1 --db farm --collection animals --file db_scripts/animals.json --jsonArray
mongoimport --host=127.0.0.1 --db farm --collection owners --file db_scripts/owners.json --jsonArray
mongoimport --host=127.0.0.1 --db farm --collection vaccines --file db_scripts/vaccines.json --jsonArray
