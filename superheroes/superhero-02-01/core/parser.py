import re
import os
import json
from typing import List, Dict, Optional, Union
import requests

LANGUAGE_EXTENSIONS = {
    '.py': 'python',
    '.java': 'java',
    '.cpp': 'cpp',
    '.cxx': 'cpp',
    '.cc': 'cpp',
    '.hpp': 'cpp',
    '.h': 'cpp',
    '.c': 'c',
    '.js': 'javascript',
    '.kt': 'kotlin',
    '.html': 'html',
    '.htm': 'html',
}

REGEX_PATTERNS = {
    'python': {
        'import': [
            r'^\s*import\s+[\w\.]+',
            r'^\s*from\s+[\w\.]+\s+import\s+[\w\*, ]+',
        ],
        'class': [
            r'^\s*class\s+(\w+)\s*(?:\(([\w\s,]+)\))?:',
        ],
        'function': [
            r'^\s*def\s+(\w+)\s*\(([^)]*)\)\s*:',
        ],
        'main': [
            r'^\s*def\s+main\s*\(([^)]*)\)\s*:',
            r'^\s*if\s+__name__\s*==\s*[\'"]__main__[\'"]\s*:',
        ],
    },
    'java': {
        'import': [
            r'^\s*import\s+[\w\.]+;',
        ],
        'class': [
            r'^\s*public\s+class\s+(\w+)\s*(?:extends\s+(\w+))?\s*(?:implements\s+([\w\s,]+))?\s*\{',
        ],
        'function': [
            r'^\s*(public|private|protected)?\s*(static\s+)?(void|[\w\<\>\[\]]+)\s+(\w+)\s*\(([^)]*)\)\s*(?:throws\s+\w+)?\s*(?:\{|;)',
        ],
        'main': [
            r'^\s*public\s+static\s+void\s+main\s*\(\s*String\s*\[\]\s*\w+\s*\)\s*\{',
        ],
    },
    'cpp': {
        'import': [
            r'^\s*#include\s+<[\w\.]+>',
            r'^\s*#include\s+"[\w\.]+"',
        ],
        'class': [
            r'^\s*class\s+(\w+)\s*:\s*(?:public\s+(\w+))?(?:,\s*(?:public|private)\s+(\w+))*\s*\{',
        ],
        'function': [
            r'^\s*(?:inline\s+)?(?:virtual\s+)?(?:static\s+)?(?:void|[\w\*&<>]+)\s+(\w+)\s*\(([^)]*)\)\s*(?:const\s*)?(?:\{|;)',
        ],
        'main': [
            r'^\s*(int|void)\s+main\s*\(([^)]*)\)\s*\{',
        ],
    },
    'c': {
        'import': [
            r'^\s*#include\s+<[\w\.]+>',
            r'^\s*#include\s+"[\w\.]+"',
        ],
        'class': [
            r'^\s*struct\s+(\w+)\s*\{',
        ],
        'function': [
            r'^\s*(?:inline\s+)?(?:static\s+)?(?:void|[\w\*\s]+)\s+(\w+)\s*\(([^)]*)\)\s*(?:\{|;)',
        ],
        'main': [
            r'^\s*(int|void)\s+main\s*\(([^)]*)\)\s*\{',
        ],
    },
    'javascript': {
        'import': [
            r'^\s*import\s+[^;]+;',
            r'^\s*const\s+\w+\s*=\s*require\([\'"][^\'"]+[\'"]\);',
        ],
        'class': [
            r'^\s*class\s+(\w+)\s*(?:extends\s+(\w+))?\s*\{',
        ],
        'function': [
            r'^\s*function\s+(\w+)\s*\(([^)]*)\)\s*\{',
            r'^\s*(?:const|let|var)\s+(\w+)\s*=\s*\(([^)]*)\)\s*=>\s*\{',
        ],
        'main': [
            r'^\s*\(\s*\)\s*=>\s*\{',
        ],
    },
    'kotlin': {
        'import': [
            r'^\s*import\s+[\w\.]+',
        ],
        'class': [
            r'^\s*class\s+(\w+)\s*(?:\(([\w\s,<>]+)\))?(?:\s*:\s*[\w\s,<>]+)?\s*\{',
        ],
        'function': [
            r'^\s*fun\s+(\w+)\s*\(([^)]*)\)\s*(?::\s*[\w<>]+)?\s*\{',
        ],
        'main': [
            r'^\s*fun\s+main\s*\(([^)]*)\)\s*\{',
        ],
    },
    'html': {
        'import': [
            r'<link\s+[^>]*href=["\']([^"\']+)["\']',
            r'<script\s+[^>]*src=["\']([^"\']+)["\']',
        ],
        'class': [
            r'class=["\']([\w\s-]+)["\']',
        ],
        'function': [
            r'<script[^>]*>\s*function\s+(\w+)\s*\(([^)]*)\)\s*\{',
            r'<script[^>]*>\s*(?:const|let|var)\s+(\w+)\s*=\s*\(([^)]*)\)\s*=>\s*\{',
        ],
        'main': [
            r'<script[^>]*>\s*\(\s*\)\s*=>\s*\{',
        ],
    },
}

