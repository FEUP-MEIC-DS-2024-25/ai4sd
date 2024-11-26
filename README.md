# Hero Alliance: Cloud Infrastructure Quickstart

## Step-by-step guide

1. **Ask your professor for a JSON key** for your specific superhero
2. Once you get the key, you can use it on your code files (just be sure to not store it in the repository: save it as a secret, do not leave it publicly accessible). Authenticate with `gcloud auth activate-service-account --key-file=superhero-0Y-0Y.json`
3. In order to deploy your code to the cloud, you simply create a branch from main, make a Pull Request with the changes you have in mind, and, if/when it gets accepted and merged, a pipeline will be triggered

## Important remarks
- **The pipeline will only work for superheroes if you comply with the following conditions**:
    - You must respect the structure of the AI4SD repository. That means the root of the repository should look like this:
        - `avengers/`
        - `x-men/`
        - `superheroes/`
            - `superhero-01-01/`
            - `superhero-01-02/`
            - ...
        - `strange/`
        - `jarvis/`
        - `infrastructure/`
            - `pipeline`
            - `terraform`
    - So, if, for instance, you are working on superhero-01-02, put that code inside the respective file. **If you don't respect this hierarchy, your changes won't be picked up by the pipeline**
    - In order for the pipeline to update your superhero, **it must have a Dockerfile in its root path**. For the example above, the path would be `superheroes/superhero-01-02/Dockerfile`
    - Additionally, **inside the avengers/ folder, you must have an index.html file. Otherwise, your web app will not be visible in its public link**
- The pipeline is responsible for building, pushing, and deploying a docker image of your superhero to the cloud. This is an entirely automated process, so there is no need to run any commands in a CLI
- If you have not yet created your repository, then an example `hello-world` image will be used for all cloud run instances. Only when you follow all of the above instructions will you be able to have the cloud update your superhero
- **Regarding X-Men, it will not be deployed in the cloud**, as it is a VS Code extension. However, you may extend the existing pipeline with building and publication automations if you so desire. The best way to automate that process is up to you to decide
- You have at your availability the following resources:
    - **avengers** cloud storage bucket: the web app of AI4SD *(up to you to develop)*
        - This is not a VM but a data container. Because you will be using ReactJS to develop the frontend of the app, its output are just static files. Thus, this is a cost effective approach for maintaining a frontend.
    - **superhero-0X-0Y** cloud run instance: your superhero service powered by GenAI capabilities *(up to you to develop by us)*
        - The service account name of your superhero follows the format `superhero-0X-0Y@hero-alliance-feup-ds-24-25.iam.gserviceaccount.com`
    - **nexus** cloud storage bucket: a data bucket that will hold the repositories your superhero will use *(already deployed by us)*
        - We recommend creating one folder per superhero. Inside that folder you can put whatever you want there
    - **vault** firestore: data storage for holding information specific to your superhero (internally it is mandatory that it is referred by GCP as `(default)`) *(already deployed by us)*
        - Again, we recommend one collection per superhero
    - **strange** cloud run instance: a service for orchestrating superhero execution *(up to you to develop by us)*
        - The service account name of strange follows the format `hero-alliance-strange@hero-alliance-feup-ds-24-25.iam.gserviceaccount.com`
    - **jarvis** cloud run instance: a service for synchronizing the contents of **nexus** with GitHub *(already deployed by us)*
        - The service account name of jarvis follows the format `hero-alliance-jarvis@hero-alliance-feup-ds-24-25.iam.gserviceaccount.com`
    - **echo-jarvis** pub/sub: a communication channel that allows **jarvis** to let superheroes know there are updates in repositories held in **nexus** *(already deployed by us)*
    - **echo-superheroes** pub/sub: same as above, but for **superheroes** to communicate with each other *(already deployed by us)*

## Public superhero links
- **avengers**: https://storage.googleapis.com/hero-alliance-avengers/index.html
- **superhero-0X-0Y**: https://superhero-0X-0Y-150699885662.europe-west1.run.app
