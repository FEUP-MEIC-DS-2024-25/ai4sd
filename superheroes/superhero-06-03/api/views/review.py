from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView	

import google.generativeai as genai
import uuid

from backend.github_retrieval import get_github_artifacts

from datetime import datetime

class ReviewView(APIView):
    def post(self, request):
        print("Yeaahhhh")
        repo_url = request.data.get('repo_url')
        auth_token = request.data.get('token')
        pattern = request.data.get('architecture') 

        # Parse the repo url
        _, _, _, repoOwner, repoName = repo_url.rstrip('/').split('/')

        # Configure the API key
        gemini_key = "AIzaSyBylXr0VxhozhM34rx_nHJgHeIi4PG5COc"

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
        
        # Appending the prompt with the files
        for artifact in artifacts:
                # Appending the file name
                prompt += f"File name: {artifact['name']};\n"
                
                # Appending the file path
                prompt += f"File path: {artifact['path']};\n"

                # Appending the file content
                prompt += f"File content:\n {artifact['content']};\n\n"

        # Concluding the prompt
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
        print("Miiiiiiiiiiiiiid")
        try:
            response = model.generate_content(prompt)

            # Extract the conclusions from the response and remove spaces in the beggining, * and - characters
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

            print("Conclusions provided: ", percentage, explanation, improvements, strengths)

            # Create a JSON with the results
            current_datetime = datetime.now()

            # Format the datetime to 'YYYY-MM-DD HH:MM:SS'
            formatted_datetime = current_datetime.strftime("%Y-%m-%d %H:%M:%S")

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