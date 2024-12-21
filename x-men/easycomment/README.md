# T07_G04_FrontEnd
FrontEnd of EasyComment.

# EasyComment README

This is the README for your extension "EasyComment". We recommend doing the following:

```bash
cd server
npm install
docker build -t easycomment .
docker run -p 8080:8080 easycomment
```

## Start a selfhost llm to test
- install lmStudio https://lmstudio.ai/
- Search for the desired llm you want to host
- Select the version of the model you want and can host, warning try to run models when it says full fpu offload possible, to not run the model in cpu, it will be very slow

![lmStudio](./images/lmStudio.png)

- Press on Local server

![lmStudio1](./images/lmstudio1.png)

- Now we will press the Select model to load and it will show the models downloaded in the previous step
- Select the model it will start to load automaticly
![lmStudio1](./images/lmstudio2.png)

- Check in the left bar if you are using max gpu offload, if it errors out try to use as much as possible of the gpu, if not the llm will be slow

![lmStudio1](./images/lmstudio3.png)

- if the buttom is green you can press the start button and it will start the server

![lmStudio1](./images/lmstudio4.png)

- Now to add the server to our extension we will go to the settings of the extension and add the server url, the model, and the api key.
- The implementation in my extension is using the openai api that has it own library in almost all programing languages.

![lmStudio1](./images/lmstudio5.png) 

![lmStudio1](./images/extension_config.png) 


