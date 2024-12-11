import os
import json
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv(dotenv_path=os.path.join(settings.BASE_DIR, "config/.env"))

API_KEY = os.getenv("API_KEY")
OUTPUT_DIR = os.path.join(settings.BASE_DIR, "backend", "results")
PROMPT = '''Evaluate the following code according to Good Coding Practices and suggest changes where necessary. Do not generate new code, simply point out errors and suggest changes using this JSON format:
        output: {
            "programmingLanguage": "text",
            "issues": [
                {
                    "title": "title",
                    "description": "explanation"
                    "risk level": risk level
                },   {
                    "title": "title",
                    "description": "explanation"
                    "risk level": risk level
                }
            ],
            "feedback": "feedback",
            "evaluation": evaluation
        }
        programming language: the programming language in the given code file
        title: a short title which aptly summarizes the identified problem
        description: a short description which explains the problem
        risk level: "Minor", "Moderate", "Major", "Severe" (pick one)
        evaluation: "Very Bad", "Bad", "Satisfactory", "Good", "Very Good" (pick one)
        
        When creating the JSON, the problems should be sorted by risk level, with the most problematic
        being at the top and the least problematic at the bottom.
    '''

@csrf_exempt
def evaluate_code(request):
    print("Request URL:", request.get_full_path(),flush=True)  # This prints the full path including query parameters (if any)
    
    print("WE GOT HERE",flush=True)
    if request.method != "POST":
        return JsonResponse({"error": "Only POST method is allowed."}, status=405)

    # Get inputs
    print(request.POST,flush=True)
    print(request.FILES.getlist("file"),flush= True)
    files = request.FILES.getlist("file")  # Get all files with name "file"
    text_input = request.POST.get("code")

    # Validate that only one input is provided
    if files and text_input:
        return JsonResponse({"error": "Only one input type is allowed."}, status=400)

    # If files are provided, ensure only one file is uploaded
    if files and len(files) > 1:
        return JsonResponse({"error": "Only one file can be uploaded at a time."}, status=400)

    # Get the single file if it exists
    file = files[0] if files else None

    

    # Validate that at least one input is provided
    if not file and not text_input:
        return JsonResponse(
            {"error": "Either file or text input must be provided."}, 
            status=400
        )

    if API_KEY is None:
        return JsonResponse({"error": "API_KEY not found!"}, status=500)

    genai.configure(api_key=API_KEY)

    # Ensure the output directory exists
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)

    try:
        # Process input and create temporary file
        temp_file_path = os.path.join(OUTPUT_DIR, "input.txt")
        
        if file:
            code_content = file.read().decode("utf-8")
        else:
            code_content = text_input

        # Write content to temporary file
        with open(temp_file_path, "w", encoding="utf-8") as f:
            f.write(code_content)

        # Initial validation prompt to check if content is code
        model = genai.GenerativeModel("gemini-1.5-flash")
        validation_prompt = """
        Analyze the following content and determine if it contains valid code.
        Respond with a JSON object containing:
        {
            "is_code": boolean,
            "language": string or null,
            "reason": string explaining why it is or isn't considered code
        }
        """
        
        validation_response = model.generate_content([validation_prompt, code_content])
        
        try:
            # Clean up the response text to handle markdown formatting
           if validation_response.text.startswith("```json"):
            output = validation_response.text[7:].lstrip().rstrip()[:-4].rstrip()
            
            validation_result = json.loads(output)
            if not validation_result.get("is_code"):
                return JsonResponse({
                    "error": "Invalid input: Not recognized as code",
                    "details": validation_result.get("reason")
                }, status=400)
        except json.JSONDecodeError as e:
            return JsonResponse({
                "error": "Error validating code content",
                "details": f"JSON parsing error: {str(e)}",
                "response_text": output  # For debugging
            }, status=500)

        # If validation passes, proceed with main analysis
        response = model.generate_content([PROMPT, code_content])

        if response.text.startswith("```json"):
            output = response.text[7:].lstrip().rstrip()[:-4].rstrip()
            data = json.loads(output)

            # Save JSON to file
            output_path = os.path.join(OUTPUT_DIR, "output.json")
            with open(output_path, "w") as json_file:
                json.dump(data, json_file, indent=4)

            return JsonResponse(data, status=200)

        return JsonResponse({"error": "Invalid response from AI model."}, status=500)

    except Exception as e:
        return JsonResponse({
            "error": "Processing error",
            "details": str(e)
        }, status=500)
    finally:
        # Clean up temporary file if it exists
        if os.path.exists(temp_file_path):
            try:
                os.remove(temp_file_path)
            except Exception:
                pass

@csrf_exempt
def export_evaluation(request):
    """
    Handles GET requests to download the output.json file.
    Returns the file as a downloadable response or error if file doesn't exist.
    """
    if request.method != "GET":
        return JsonResponse({"error": "Only GET method is allowed."}, status=405)
    
    try:
        output_path = os.path.join(OUTPUT_DIR, "output.json")
        
        # Check if file exists
        if not os.path.exists(output_path):
            return JsonResponse({
                "error": "No output file found. Please analyze code first."
            }, status=404)
            
        # Read the JSON file
        with open(output_path, 'r') as file:
            json_data = json.load(file)
        
        # Create the response with appropriate headers
        response = HttpResponse(
            json.dumps(json_data, indent=4),
            content_type='application/json'
        )
        response['Content-Disposition'] = 'attachment; filename="output.json"'
        
        return response
        
    except Exception as e:
        return JsonResponse({
            "error": "Error exporting file",
            "details": str(e)
        }, status=500)