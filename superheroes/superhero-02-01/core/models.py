from django.db import models
import os
import subprocess
from django.conf import settings
import shutil
from .prompt import generate_description_uml
import requests


class Project(models.Model):
    name = models.CharField(max_length=255)
    response = models.TextField(null=True, blank=True)
    github_link = models.URLField()
    plantuml_code = models.TextField(null=True, blank=True)
    repo_path = models.CharField(max_length=500, null=True, blank=True)
    plantuml_image = models.ImageField(upload_to='plantuml_images/', null=True, blank=True)

    def clone_repo(self):
        """ Clones the GitHub repository and stores it in static folder. """
        if self.github_link:
            repo_name = os.path.basename(self.github_link).replace('.git', '')
            repo_dir = os.path.join(settings.MEDIA_DIR, 'repos', repo_name)
            print(repo_dir)

            # Clone repo if it doesn't exist
            if not os.path.exists(repo_dir):
                subprocess.run(['git', 'clone', self.github_link, repo_dir])
            self.repo_path = repo_dir
            self.save()

    def generate_plantuml_image(self):
        """ Sends PlantUML code to a server to generate an image and stores it. """
        print("Generating PlantUML image")
        if self.plantuml_code:
            url = settings.PLANTUML_SERVER_URL
            headers = {'Content-Type': 'text/plain'}
            response = requests.post(url, headers=headers, data=self.plantuml_code)

            if response.status_code == 200:
                output_dir = os.path.join(settings.MEDIA_DIR, 'plantuml_images')
                os.makedirs(output_dir, exist_ok=True)
                final_image_path = os.path.join(output_dir, f'{self.id}_diagram.png')

                with open(final_image_path, 'wb') as f:
                    f.write(response.content)

                self.plantuml_image = f'plantuml_images/{self.id}_diagram.png'
                print(f"PlantUML image saved to {self.plantuml_image}")
                self.save()


    def save(self, *args, **kwargs):
        initial_save = not self.pk
        if initial_save:
            print("Initial save")
            super().save(*args, **kwargs)
            # Clone GitHub repository when creating the project
            if not self.repo_path:
                print("Cloning repo")
                self.clone_repo()
            
            if self.repo_path:
                print("Generating description")
                description, code = generate_description_uml(self.repo_path)
                self.response = description
                self.plantuml_code = code

            # Generate PlantUML image
            if self.plantuml_code:
                print("Generating PlantUML image")
                self.generate_plantuml_image()

            super().save(*args, **kwargs)
        else:
            print("else")
            # Fetch the current value from the database
            original = Project.objects.get(pk=self.pk)
            original_code = original.plantuml_code

            # Save the new values to the database
            super().save(*args, **kwargs)

            # Check if the plantuml_code has changed and regenerate the image if it has
            if self.plantuml_code != original_code:
                self.generate_plantuml_image()
                super().save(*args, **kwargs)  # Update the instance with the new image path
            
