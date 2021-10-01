mongoimport --host 10.203.2.6 --port 27017 --db of-manager --collection cargos --authenticationDatabase of-manager --username usr_ofmanager --password Of8173b8f1ac77 --drop --file cargos.bson

mongorestore -h 10.203.2.6:27017 -d of-manager -u usr_ofmanager -p Of8173b8f1ac77 temp/ofmanager/cargos.bson
