from flask_restful import Api

from api import server
from .resources.repository import RemoteRepository, LocalRepository
from .resources.models import Models

api = Api(server)

api.add_resource(RemoteRepository, '/remote')
api.add_resource(LocalRepository, '/local')
api.add_resource(Models, '/models')