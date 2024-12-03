from django.db import models
import os
import subprocess
from django.conf import settings
import shutil
from .prompt import generate_description_uml

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
        """ Compiles PlantUML code to generate an image and stores it. """
        if self.plantuml_code:
            plantuml_jar = os.path.join(settings.BASE_DIR, 'plantuml.jar')
            plantuml_dir = os.path.join(settings.MEDIA_DIR, 'plantuml_input')
            output_dir = os.path.join(settings.MEDIA_DIR, 'plantuml_images')  # Correctly set output dir
            os.makedirs(plantuml_dir, exist_ok=True)
            os.makedirs(output_dir, exist_ok=True)

            plantuml_input = os.path.join(plantuml_dir, f'{self.id}.txt')

            # Save PlantUML code to a .txt file
            with open(plantuml_input, 'w') as f:
                f.write(self.plantuml_code)

            # Run PlantUML and generate the image (output to the directory, not the file)
            subprocess.run([
                'java', '-jar', plantuml_jar, plantuml_input,
                '-o', output_dir  # Only specify the directory here
            ])

            # After generating, rename the output file to match {self.id}_diagram.png
            generated_image_path = os.path.join(output_dir, f'{self.id}.png')
            final_image_path = os.path.join(output_dir, f'{self.id}_diagram.png')

            # Rename the image file
            if os.path.exists(generated_image_path):
                shutil.move(generated_image_path, final_image_path)

            # Assign the renamed image to the plantuml_image field
            self.plantuml_image = f'plantuml_images/{self.id}_diagram.png'
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
            
