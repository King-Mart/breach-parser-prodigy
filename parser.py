import re
from ada_url import parse_url
import time
import sql_updater


# get all files in the files directory and print them nicely


# rootpath = os.getcwd() + "\\"
#
# fileDirectory = "files" + "\\"
#
# toOperate = rootpath + fileDirectory + "sample.txt"
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
        # for line in f:
        #     if line.__len__() > 0:
        #         resultList.append(str(urlparse(line)))
        # print("{:.2f} seconds for urllib".format(time.time() - start))

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
    # print(parsed_data[110:120])
    return adaList 


db_config = {
    "host": "localhost",
    "username": "root",
    "password": "root",
    "database": "deepcode",
}
table_name = "parsed_urls"

# data = [
#     {
#         "href": "https://user:pass@example.org:80/api?q=1#2",
#         "username": "user",
#         "password": "pass",
#         "protocol": "https:",
#         "host": "example.org:80",
#         "port": "80",
#         "hostname": "example.org",
#         "pathname": "/api",
#         "search": "?q=1",
#         "hash": "#2",
#     }
# ]


sql_updater.insert_data_in_batches(parse_data(), db_config, table_name)
