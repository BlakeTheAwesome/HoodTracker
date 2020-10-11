import HoodTracker
import hug
import json
import falcon
from falcon import HTTPError
import logging
import distutils.util

logging.info(f'starting up')

api = hug.API(__name__)

world = None
settings_string = 'AJ3E3EASE8EA2BLKSKWAAJBASAEABGABGAKEWEVY9Q6X5Q6BSFBAA2KLLAA'
save_filename = 'output.txt'

def str_to_bool(str):
    return bool(distutils.util.strtobool(str))

@hug.get('/api/step')
def step(new_game=False):
    if new_game:
        global settings_string
        input_data = HoodTracker.getInputData(save_filename, { 'settings_string': settings_string })
    else:
        input_data = HoodTracker.getInputData(save_filename)
        settings_string = input_data['settings_string']

    global world
    world, output_known_exits = HoodTracker.startWorldBasedOnData(input_data)
    output_data = HoodTracker.solve(world)
    HoodTracker.writeResultsToFile(world, input_data, output_data, output_known_exits, save_filename)
    return output_data


@hug.get('/api/get_world')
def get_world():
    global world
    if world is None:
       step()

    def serialize(obj):
        return f'Todo: serialise {type(obj)}'
    return json.dumps(world.__dict__, default=serialize)


@hug.get('/api/save_files')
def save_files():
    return HoodTracker.getSaveFiles()


@hug.post('/api/load_file')
def load_file(filename):
    global save_filename
    save_filename = filename
    return step()


@hug.post('/api/start_new')
def start_new(filename, settings, overwrite):
    overwrite = str_to_bool(overwrite)
    if not overwrite and HoodTracker.saveFileExists(filename):
      raise HTTPError(falcon.HTTP_409, title="File Exists", description=f'A save file named {filename} already exists')

    global save_filename, settings_string
    save_filename = filename
    settings_string = settings
    return step(new_game=True)


@hug.static('/')
def serve_home():
    return('./webserver/dist')

