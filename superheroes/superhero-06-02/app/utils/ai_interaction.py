import io
import json
import requests
import mimetypes

from typing import List, Any
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.files.uploadedfile import UploadedFile
from .chat_manager import GeminiChatManager
from ..secret_accesser import access_specific_secret

# Global constants
IMAGE_DIR = "./images"
IMAGE_EXTENSIONS = {'.png', '.jpg', '.jpeg', '.gif', '.bmp', '.tiff', '.svg', '.webp'}
GITHUBAPI_HEADER = {"Authorization": json.loads(access_specific_secret("superhero-06-02-secret3"))['github_key']}

@csrf_exempt
def create_session(request) -> JsonResponse:
    """Create a new chat session."""
    if request.method != 'POST':
        return JsonResponse({"error": "Method not allowed. Use POST."}, status=405)
    
    try:
        data = json.loads(request.body) if request.body else {}
        session_name = data.get('name', 'New Chat')
        
        chat_manager = GeminiChatManager()
        result = chat_manager.create_session(name=session_name)
        
        if result["success"]:
            return JsonResponse({
                "success": True,
                "session": {
                    "session_id": result["session_id"],
                    "name": result["name"],
                    "created_at": result["created_at"],  # Note: Actual timestamp handled by Firestore
                }
            })
        else:
            return JsonResponse({
                "success": False,
                "error": result["error"]
            }, status=500)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)
    except Exception as e:
        return JsonResponse({
            "success": False,
            "error": str(e)
        }, status=500)

@csrf_exempt
def delete_session(request) -> JsonResponse:
    """Delete a specified chat session."""
    if request.method != 'POST':
        return JsonResponse({"error": "Method not allowed. Use POST."}, status=405)
    
    try:
        data = json.loads(request.body)
        session_id = data.get('session_id')
        
        if not session_id:
            return JsonResponse({"error": "session_id is required."}, status=400)
        
        chat_manager = GeminiChatManager(session_id=session_id)
        result = chat_manager.delete_session_by_id(session_id)
        
        if result["success"]:
            return JsonResponse({
                "success": True,
                "message": result["message"]
            })
        else:
            return JsonResponse({
                "success": False,
                "error": result["error"]
            }, status=500)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)
    except ValueError as ve:
        return JsonResponse({"error": str(ve)}, status=404)
    except Exception as e:
        return JsonResponse({
            "success": False,
            "error": str(e)
        }, status=500)

@csrf_exempt
def get_sessions(request) -> JsonResponse:
    """Retrieve all active chat sessions."""
    if request.method != 'GET':
        return JsonResponse({"error": "Method not allowed. Use GET."}, status=405)
    
    try:
        chat_manager = GeminiChatManager()
        sessions = chat_manager.get_sessions()
        
        if isinstance(sessions, dict) and "error" in sessions:
            return JsonResponse({
                "success": False,
                "error": sessions["error"]
            }, status=500)
        
        # Format timestamps if needed
        formatted_sessions = []
        for session in sessions:
            formatted_sessions.append({
                "session_id": session["session_id"],
                "name": session["name"],
                "created_at": session["created_at"].strftime("%Y-%m-%d %H:%M:%S") if session["created_at"] else None,
                "last_activity": session["last_activity"].strftime("%Y-%m-%d %H:%M:%S") if session["last_activity"] else None,
            })
        
        return JsonResponse({
            "success": True,
            "sessions": formatted_sessions
        })
    except Exception as e:
        return JsonResponse({
            "success": False,
            "error": f"Failed to retrieve sessions: {str(e)}"
        }, status=500)

@csrf_exempt
def update_session_name_view(request) -> JsonResponse:
    """Update the name of a specific chat session."""
    if request.method != 'POST':
        return JsonResponse({"error": "Method not allowed. Use POST."}, status=405)
    
    try:
        data = json.loads(request.body)
        session_id = data.get('session_id')
        new_name = data.get('name')
        
        if not session_id or not new_name:
            return JsonResponse({"error": "session_id and name are required."}, status=400)
        
        chat_manager = GeminiChatManager(session_id=session_id)
        result = chat_manager.update_session_name(session_id, new_name)
        
        if result["success"]:
            return JsonResponse({
                "success": True,
                "message": result["message"]
            })
        else:
            return JsonResponse({
                "success": False,
                "error": result["error"]
            }, status=500)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)
    except ValueError as ve:
        return JsonResponse({"error": str(ve)}, status=404)
    except Exception as e:
        return JsonResponse({
            "success": False,
            "error": str(e)
        }, status=500)

