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

    def generate_plantuml_image(self):
        """ Sends PlantUML code to a server to generate an image and stores it. """
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
                self.save()


    def save(self, *args, **kwargs):
        initial_save = not self.pk
        if initial_save:
            print("Initial save")
            super().save(*args, **kwargs)
            if not self.repo_path:
                self.repo_path = self.github_link.split('/')[-1]

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
            original = Project.objects.get(pk=self.pk)
            original_code = original.plantuml_code

            super().save(*args, **kwargs)

            if self.plantuml_code != original_code:
                self.generate_plantuml_image()
                super().save(*args, **kwargs)