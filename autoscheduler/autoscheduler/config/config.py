"""
Read settings to be user by Django from postgres-info.json
"""
import os
import sys
import json

def get_prop(prop):
    """
    Get property from postgres-info.json, or create that file if needed
    """
    info_file = os.path.dirname(__file__) + "/postgres-info.json"
    try:
        info = json.load(open(info_file, "r"))
        read_prop = info.get(prop)
        if prop == "user" and read_prop == "":
            print(f"Please configure {os.path.abspath(info_file)} to include "
                  "your postgres user and password.")
            sys.exit()
        return read_prop
    except FileNotFoundError:
        user_config = json.loads('{"user": "", "password": ""}')
        json.dump(user_config, open(info_file, "w"), indent=4)
        print(f"Created postgres config file in {os.path.abspath(info_file)}.\n"
              "Please configure it with your postgres username and password.")
        sys.exit()