@csrf_exempt
def process_architectural_images(request) -> JsonResponse:
    """
    Process uploaded images to infer architectural patterns using Gemini vision model.
    """
    if request.method != 'POST':
        return JsonResponse({
            "error": "Method not allowed. Use POST."
        }, status=405)

    try:
        # Validate session_id
        session_id = request.POST.get("session_id")
        if not session_id:
            return JsonResponse({
                "error": "Session ID is required"
            }, status=400)
        
        # Initialize chat manager with session_id
        chat_manager = GeminiChatManager(session_id=session_id)
        
        # Get images from request
        uploaded_images = request.FILES.getlist("image")
        
        # Validate images
        is_valid, error_message = validate_image_files(uploaded_images)
        if not is_valid:
            return JsonResponse({
                "error": error_message
            }, status=400)

        # Prepare the inference prompt
        prompt = """
            Analyze each image, and try to infer if there are any patterns present or implied. 
            Restrict yourself to the patterns described in the literature provided. 
            Reference the original literature when you mention a pattern. 
            If you are unable to infer any pattern from an image, that should be explicitly stated. 
            Provide your answer in Markdown format.
        """
        
        # Add user message with attachments
        chat_manager.add_manual_message(content="", message_type="USER", files=uploaded_images)
        
        # Send message to Gemini
        result = chat_manager.send_message(
            message=prompt,
            files=uploaded_images
        )
        
        if result["success"]:
            # Retrieve the latest assistant message
            history = chat_manager.get_chat_history()
            assistant_message = history[-1] if history else {}
            return JsonResponse({
                "success": "Images processed successfully",
                "result": assistant_message.get("content", "")
            })
        else:
            return JsonResponse({
                "error": "Failed to process images",
                "result": result["error"]
            }, status=500)
            
    except Exception as e:
        return JsonResponse({
            "error": "Unexpected error while processing images",
            "result": str(e)
        }, status=500)

def validate_image_files(files: List[UploadedFile]) -> tuple[bool, str]:
    """
    Validate uploaded image files.
    Returns (is_valid, error_message)
    """
    if not files:
        return False, "No image files found in the request."
        
    for image in files:
        ext = '.' + image.name.split('.')[-1].lower()
        if ext not in IMAGE_EXTENSIONS:
            return False, f"Invalid file format for {image.name}. Supported formats: {', '.join(IMAGE_EXTENSIONS)}"
            
    return True, ""

@csrf_exempt
def process_repository_url(request) -> JsonResponse:
    """Process a GitHub repository URL and analyze images with Gemini"""
    if request.method != 'POST':
        return JsonResponse({"error": "Method not allowed. Use POST."}, status=405)
    
    try:
        data = json.loads(request.body)
        url = data.get("repo_url")
        session_id = data.get("session_id")
        
        if not url or not session_id:
            return JsonResponse({"error": "repo_url and session_id are required."}, status=400)
        
        # Initialize chat manager with session_id
        chat_manager = GeminiChatManager(session_id=session_id)

        # Log the URL in chat history
        chat_manager.add_manual_message(
            content=f"Processing repository: {url}",
            message_type="USER"
        )

        # Parse owner and repo name from URL
        path_parts = url.rstrip('/').split('/')
        if len(path_parts) < 2:
            return JsonResponse({"error": "Invalid repository URL format."}, status=400)
        owner = path_parts[-2]
        repo_name = path_parts[-1]

        # Extract images as file-like objects
        image_files = extract_images_from_repo(owner, repo_name)

        if not image_files:
            chat_manager.add_manual_message(
                content="No images found in the repository.",
                message_type="ASSISTANT"
            )
            return JsonResponse({"result": "No images found in the repository."})
        
        # Send images to Gemini with architectural pattern analysis prompt
        prompt = (
            "Analyze each image, and try to infer if there are any patterns present or implied. "
            "Restrict yourself to the patterns described in the literature provided. "
            "Reference the original literature when you mention a pattern. "
            "If you are unable to infer any pattern from an image, that should be explicitly stated."
        )
        
        response = chat_manager.send_message(
            message=prompt,
            files=image_files
        )

        if response["success"]:
            # Retrieve the latest assistant message
            history = chat_manager.get_chat_history()
            assistant_message = history[-1] if history else {}
            return JsonResponse({
                "success": "Images found and processed successfully",
                "result": assistant_message.get("content", "")
            })
        else:
            return JsonResponse({
                "error": "Failed to process images",
                "result": response["error"]
            }, status=500)

    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)
    except Exception as e:
        error_message = f"Error processing repository: {str(e)}"
        # Initialize chat manager without session_id to log the error
        try:
            chat_manager = GeminiChatManager(session_id=session_id)
            chat_manager.add_manual_message(
                content=error_message,
                message_type="ASSISTANT"
            )
        except:
            pass  # If session_id is invalid, skip logging
        return JsonResponse({"error": error_message}, status=500)