def detect_language(file_name: str) -> Optional[str]:
    """
    Detects the programming language based on the file extension.

    Args:
        file_name (str): The name of the source code file.

    Returns:
        Optional[str]: The detected language ('python', 'java', 'cpp', 'c', 'javascript', 'kotlin', 'html'), or None if unsupported.
    """
    _, ext = os.path.splitext(file_name)
    return LANGUAGE_EXTENSIONS.get(ext.lower())

def extract_imports(code: str, language: str) -> List[str]:
    """
    Extracts import/include statements from the code using regex.

    Args:
        code (str): The source code as a string.
        language (str): The programming language of the source code.

    Returns:
        List[str]: A list of import/include statements.
    """
    imports = []
    patterns = REGEX_PATTERNS.get(language, {}).get('import', [])
    for pattern in patterns:
        matches = re.findall(pattern, code, re.MULTILINE)
        if matches:
            imports.extend(matches)
    return imports

def extract_classes(code: str, language: str) -> List[Dict[str, Optional[List[str]]]]:
    """
    Extracts class (or struct) definitions, including inheritance details.

    Args:
        code (str): The source code as a string.
        language (str): The programming language of the source code.

    Returns:
        List[Dict[str, Optional[List[str]]]]: A list of dictionaries containing class names and their inheritance.
    """
    classes = []
    patterns = REGEX_PATTERNS.get(language, {}).get('class', [])
    for pattern in patterns:
        for match in re.finditer(pattern, code, re.MULTILINE):
            class_name = match.group(1)
            inheritance = []
            if language == 'python':
                if match.group(2):
                    inheritance = [base.strip() for base in match.group(2).split(',')]
            elif language == 'java':
                if match.group(2):
                    inheritance.append(match.group(2).strip())  # extends
                if match.group(3):
                    inheritance.extend([iface.strip() for iface in match.group(3).split(',')])  # implements
            elif language == 'cpp':
                if match.group(2):
                    inheritance.append(match.group(2).strip())  # first inheritance
                if match.groups()[2:]:
                    # Additional inheritances
                    inheritance.extend([grp.strip() for grp in match.groups()[2:] if grp])
            elif language == 'c':
                # C structs do not inherit, so inheritance remains empty
                inheritance = None
            elif language == 'javascript':
                if match.group(2):
                    inheritance.append(match.group(2).strip())  # extends
            elif language == 'kotlin':
                if match.group(2):
                    inheritance.append(match.group(2).strip())  # primary constructor or inheritance
            # HTML classes are handled differently (CSS classes), so no inheritance
            classes.append({
                'name': class_name,
                'inheritance': inheritance if inheritance else None
            })
    return classes

def extract_functions(code: str, language: str) -> List[str]:
    """
    Extracts function/method definitions, including their parameters.

    Args:
        code (str): The source code as a string.
        language (str): The programming language of the source code.

    Returns:
        List[str]: A list of function/method definitions with parameters.
    """
    functions = []
    patterns = REGEX_PATTERNS.get(language, {}).get('function', [])
    for pattern in patterns:
        for match in re.finditer(pattern, code, re.MULTILINE):
            if language == 'python':
                func_name = match.group(1)
                params = match.group(2).strip()
                func_def = f"def {func_name}({params}):"
                functions.append(func_def)
            elif language == 'java':
                func_name = match.group(3)
                params = match.group(4).strip()
                access_modifier = match.group(1) or ''
                static_modifier = match.group(2) or ''
                return_type = match.group(3)
                parts = [part for part in [access_modifier, static_modifier, return_type, func_name] if part]
                func_def = ' '.join(parts) + f"({params})"
                functions.append(func_def)
            elif language == 'cpp':
                func_name = match.group(1)
                params = match.group(2).strip()
                return_type_match = re.search(r'([\w\*&<>]+)\s+' + re.escape(func_name) + r'\s*\(', match.group(0))
                if return_type_match:
                    return_type = return_type_match.group(1)
                else:
                    return_type = ''
                func_def = f"{return_type} {func_name}({params})"
                functions.append(func_def)
            elif language == 'c':
                func_name = match.group(1)
                params = match.group(2).strip()
                return_type_match = re.search(r'([\w\*\s]+)\s+' + re.escape(func_name) + r'\s*\(', match.group(0))
                if return_type_match:
                    return_type = return_type_match.group(1).strip()
                else:
                    return_type = ''
                func_def = f"{return_type} {func_name}({params})"
                functions.append(func_def)
            elif language == 'javascript':
                func_name = match.group(1)
                params = match.group(2).strip()
                if 'function' in match.group(0):
                    func_def = f"function {func_name}({params})"
                else:
                    func_def = f"{func_name}({params}) =>"
                functions.append(func_def)
            elif language == 'kotlin':
                func_name = match.group(1)
                params = match.group(2).strip()
                return_type_match = re.search(r':\s*([\w<>]+)', match.group(0))
                if return_type_match:
                    return_type = return_type_match.group(1)
                    func_def = f"fun {func_name}({params}): {return_type}"
                else:
                    func_def = f"fun {func_name}({params})"
                functions.append(func_def)
            elif language == 'html':
                func_name = match.group(1)
                params = match.group(2).strip()
                func_def = f"function {func_name}({params})"  # Treat as JavaScript function
                functions.append(func_def)
    return functions

