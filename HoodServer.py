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
def step(new_game=False, modify_input=None):
    global settings_string
    global world
    
    if new_game:
        input_data = HoodTracker.getInputData(save_filename, { 'settings_string': settings_string })
    else:
        input_data = HoodTracker.getInputData(save_filename)
        settings_string = input_data['settings_string']

    if modify_input is not None:
        modify_input(input_data)

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


@hug.post('/api/set_entrance')
def set_entrance(entrance, exit=None):
    logging.info("f'set_entrance => {entrance} goesto {exit}'")
    def update_entrance(input_data):
        remove_entrance = lambda x: not x.startswith(entrance);
        if (exit == None):
            input_data['known_exits'] = list(filter(input_data['known_exits'], remove_entrance))
        else:
            input_data['known_exits'] = list(filter(input_data['known_exits'], remove_entrance))
            input_data['please_explore'] = list(filter(input_data['please_explore'], remove_entrance))
            input_data['please_explore'].append(f'{entrance} goesto {exit}')
    return step(modify_input=update_entrance)


@hug.get('/api/world_config')
def get_world_config():
    global world;
    logging.info("world regions")
    for region in world.regions:
        logging.info(f'region: {region.__dict__}')

    world_config = {
        'entrances': world.get_entrances()
    };
    return world_config

@hug.static('/')
def serve_home():
    return('./webserver/dist')