def extract_images_from_repo(owner: str, repo_name: str, path: str = "") -> List[Any]:
    """
    Recursively extract images from repository and return them as file-like objects
    """
    files = []
    contents = get_repo_contents(owner, repo_name, path)
    
    if not contents:
        return files

    for item in contents:
        if item['type'] == 'dir':
            files.extend(extract_images_from_repo(owner, repo_name, item['path']))
        elif item['type'] == 'file' and any(item['name'].lower().endswith(ext) for ext in IMAGE_EXTENSIONS):
            # Download image
            response = requests.get(item['download_url'], headers=GITHUBAPI_HEADER)
            if response.status_code == 200:
                # Create an in-memory bytes buffer
                file_like_object = io.BytesIO(response.content)
                file_like_object.name = item['name']  # Set a name attribute if required
                file_like_object.content_type = mimetypes.guess_type(item['name'])[0]
                
                files.append(file_like_object)

    return files

def get_repo_contents(owner: str, repo_name: str, path: str = "") -> dict:
    """Fetch repository contents from GitHub API"""
    url = f"https://api.github.com/repos/{owner}/{repo_name}/contents/{path}"
    response = requests.get(url, headers=GITHUBAPI_HEADER)
    if response.status_code == 200:
        return response.json()
    return None

@csrf_exempt
def suggest_architecture_improvements(request) -> JsonResponse:
    """Get architecture improvement recommendations."""
    if request.method != 'POST':
        return JsonResponse({"error": "Method not allowed. Use POST."}, status=405)
    
    try:
        data = json.loads(request.body)
        session_id = data.get('session_id')
        
        if not session_id:
            return JsonResponse({"error": "session_id is required."}, status=400)
        
        # Initialize chat manager with session_id
        chat_manager = GeminiChatManager(session_id=session_id)
        
        prompt = '''Based on the previously evaluated architecture, suggest specific improvements or optimizations.
        Prioritize recommendations that enhance efficiency, scalability, maintainability, and alignment with best practices.
        Avoid repeating the evaluation and focus solely on actionable changes with clear justifications.'''
        
        result = chat_manager.send_message(prompt)
        
        if result["success"]:
            # Retrieve the latest assistant message
            history = chat_manager.get_chat_history()
            assistant_message = history[-1] if history else {}
            return JsonResponse({
                "success": "Response received successfully",
                "result": assistant_message.get("content", "")
            })
        else:
            return JsonResponse({
                "error": "Gemini related error",
                "result": result["error"]
            }, status=500)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)
    except Exception as e:
        return JsonResponse({
            "error": "Unexpected error",
            "result": str(e)
        }, status=500)

@csrf_exempt
def change_expertise(request) -> JsonResponse:
    """Change the expertise level of responses."""
    if request.method != 'POST':
        return JsonResponse({"error": "Method not allowed. Use POST."}, status=405)
    
    try:
        data = json.loads(request.body)
        expertise = data.get('expertise')
        session_id = data.get('session_id')
        
        if not expertise or not session_id:
            return JsonResponse({"error": "expertise and session_id are required."}, status=400)
        
        expertise_prompts = {
            'Beginner': "From now on, please provide information as if the user is a beginner with no prior knowledge.",
            'Intermediate': "From now on, please provide information as if the user is an intermediate learner who understands the basics but needs more depth.",
            'Expert': "From now on, please provide information as if the user is an expert who needs advanced, detailed, and precise information."
        }
        
        prompt = expertise_prompts.get(expertise)
        if not prompt:
            return JsonResponse({
                "error": "Invalid expertise level. Choose from Beginner, Intermediate, Expert."
            }, status=400)
            
        # Initialize chat manager with session_id
        chat_manager = GeminiChatManager(session_id=session_id)
        
        result = chat_manager.send_message(prompt)
        
        if result["success"]:
            # Retrieve the latest assistant message
            history = chat_manager.get_chat_history()
            assistant_message = history[-1] if history else {}
            return JsonResponse({
                "success": "Response received successfully",
                "result": assistant_message.get("content", "")
            })
        else:
            return JsonResponse({
                "error": "Gemini related error",
                "result": result["error"]
            }, status=500)
            
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)
    except Exception as e:
        return JsonResponse({
            "error": "Unexpected error",
            "result": str(e)
        }, status=500)

