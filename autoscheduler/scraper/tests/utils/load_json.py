import json

from pathlib import Path

def generate_path(path: str) -> Path:
    """ Generates a Path object from a relative path """

    base_path = Path(__file__).parent
    file_path = (base_path / path).resolve()

    return file_path

def load_json_file(path: str):
    """ Loads a json file given a path """

    file_path = generate_path(path)

    with open(file_path) as json_file:
        return json.load(json_file)

def load_pdf(path: str):
    """ Loads a pdf file given a path """

    file_path = generate_path(path)

    return open(file_path, "rb")
