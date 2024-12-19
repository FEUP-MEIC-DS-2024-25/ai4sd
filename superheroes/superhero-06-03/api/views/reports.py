from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.views import APIView	
from rest_framework.response import Response

from google.cloud import firestore

class ReportsView(APIView):
    def post(self, request):
        userID = request.data.get('client_id')

        db = firestore.Client()
        collection_ref = db.collection('superhero-06-03')
        users_ref = collection_ref.document('users')
        users_json = users_ref.get().to_dict()

        try:
            user_data = users_json[userID]['reports']
        except KeyError:
            return Response({
                "message": "User not found"
            }, status=status.HTTP_404_NOT_FOUND)
        
        return Response({
            "reports": user_data
        }, status=status.HTTP_200_OK)

        