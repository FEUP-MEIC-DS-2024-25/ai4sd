import os
import subprocess
import re
from pathlib import Path

def clone_design_patterns_repo(repo_url, clone_dir):
    if not os.path.exists(clone_dir):
        os.makedirs(clone_dir)
    repo_name = os.path.basename(repo_url).replace('.git', '')
    repo_path = os.path.join(clone_dir, repo_name)
    if not os.path.exists(repo_path):
        subprocess.run(['git', 'clone', repo_url, repo_path], check=True)
    return repo_path

def read_readme(repo_path):
    readme_path = os.path.join(repo_path, 'README.md')
    with open(readme_path, 'r', encoding='utf-8') as f:
        return f.read()

def extract_patterns_from_readme(readme_content):
    pattern_table_regex = r'\| ⬜ Creational \| 🟨 Structural \| 🟥 Behavioral \| Assumption: \|\n\|.*?\|\n(.*?)\n\n'
    match = re.search(pattern_table_regex, readme_content, re.DOTALL)
    if not match:
        raise ValueError('Pattern table not found in README.md')
    table_content = match.group(1)
    pattern_links = re.findall(r'\[([^\]]+)\]\(#([^\)]+)\)', table_content)
    return pattern_links

def extract_pattern_descriptions(readme_content, pattern_links):
    pattern_descriptions = {}
    for name, anchor in pattern_links:
        section_regex = rf'## <a name="{anchor}">.*?</a>.*?\n(.*?)\n#### UML diagram:'
        match = re.search(section_regex, readme_content, re.DOTALL)
        description = match.group(1).strip() if match else 'Description not found.'
        pattern_descriptions[name] = description
    return pattern_descriptions

def standardize_name(name):
    return name.lower().replace(' ', '-').replace('_', '-')

def create_pattern_directory_map(pattern_links, repo_path):
    pattern_dir_map = {}
    base_dir = os.path.join(repo_path, 'src', 'app')
    categories = ['creational', 'structural', 'behavioral']
    for category in categories:
        category_dir = os.path.join(base_dir, category)
        if not os.path.exists(category_dir):
            continue
        for pattern_name in os.listdir(category_dir):
            pattern_path = os.path.join(category_dir, pattern_name)
            if os.path.isdir(pattern_path):
                dir_name_standard = standardize_name(pattern_name)
                pattern_dir_map[dir_name_standard] = pattern_path

    pattern_directory_mapping = {}
    for name, _ in pattern_links:
        name_standard = standardize_name(name)
        if name_standard in pattern_dir_map:
            pattern_directory_mapping[name] = pattern_dir_map[name_standard]
    return pattern_directory_mapping

def extract_code_files(pattern_path):
    code = ''
    for root, dirs, files in os.walk(pattern_path):
        for file in files:
            if file.endswith(('.ts', '.js', '.java', '.py', '.cs')):
                file_path = os.path.join(root, file)
                with open(file_path, 'r', encoding='utf-8') as f:
                    code += f'// File: {file}\n{f.read()}\n'
    return code.strip()

def extract_plantuml_code(pattern_path):
    plantuml_code = ''
    for root, dirs, files in os.walk(pattern_path):
        for file in files:
            if file.endswith('.puml'):
                file_path = os.path.join(root, file)
                with open(file_path, 'r', encoding='utf-8') as f:
                    plantuml_code += f.read() + '\n'
    return plantuml_code.strip()

def collect_design_pattern_data(pattern_links, pattern_descriptions, pattern_directory_mapping):
    design_patterns = []
    for name, _ in pattern_links:
        pattern_data = {
            'name': name,
            'description': pattern_descriptions.get(name, 'No description available.'),
            'code': '',
            'plantuml_code': ''
        }
        pattern_path = pattern_directory_mapping.get(name)
        if pattern_path:
            pattern_data['code'] = extract_code_files(pattern_path)
            pattern_data['plantuml_code'] = extract_plantuml_code(pattern_path)
        design_patterns.append(pattern_data)
    return design_patterns

def store_design_patterns_in_files(design_patterns):
    output_dir = Path('patterns_collection')
    output_dir.mkdir(exist_ok=True)

    for pattern in design_patterns:
        filename = standardize_name(pattern['name']) + '.md'
        file_path = output_dir / filename
        code_block = f"```\n{pattern['code']}\n```" if pattern['code'] else "```\n```"
        plantuml_block = f"```plantuml\n{pattern['plantuml_code']}\n```" if pattern['plantuml_code'] else "```plantuml\n```"

        # YAML front matter and structured Markdown
        description_formatted = pattern['description'].replace('\n', '\n  ')

        content = (
            f"---\n"
            f"name: {pattern['name']}\n"
            f"description: |\n  {description_formatted}\n"
            f"---\n\n"
            f"## Code\n"
            f"{code_block}\n\n"
            f"## PlantUmlCode\n"
            f"{plantuml_block}\n"
        )


        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)

def ingest_design_patterns():
    repo_url = 'https://github.com/plkpiotr/design-patterns.git'
    clone_dir = './design_patterns_repo'
    repo_path = clone_design_patterns_repo(repo_url, clone_dir)
    readme_content = read_readme(repo_path)
    pattern_links = extract_patterns_from_readme(readme_content)
    pattern_descriptions = extract_pattern_descriptions(readme_content, pattern_links)
    pattern_directory_mapping = create_pattern_directory_map(pattern_links, repo_path)
    design_patterns = collect_design_pattern_data(pattern_links, pattern_descriptions, pattern_directory_mapping)
    store_design_patterns_in_files(design_patterns)
    return design_patterns

def main():
    ingest_design_patterns()

if __name__ == '__main__':
    main()