@csrf_exempt
def get_explanation(request) -> JsonResponse:
    """Get reasoning explanation for the system output."""
    if request.method != 'POST':
        return JsonResponse({"error": "Method not allowed. Use POST."}, status=405)
    
    try:
        data = json.loads(request.body)
        session_id = data.get('session_id')
        
        if not session_id:
            return JsonResponse({"error": "session_id is required."}, status=400)
        
        # Initialize chat manager with session_id
        chat_manager = GeminiChatManager(session_id=session_id)
        
        prompt = '''Please provide an explanation of the output generated by the system.
        Include details on the architecture components, relationships, and any other relevant information.'''
        
        result = chat_manager.send_message(prompt)
        
        if result["success"]:
            # Retrieve the latest assistant message
            history = chat_manager.get_chat_history()
            assistant_message = history[-1] if history else {}
            return JsonResponse({
                "success": "Response received successfully",
                "result": assistant_message.get("content", "")
            })
        else:
            return JsonResponse({
                "error": "Gemini related error",
                "result": result["error"]
            }, status=500)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)
    except Exception as e:
        return JsonResponse({
            "error": "Unexpected error",
            "result": str(e)
        }, status=500)

@csrf_exempt
def get_literature_references(request) -> JsonResponse:
    """Get literature references for architectural concepts."""
    if request.method != 'POST':
        return JsonResponse({"error": "Method not allowed. Use POST."}, status=405)
    
    try:
        data = json.loads(request.body)
        session_id = data.get('session_id')
        
        if not session_id:
            return JsonResponse({"error": "session_id is required."}, status=400)
        
        # Initialize chat manager with session_id
        chat_manager = GeminiChatManager(session_id=session_id)
        
        prompt = '''Please provide literature references or resources that can help the user understand the architectural concepts and patterns discussed.'''
        
        result = chat_manager.send_message(prompt)
        
        if result["success"]:
            # Retrieve the latest assistant message
            history = chat_manager.get_chat_history()
            assistant_message = history[-1] if history else {}
            return JsonResponse({
                "success": "Response received successfully",
                "result": assistant_message.get("content", "")
            })
        else:
            return JsonResponse({
                "error": "Gemini related error",
                "result": result["error"]
            }, status=500)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)
    except Exception as e:
        return JsonResponse({
            "error": "Unexpected error",
            "result": str(e)
        }, status=500)

@csrf_exempt
def get_chat_history(request) -> JsonResponse:
    """Retrieve chat history for a specific session."""
    if request.method != 'GET':
        return JsonResponse({"error": "Method not allowed. Use GET."}, status=405)
    
    try:
        session_id = request.GET.get('session_id')
        if not session_id:
            return JsonResponse({"error": "session_id is required as a query parameter."}, status=400)
        
        # Initialize chat manager with session_id
        chat_manager = GeminiChatManager(session_id=session_id)
        
        history = chat_manager.get_chat_history()
        
        if isinstance(history, dict) and "error" in history:
            return JsonResponse({
                "success": False,
                "error": history["error"]
            }, status=500)
        
        # Transform the history to match the frontend's expected format
        formatted_history = []
        for message in history:
            chat_dict = {
                "sender": message["type"].lower(),
                "chat_content": message["content"],
                "chat_image": message["attachments"][0] if message["attachments"] else None,
                "chat_date": message["timestamp"].strftime("%Y-%m-%d %H:%M:%S") if message["timestamp"] else None
            }
            formatted_history.append(chat_dict)
        
        return JsonResponse(formatted_history, safe=False)
        
    except Exception as e:
        return JsonResponse(
            {"error": f"Failed to retrieve chat history: {str(e)}"},
            status=500
        )

def get_real_examples(request) -> JsonResponse:
    """Explore real examples"""
    if request.method != 'POST':
        return JsonResponse({"error": "Method not allowed. Use POST."}, status=405)
    
    try:
        data = json.loads(request.body)
        session_id = data.get('session_id')
        
        if not session_id:
            return JsonResponse({"error": "session_id is required."}, status=400)
        
        # Initialize chat manager with session_id
        chat_manager = GeminiChatManager(session_id=session_id)
        
        prompt = '''Based on the previously evaluated architecture, provide real-world implementation examples. For each pattern, include:
                    Pattern: The name of the architectural pattern.
                    Example: A real-world implementation of the pattern.
                    Context: The scenario or conditions where the pattern is applied.
                    Practical Application: How the pattern solves the problem or enhances the system.
                    Link: A reference or resource to explore the example further.
                    Present the results as a well-structured Markdown document using bullet points for each topic, ensuring the information for each pattern is clearly separated.
                    Avoid overly large or distracting titles.
                '''
        
        result = chat_manager.send_message(prompt)
        
        if result["success"]:
            # Retrieve the latest assistant message
            history = chat_manager.get_chat_history()
            assistant_message = history[-1] if history else {}
            return JsonResponse({
                "success": "Response received successfully",
                "result": assistant_message.get("content", "")
            })
        else:
            return JsonResponse({
                "error": "Gemini related error",
                "result": result["error"]
            }, status=500)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)
    except Exception as e:
        return JsonResponse({
            "error": "Unexpected error",
            "result": str(e)
        }, status=500)
