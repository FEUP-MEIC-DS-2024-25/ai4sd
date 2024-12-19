from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.views import APIView	
from rest_framework.response import Response

from google.cloud import firestore

class ReportsView(APIView):
    def post(self, request):
        userID = None
        try:
            userID = request.data.get('client_id')
        except KeyError:
            return Response({
                "message": "Invalid request body"
            }, status=status.HTTP_400_BAD_REQUEST)

        if not userID:
            return Response({
                "message": "Client ID is required"
            }, status=status.HTTP_400_BAD_REQUEST)
        
        users_json = user_data = None

        try:
            db = firestore.Client()
            collection_ref = db.collection('superhero-06-03')
            users_json = collection_ref.document('users').get().to_dict()
        except Exception as e:
            return Response({
                "message": f"Error connecting to Firestore: {str(e)}"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        try:
            user_data = users_json[userID]['reports']
        except KeyError:
            return Response({
                "message": "User not found"
            }, status=status.HTTP_404_NOT_FOUND)
        
        return Response({
            "reports": user_data
        }, status=status.HTTP_200_OK)

        