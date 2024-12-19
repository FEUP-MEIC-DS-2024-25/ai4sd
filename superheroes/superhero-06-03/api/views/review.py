from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView	

import google.generativeai as genai
import uuid

from google.cloud import firestore

from backend.github_retrieval import get_github_artifacts

from datetime import datetime

class ReviewView(APIView):
    def post(self, request):
        print("Parsing request body")

        repo_url = request.data.get('repo_url')
        auth_token = request.data.get('token')
        pattern = request.data.get('architecture') 
        userID = request.data.get('client_id')

        try: 
            _, _, _, repoOwner, repoName = repo_url.rstrip('/').split('/')
        except ValueError:
            return Response({
                "message": "Invalid repository URL"
            }, status=status.HTTP_400_BAD_REQUEST)

        db = firestore.Client()
        collection_ref = db.collection('superhero-06-03')
        doc_ref = collection_ref.document('secrets')
        doc = doc_ref.get()

        secrets = doc.to_dict()

        gemini_key = secrets.get('gemini_api_key')

        genai.configure(api_key=gemini_key)
        model = genai.GenerativeModel("gemini-1.5-flash")

        if not repo_url:
            return Response({
                "message": "Repo URL and auth token, in case of private repository, are required"
            }, status=status.HTTP_400_BAD_REQUEST)
        
        artifacts = get_github_artifacts(repo_url, auth_token)

        prompt = f"""I'm need you to analyses the following files and tell me how well the {pattern} pattern is implemented in this project.
                    I'll send you, for each file, the name, the path and the content of the file. Then, you'll give some conclusions. Later on the message I'll ask you for them.

                    Files will start now:
                """
        
        for artifact in artifacts:
                prompt += f"File name: {artifact['name']};\n"
                prompt += f"File path: {artifact['path']};\n"
                prompt += f"File content:\n {artifact['content']};\n\n"

        prompt += f"""All files that I want you to analyse are sent. The conclusions need to be written in markdow, with the following structure, with '\n' only after each sentence, no blank lines between the sentences I ask for:
                    - Heading 1 entitled 'Percentage of the pattern implemented in the project'
                    - Normal text with the value of the percentage of how well the pattern is implemented in the project, from 0 to 100
                    - Heading 1 entitled 'Explanation'
                    - Normal text with a brief explanation of the percentage value
                    - Heading 1 entitled 'Improvements'
                    - Normal text with 3 bullet points with the improvements that can be made in the project, if any. Each bullet point needs to have a simple text intro, followed by a ':', and then the explanation of the improvement
                    - Heading 1 entitled 'Strenghts'
                    - Normal text with 3 bullet points with the strenghts of the project, if any. Each bullet point needs to have a simple text intro, followed by a ':', and then the explanation of the strenght
                    """
        
        print("Prompting the model")

        try:
            response = model.generate_content(prompt)

            percentage = response.text.split('\n')[1].replace("*", "").replace("-", "").strip()
            explanation = response.text.split('\n')[3].replace("*", "").replace("-", "").strip()

            improvement1 = response.text.split('\n')[5].replace("*", "").replace("-", "").strip()
            improvement2 = response.text.split('\n')[6].replace("*", "").replace("-", "").strip()
            improvement3 = response.text.split('\n')[7].replace("*", "").replace("-", "").strip()

            improvements = [
                            {improvement1.split(':')[0].replace("*", "").replace("-", "").strip(): improvement1.split(':')[1].replace("*", "").replace("-", "").strip()},
                            {improvement2.split(':')[0].replace("*", "").replace("-", "").strip(): improvement2.split(':')[1].replace("*", "").replace("-", "").strip()},
                            {improvement3.split(':')[0].replace("*", "").replace("-", "").strip(): improvement3.split(':')[1].replace("*", "").replace("-", "").strip()}
                           ]

            strength1 = response.text.split('\n')[9].replace("*", "").replace("-", "").strip()
            strength2 = response.text.split('\n')[10].replace("*", "").replace("-", "").strip()
            strength3 = response.text.split('\n')[11].replace("*", "").replace("-", "").strip()

            strengths = [
                         {strength1.split(':')[0].replace("*", "").replace("-", "").strip(): strength1.split(':')[1].replace("*", "").replace("-", "").strip()},
                         {strength2.split(':')[0].replace("*", "").replace("-", "").strip(): strength2.split(':')[1].replace("*", "").replace("-", "").strip()},
                         {strength3.split(':')[0].replace("*", "").replace("-", "").strip(): strength3.split(':')[1].replace("*", "").replace("-", "").strip()}
                        ]

            current_datetime = datetime.now()

            formatted_datetime = current_datetime.strftime("%Y-%m-%d %H:%M:%S")

            report = {
                "id" : str(uuid.uuid4()),
                "name": repoName,
                "timestamp": formatted_datetime,
                "pattern": pattern,
                "percentage": percentage,
                "explanation": explanation,
                "improvements": improvements,
                "strenghts": strengths
            }

            users_ref = collection_ref.document("users")
            users_json = users_ref.get().to_dict()

            users_json[userID]['reports'].append(report)

            users_ref.update(users_json)

            return Response({
                "id" : str(uuid.uuid4()),
                "name": repoName,
                "timestamp": formatted_datetime,
                "pattern": pattern,
                "percentage": percentage,
                "explanation": explanation,
                "improvements": improvements,
                "strenghts": strengths
            }, status=status.HTTP_200_OK)

        except Exception as e:  
            return Response({
                "message": f"Catch statement caught an exception: {str(e)}"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)