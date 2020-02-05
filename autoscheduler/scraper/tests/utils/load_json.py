import json

from pathlib import Path

def load_json_file(path: str):
    """ Loads a json file given a path """
    base_path = Path(__file__).parent
    file_path = (base_path / path).resolve()

    data = None
    with open(file_path) as json_file:
        data = json.load(json_file)

        json_file.close()

    return data
