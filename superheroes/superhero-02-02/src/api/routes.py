from flask_restful import Api

from api import server
from .resources.repository import RemoteRepository, LocalRepository

api = Api(server)

api.add_resource(RemoteRepository, '/remote/<path:repo>')
api.add_resource(LocalRepository, '/local')