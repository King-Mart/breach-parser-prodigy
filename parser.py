import re
from ada_url import parse_url
import time
import sql_updater
import sys
import json
import os

def urlparse(line):
    userPasswordPattern = r":[^:]+:[^:]+$"
    line2 = re.sub(userPasswordPattern, "", line)
    try:
        username_password = re.search(userPasswordPattern, line)
        user = ""
        pas = ""
        if username_password:
            user = username_password.group(0)[1:].split(":")[0]
            pas = username_password.group(0)[1:].split(":")[1]
            adaObj = parse_url(line2)
            adaObj["username"] = user
            adaObj["password"] = pas
            adaObj["application"] = ""
        return adaObj
    except ValueError:
        return "Line could not be parsed"

def parse_data(file_path=None):
    toOperate = file_path if file_path else "./files/sample.txt"
    userPasswordPattern = r":[^:]+:[^:]+$"
    adaList = []
   
    start = time.time()
    with open(toOperate, encoding="utf-8", errors="ignore") as f:
        for line in f:
            line2 = re.sub(userPasswordPattern, "", line)
            if line.__len__() > 0:
                try:
                    username_password = re.search(userPasswordPattern, line)
                    user = ""
                    pas = ""
                    if username_password:
                        user = username_password.group(0)[1:].split(":")[0]
                        pas = username_password.group(0)[1:].split(":")[1]
                        adaObj = parse_url(line2)
                        adaObj["username"] = user
                        adaObj["password"] = pas
                        adaObj["application"] = ""
                    adaList.append(adaObj)
                except ValueError:
                    pass

    print("{:.2f} seconds for ada_url".format(time.time() - start))
    return adaList 

if __name__ == "__main__":
    if len(sys.argv) > 1:
        file_path = sys.argv[1]
        result = parse_data(file_path)
        print(json.dumps({"count": len(result)}))
        
        # Update database with parsed results
        db_config = {
            "host": "localhost",
            "username": "root",
            "password": "root",
            "database": "deepcode",
        }
        table_name = "parsed_urls"
        sql_updater.insert_data_in_batches(result, db_config, table_name)
    else:
        parse_data()