def extract_main(code: str, language: str) -> Optional[str]:
    """
    Detects the main function in the code.

    Args:
        code (str): The source code as a string.
        language (str): The programming language of the source code.

    Returns:
        Optional[str]: The main function definition line, or None if not found.
    """
    main_patterns = REGEX_PATTERNS.get(language, {}).get('main', [])
    for pattern in main_patterns:
        match = re.search(pattern, code, re.MULTILINE)
        if match:
            if language == 'python':
                func_def_pattern = r'def\s+main\s*\(([^)]*)\)\s*:'
                func_match = re.search(func_def_pattern, code, re.MULTILINE)
                if func_match:
                    func_name = 'main'
                    params = func_match.group(1).strip()
                    func_def = f"def {func_name}({params}):"
                    return func_def
                else:
                    main_block_pattern = r'if\s+__name__\s*==\s*[\'"]__main__[\'"]\s*:'
                    main_block_match = re.search(main_block_pattern, code, re.DOTALL | re.MULTILINE)
                    if main_block_match:
                        return "if __name__ == '__main__':"
            elif language in ['java', 'cpp', 'c', 'kotlin']:
                func_def_pattern = pattern + r'.*?(?:\{|;)'
                func_match = re.search(func_def_pattern, code, re.DOTALL | re.MULTILINE)
                if func_match:
                    func_def_line = func_match.group(0).strip()
                    func_def_line = re.sub(r'[\{\};\s]+$', '', func_def_line).strip()
                    return func_def_line
            elif language == 'javascript':
                return None
            elif language == 'html':
                return None
    return None

def process_json_structure(data: Union[Dict, List], parent_path: str = "") -> Union[Dict, List]:
    """
    Recursively processes the JSON structure, parsing code files and replacing their content with parsed elements.
    
    Args:
        data (Union[Dict, List]): The JSON data as a dictionary or list.
        parent_path (str): The current file path during recursion.
    
    Returns:
        Union[Dict, List]: The processed JSON data.
    """
    if isinstance(data, dict):
        processed_data = {}
        for key, value in data.items():
            current_path = os.path.join(parent_path, key)
            if isinstance(value, dict):
                processed_data[key] = process_json_structure(value, current_path)
            elif isinstance(value, str):
                language = detect_language(key)
                if language:
                    parsed_elements = parse_code_content(value, language)
                    if parsed_elements:
                        processed_data[key] = parsed_elements
                    else:
                        processed_data[key] = {}
                elif key.lower() == "readme.md":
                    processed_data[key] = value
                else:
                    pass
            else:
                pass
        return processed_data
    elif isinstance(data, list):
        return [process_json_structure(item, parent_path) for item in data]
    else:
        return data

def parse_code_content(code: str, language: str) -> Dict[str, Optional[List[str]]]:
    """
    Parses the code content and extracts imports, classes, functions, and main function.
    
    Args:
        code (str): The source code as a string.
        language (str): The programming language of the source code.
    
    Returns:
        Dict[str, Optional[List[str]]]: A dictionary containing the extracted elements.
    """
    imports = extract_imports(code, language)
    classes = extract_classes(code, language)
    functions = extract_functions(code, language)
    main_function = extract_main(code, language)
    
    parsed_elements = {}
    
    if imports:
        parsed_elements['imports'] = imports
    if classes:
        parsed_elements['classes'] = classes
    if functions:
        parsed_elements['functions'] = functions
    if main_function:
        parsed_elements['main_function'] = main_function
    
    return parsed_elements

def parser_code(repo_name: str) -> Dict[str, Union[Dict, List, str]]:
    base_url = "https://superhero-02-01-150699885662.europe-west1.run.app/api/repo/FEUP-MEIC-DS-2024-25/{repo_name}"
    url = base_url.format(repo_name=repo_name)
    
    try:
        response = requests.get(url)
        response.raise_for_status() 
    except requests.exceptions.RequestException as e:
        print(f"Error requesting {url}: {e}")
        return {}
    
    try:
        input_data = response.json()
    except json.JSONDecodeError as e:
        print(f"Erro deconding json: {e}")
        return {}
    
    processed_data = process_json(input_data)
    
    return processed_data
