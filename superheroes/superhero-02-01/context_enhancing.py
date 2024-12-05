import os
import subprocess
import re
import logging
from pathlib import Path
from django.conf import settings
from django.db import transaction
from django.core.management.base import BaseCommand

import sys
import django

project_dir = Path(__file__).resolve().parent
sys.path.append(str(project_dir))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'settings.settings')
django.setup()

#importing the model after configuring the django setup
from core.models import DesignPattern

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')
logger = logging.getLogger(__name__)

def clone_design_patterns_repo(repo_url, clone_dir):
    if not os.path.exists(clone_dir):
        os.makedirs(clone_dir)
    repo_name = os.path.basename(repo_url).replace('.git', '')
    repo_path = os.path.join(clone_dir, repo_name)
    if not os.path.exists(repo_path):
        logger.info(f"Cloning repository '{repo_name}'...")
        subprocess.run(['git', 'clone', repo_url, repo_path], check=True)
    else:
        logger.info(f"Repository '{repo_name}' already cloned.")
    return repo_path

def read_readme(repo_path):
    readme_path = os.path.join(repo_path, 'README.md')
    with open(readme_path, 'r', encoding='utf-8') as f:
        readme_content = f.read()
    logger.info("Read 'README.md' content.")
    return readme_content

def extract_patterns_from_readme(readme_content):
    pattern_table_regex = r'\| ⬜ Creational \| 🟨 Structural \| 🟥 Behavioral \| Assumption: \|\n\|.*?\|\n(.*?)\n\n'
    match = re.search(pattern_table_regex, readme_content, re.DOTALL)
    if match:
        table_content = match.group(1)
    else:
        raise ValueError('Pattern table not found in README.md')

    # Extract pattern names and links
    pattern_links = re.findall(r'\[([^\]]+)\]\(#([^\)]+)\)', table_content)
    logger.info(f"Extracted {len(pattern_links)} patterns from 'README.md'.")
    return pattern_links

def extract_pattern_descriptions(readme_content, pattern_links):
    pattern_descriptions = {}
    for name, anchor in pattern_links:
        # Build a regex pattern to find the section
        section_regex = rf'## <a name="{anchor}">.*?</a>.*?\n(.*?)\n#### UML diagram:'
        match = re.search(section_regex, readme_content, re.DOTALL)
        if match:
            description = match.group(1).strip()
            pattern_descriptions[name] = description
            logger.debug(f"Extracted description for pattern '{name}'.")
        else:
            pattern_descriptions[name] = 'Description not found.'
            logger.warning(f"Description for pattern '{name}' not found.")
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
    # Map pattern names from README to directory paths
    pattern_directory_mapping = {}
    for name, _ in pattern_links:
        name_standard = standardize_name(name)
        if name_standard in pattern_dir_map:
            pattern_directory_mapping[name] = pattern_dir_map[name_standard]
        else:
            logger.warning(f"Pattern directory for '{name}' not found.")
    logger.info(f"Mapped {len(pattern_directory_mapping)} patterns to directories.")
    return pattern_directory_mapping

def extract_code_files(pattern_path):
    code = ''
    for root, dirs, files in os.walk(pattern_path):
        for file in files:
            if file.endswith(('.ts', '.js', '.java', '.py', '.cs')):  # Adjust extensions as needed
                file_path = os.path.join(root, file)
                with open(file_path, 'r', encoding='utf-8') as f:
                    code += f'\n// File: {file}\n'
                    code += f.read() + '\n'
    return code

def extract_plantuml_code(pattern_path):
    plantuml_code = ''
    for root, dirs, files in os.walk(pattern_path):
        for file in files:
            if file.endswith('.puml'):
                file_path = os.path.join(root, file)
                with open(file_path, 'r', encoding='utf-8') as f:
                    plantuml_code += f.read() + '\n'
    return plantuml_code

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
            logger.info(f"Collected data for pattern '{name}'.")
        else:
            logger.warning(f"No directory found for pattern: {name}")
        design_patterns.append(pattern_data)
    return design_patterns

def store_design_patterns_in_db(design_patterns):
    stored_patterns = []
    for pattern in design_patterns:
        design_pattern, created = DesignPattern.objects.update_or_create(
            name=pattern['name'],
            defaults={
                'description': pattern['description'],
                'code': pattern['code'],
                'plantuml_code': pattern['plantuml_code']
            }
        )
        stored_patterns.append(design_pattern)
        if created:
            logger.info(f"Created new DesignPattern: {pattern['name']}")
        else:
            logger.info(f"Updated DesignPattern: {pattern['name']}")
    return stored_patterns


def ingest_design_patterns():
    repo_url = 'https://github.com/plkpiotr/design-patterns.git'
    clone_dir = os.path.join(settings.BASE_DIR, 'design_patterns_repo')
    repo_path = clone_design_patterns_repo(repo_url, clone_dir)
    readme_content = read_readme(repo_path)
    pattern_links = extract_patterns_from_readme(readme_content)
    pattern_descriptions = extract_pattern_descriptions(readme_content, pattern_links)
    pattern_directory_mapping = create_pattern_directory_map(pattern_links, repo_path)
    design_patterns = collect_design_pattern_data(pattern_links, pattern_descriptions, pattern_directory_mapping)
    stored_patterns = store_design_patterns_in_db(design_patterns)
    logger.info("Ingestion of design patterns completed.")
    return stored_patterns

def main():
    try:
        logger.info("Starting context enhancement...")
        stored_patterns = ingest_design_patterns()
        logger.debug(f"Stored patterns: {stored_patterns}")
        # Log an example document
        if stored_patterns:
            example_pattern = stored_patterns[0]  # Get the first pattern
            logger.info("Example DesignPattern document:")
            logger.info(f"Name: {example_pattern.name}")
            logger.info(f"Description: {example_pattern.description[:100]}...")  # First 100 characters
            logger.info(f"Code snippet:\n{example_pattern.code[:500]}...")  # First 500 characters
            logger.info(f"PlantUML code:\n{example_pattern.plantuml_code[:500]}...")  # First 500 characters
        else:
            logger.warning("No DesignPattern documents were stored.")
        logger.info("Context enhancement completed.")
    except Exception as e:
        logger.exception("An error occurred during context enhancement.")


if __name__ == '__main__':
    main()

