from rest_framework.views import APIView	
from rest_framework.response import Response
from rest_framework import viewsets, status

from views import ReviewView, ReportsView

class APIRouter(APIView):
    def post(self, request):
        request_type = None

        try:
            request_type = request.data.get('request_type')
        except KeyError:
            return Response({
                "message": "Invalid request body"
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if not request_type:
            return Response({
                "message": "Request type name is required"
            }, status=status.HTTP_400_BAD_REQUEST)

        if request_type == 'get-review':
            return ReviewView.as_view()(request)
        elif request_type == 'get-client-reports':
            return ReportsView.as_view()(request)
        else:
            return Response({
                "message": "Invalid request"
            }, status=status.HTTP_400_BAD_REQUEST)  
    