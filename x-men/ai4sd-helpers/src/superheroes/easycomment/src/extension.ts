// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import axios, { get } from 'axios';
import {updateComments, CodeComment} from './parsingModes/fileByfile';
import OpenAI from 'openai';
import { url } from 'inspector';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

function getConfiguration(configuration:string) : string{
	//check if api key is stored in the settings
	const ApiKey = vscode.workspace.getConfiguration().get(configuration);
	return ApiKey as string;
}

async function updateCofiguration(configuration:string,searchQuery:string){
    const config = vscode.workspace.getConfiguration();
    await config.update(configuration, searchQuery, vscode.ConfigurationTarget.Global);
}

async function getCommentsFromServer(languageId: string, text: string, apiKey: string, language: string): Promise<string> {
    try {
      console.log("Getting comments from server");
    const response = await axios.post("https://superhero-07-04-150699885662.europe-west1.run.app/generate-comments", {
        languageId,
        text,
        apiKey,
        language,
      },
        {
            headers: {
            'Content-Type': 'application/json',
            },
        }
    );
      return response.data.comments;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error(`HTTP status code: ${error.response.status}`);
          console.error(`HTTP status message: ${error.response.statusText}`);
          console.error(`Response data: ${JSON.stringify(error.response.data, null, 2)}`);
        } else if (error.request) {
          // The request was made but no response was received
          console.error("No response received from the server");
        } else {
          // Something else happened while setting up the request
          console.error("Error setting up the request:", error.message);
        }
      } else {
        // A non-Axios error occurred
        console.error("An unexpected error occurred:", error);
      }
      throw error;
    }
  }

async function getCommentsFromServerSplitFunctions(languageId: string, text: string, apiKey: string, language: string): Promise<string> {
    if (languageId !== "cpp" && languageId !== "dart") {
        throw new Error(`Only C++ and Dart is supported for split functions mode language ${languageId}`);
    }
    console.log("Getting comments from server split functions");
    const response = await axios.post("https://superhero-07-04-150699885662.europe-west1.run.app/generate-comments-splited", {
        languageId,
        text,
        apiKey,
        language
    });
    return response.data.comments;
}

async function getParsedFunctions(languageId: string, text: string, apiKey: string, language: string): Promise<[number,string][]> {
    if (languageId !== "cpp" && languageId !== "dart") {
        throw new Error(`Only C++ and Dart is supported for split functions mode language ${languageId}`);
    }
    console.log("Getting comments from server split functions");
    const response = await axios.post("https://superhero-07-04-150699885662.europe-west1.run.app/generate-split-code", {
        languageId,
        text,
        apiKey,
        language
    });
    const functions = JSON.parse(response.data.functions);
    console.log("Functions", functions);
    //const functions1: Map<number, { body: string }> = functions;
    const results: [number,string][] = [];
    for (const key in functions) {
        console.log(key,functions[key].body);
        results.push([parseInt(key), functions[key].body]);
    }
    console.log("parsed functions", results);
    return results;
}

async function selfhostTest(data: [number, string][], languageId: string) {
    const genAI = new OpenAI({
        baseURL: getConfiguration('EasyComment.url_host_llm'),
        apiKey: getConfiguration("EasyComment.apikey_host_llm"), // This is the default and can be omitted
      });
    const comments: CodeComment[] = [];
    for (const [key, value] of data) {
        const prompt = `Create a detailed Text only documentation for each function in ${languageId}. Without the function signature and no example code.
            ${value}`;

        const params: OpenAI.Chat.ChatCompletionCreateParams = {
            messages: [{ role: 'system', content: 'answer only in text you are a documentation generator Create deatiled but brief documentation Dont asnwer anything else' },
                {"role": "user", "content": prompt}
            ],
            model: getConfiguration("EasyComment.model_used"),
            temperature: 0.1,
            };
            const chatCompletion: OpenAI.Chat.ChatCompletion = await genAI.chat.completions.create(params);

                    // Split the string into an array of lines
        let linesArray: string = chatCompletion.choices[0].message.content ?? '';//.split('\n');
        console.log('Result:', linesArray);
        comments.push({ line: key -1, comment: "/*"+linesArray+"*/" });
    }
    return comments;
}

async function askForApiKey(){
	do {
		var searchQuery = await vscode.window.showInputBox({
			placeHolder: "Search query",
			prompt: "Insert your api key",
			value: "API_KEY",
		  });
		  if(searchQuery === ''){
			console.log(searchQuery);
			vscode.window.showErrorMessage('Api key is required');
		  }else{
            await updateCofiguration('EasyComment.apikey', searchQuery || '');
            vscode.window.showInformationMessage('API key has been updated successfully');
            return searchQuery;
          }

	} while (searchQuery === '');
	return searchQuery;
}

async function test(){
    const response = await axios.get("https://superhero-07-04-150699885662.europe-west1.run.app");
    console.log(response.data);
    return response.data;
}

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "EasyComment" is now active!');


    async function getLanguage(): Promise<string> {
        let language = vscode.workspace.getConfiguration().get('EasyComment.language') as string;
        if (!language || language === "") {
            const selectedLanguage = await vscode.window.showQuickPick(
                ["English", "Spanish", "French", "German", "Italian", "Portuguese","Other"],
                { placeHolder: 'Select your preferred language for comments' }
            );
            if (selectedLanguage) {
                if (selectedLanguage === "Other") {
                    language = await vscode.window.showInputBox({
                        prompt: 'Please type your preferred language for comments'
                    }) || "";
                } else {
                    language = selectedLanguage;
                }
                await updateCofiguration('EasyComment.language', language);
            }
        }
        else if(language === "Other"){
            console.log("Language other");
            language = await vscode.window.showInputBox({
                prompt: 'Please type your preferred language for comments'
            }) || "Not Selected";
            await updateCofiguration('EasyComment.language', language,);
        }
        
        return language;
    }
    
    const disposable = vscode.commands.registerTextEditorCommand('EasyComment.annotate', async (textEditor: vscode.TextEditor) => {
        vscode.window.showInformationMessage('Successfully Initiated the command!');

        const apiKey = getConfiguration('EasyComment.apikey');
        if (apiKey === "") {
            const apiKey = await askForApiKey();
            if (apiKey === '') {
                return;
            }
        }
        const language = await getLanguage();

        const testResult = await test();
        console.log(testResult);
        console.log('Language:', textEditor.document.languageId);
        let mode = 2;//TODO Leagacy is going to be a bit changed
        if(textEditor.document.languageId === "python"){
            const response = await getCommentsFromServer(textEditor.document.languageId, textEditor.document.getText(), apiKey, language);
            //console.log(response);
            const comments: CodeComment[] = JSON.parse(response);
            console.log(comments);
            updateComments(textEditor,comments);
        }else if(mode===1){
            console.log("Split functions");
            const functions = await getParsedFunctions(textEditor.document.languageId, textEditor.document.getText(), apiKey, language);
            console.log('Parsed functions:', functions);
            const comments: CodeComment[] = await selfhostTest(functions, textEditor.document.languageId);
            updateComments(textEditor,comments);
        }else{
            console.log("Split functions");
            const response = await getCommentsFromServerSplitFunctions(textEditor.document.languageId, textEditor.document.getText(), apiKey, language);
            const comments: CodeComment[] = JSON.parse(response);
            updateComments(textEditor,comments);
        }

    });

    context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {
    console.log('Deactivated');
}


// Add the execute function
export async function execute() {
    vscode.window.showInformationMessage('Hello World from EasyComment');
}