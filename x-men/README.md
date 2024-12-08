# Superhero implementation

## Initial setup
Insert here the contents of the .env file for each of the extensions, if needed.

### AI4SD Analysers
Nothing needed

### AI4SD Chat Bots
Nothing needed

### AI4SD Helpers
Nothing needed

## New Superhero implementation tutorial
1. Let's start of by heading to the correct extension. Depending on what your hero does, insert it in either `ai4sd-analysers` (simply uses the code and retrieves something as an analysis), `ai4sd-chat-bots` or `ai4sd-helpers` (modify the code, by adding comments for e.g.).
2. Now that you are in the correct extension, start by creating the file where you superheroes' frontend will be. Go to the folder `superheroes` located inside `src` folder and create a new TypeScript file.
3. As a baseline, you can copy the code written in the [template file](/x-men/ai4sd-analysers/src/superheroes/Template.ts). This file is present in all of the extensions but it has the same content in all of them. It's not much, but at least it's a start!
4. Now that you have a file, add a new option to the dropdown with the call to your file in the `extension.ts` itself. You can copy the code template already present that uses the `Template.ts` file and just change the name to you superhero name (be careful, in the import the file is a .js file but keep using the name of you superhero without changing the file to .ts)
5. Now you can code inside you superhero file just like you would if you were developing the extension by yourself! We recomend you to have a look at the [Visual Studio Code Extension Guide](https://code.visualstudio.com/api/extension-guides/overview), as it contains multiple examples of some features you may want in your extension!
6. Finally, to test your code just make sure you have the respective extension folder open in the Explorer of your IDE, click f5 and chose VSCode Extension Development. Then Ctrl+Shift+P and search for the AI4SD extension command relative to your extension (All of them start by AI4SD so you can find it easily by just searching that). Once selected, just find your superhero name and select it and watch it run!

## Extra notes
In case you need to create a function that you think other groups could benefit from, feel free to add it to a the utils file! You may want to check it out early on in your development if it exists, you never know, it might have a function that you need.

If you find yourself needing to get information from a .env file, don't create a new one, just add the information to the already existing one and edit this page to reflect its new contents, to let other groups now what to insert in said file! (This is temporary while groups figure out secret keys an to be deleted afterwards)

## Changes
| Date       | Author                     | Description     |
|------------|----------------------------|-----------------|
| 15/11/2024 | Igor Monteiro de Andrade   | Guide creation  |
| 07/12/2024 | Igor Monteiro de Andrade   | Guide update and relocation  |