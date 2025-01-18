import re
from ada_url import parse_url
import time
import sql_updater
import sys
import json

def urlparse(line):
    userPasswordPattern =r":[^:]+:[^:]+$"
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

def parse_data():
    toOperate = "./files/sample.txt"
    userPasswordPattern = r":[^:]+:[^:]+$"
    adaList = []
   
    print(parse_url("https://cst-proxy-02.isqft.com8080"))
    start = time.time()
    with open(toOperate, encoding="utf-8", errors="ignore") as f:
        linenum = 1

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

    print(adaList[1])
    print("{:.2f} seconds for ada_url".format(time.time() - start))
    return adaList 

if __name__ == "__main__":
    if len(sys.argv) > 1:
        url = sys.argv[1]
        result = urlparse(url)
        print(json.dumps(result))
    else:
        parse_data()

db_config = {
    "host": "localhost",
    "username": "root",
    "password": "root",
    "database": "deepcode",
}
table_name = "parsed_urls"

sql_updater.insert_data_in_batches(parse_data(), db_config, table_name)
