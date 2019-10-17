import os
import json


def get_prop(prop):
    """
    get property from postgres-info.json, or create that file if needed
    """
    infoFile = os.path.dirname(__file__) + "/postgres-info.json"
    try:
        info = json.load(open(infoFile, "r"))
        read_prop = info.get(prop)
        if prop == "user" and read_prop == "":
            print(f"Please configure {os.path.abspath(infoFile)} to include "
            "your postgres user and password.")
            exit()
        return read_prop
    except FileNotFoundError as error:
        user_config = json.loads('{"user": "", "password": ""}')
        json.dump(user_config, open(infoFile, "w"), indent=4)
        print(f"Created postgres config file in {os.path.abspath(infoFile)}.\n"
        "Please configure it with your postgres username and password.")
        exit()
