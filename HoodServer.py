import HoodTracker
import hug
import json

api = hug.API(__name__)
api.http.base_url = '/api'

world = None
settings_string = 'AJ3E3EASE8EA2BLKSKWAAJBASAEABGABGAKEWEVY9Q6X5Q6BSFBAA2KLLAA'
save_filename = 'output.txt'


@hug.get()
def step():
    input_data = HoodTracker.getInputData(save_filename)
    if 'settings_string' in input_data:
        settings_string = input_data['settings_string']
    else:
        input_data['settings_string'] = settings_string

    global world
    world, output_known_exits = HoodTracker.startWorldBasedOnData(input_data)
    output_data = HoodTracker.solve(world)
    HoodTracker.writeResultsToFile(world, input_data, output_data, output_known_exits, save_filename)
    return output_data


@hug.get()
def hello_world():
    return "Hello"


@hug.get()
def get_world():
    global world
    if world is None:
       step()

    def serialize(obj):
        return f'Todo: serialise {type(obj)}'
    return json.dumps(world.__dict__, default=serialize)


@hug.get()
def save_files():
    return HoodTracker.getSaveFiles()

