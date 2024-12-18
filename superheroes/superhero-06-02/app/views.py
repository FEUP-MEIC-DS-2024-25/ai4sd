from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .utils.ai_interaction import process_repository_url, process_architectural_images, suggest_architecture_improvements, get_explanation, get_literature_references, get_real_examples

@csrf_exempt
def get_content(request):
    if request.POST.get('repo_url'):
        process_repository_url(request)
    if request.FILES.get('image'):
        process_architectural_images(request)
    if request.method == "POST" and request.POST.get("options", "") == "recommendations":
        suggest_architecture_improvements()
    if request.method == "POST" and request.POST.get("options", "") == "ExplainReasoning":
        get_explanation()
    if request.method == "POST" and request.POST.get("options", "") == "literature":
        get_literature_references()
    if request.method == "POST" and request.POST.get("options", "") == "realExamples":
        get_real_examples()
    return JsonResponse({"success": "Request received successfully"})

