# Superhero implementation

## Initial setup
Not much needs to be done, just create a file called .env with these contents:
```
API_BASE_URL="http://localhost:5432"
API_ENDPOINT="remote"
```
Be careful as these contents may change with other heroes being implemented so check this every now and then.

## New Superhero implementation tutorial
1. Let's start by creating the file where you superheroes' frontend will be. Go to the folder `superheroes` located inside `src` folder and create a new TypeScript file.
2. As a baseline, you can copy the code written in the [template file](/x-men/frontend/src/superheroes/Template.ts). It's not much, but at least it's a start!
3. Now that you have a file, add a new option to the dropdown with the call to your file in the [extension](/x-men/frontend/src/extension.ts) itself. You can copy the code template already present that uses the `Template.ts` file and just change the name to you superhero name (be careful, in the import the file is a .js file but keep using the name of you superhero without changing the file to .ts)
4. Now you can code inside you superhero file just like you would if you were developing the extension by yourself! We recomend you to have a look at the [Visual Studio Code Extension Guide](https://code.visualstudio.com/api/extension-guides/overview), as it contains multiple examples of some features you may want in your extension!
5. Finally, to test your code just make sure you are in the `/x-men/frontent` folder, click f5 and chose the VSCode Extension Development and then Ctrl+Shift+P and search for the AI4SD extension command. Once selected, just find your superhero name and select it and watch it run!

## Extra notes
In case you need to create a function that you think other groups could benefit from, feel free to add it to the [utils file](/x-men/frontend/src/utils/utils.ts)! You may want to check it out early on in your development, you never know, it might have a function that you need.

If you find yourself needing to get information from a .env file, don't create a new one, just add the information to new to the already existing one and edit this page to reflect its new contents, to let other groups now what to insert in said file!

## Changes
| Date       | Author                     | Description     |
|------------|----------------------------|-----------------|
| 15/11/2024 | Igor Monteiro de Andrade   | Guide creation  |