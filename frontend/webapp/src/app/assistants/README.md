# Assistant Integration

## Instructions
1.  Inside the app (`src/app/`) directory, I've created an `assistants` folder. Inside this folder you'll be creating your assistant.
2. To start, create a copy of the [example](/frontend/webapp/src/app/assistants/example/) folder (`src/app/assistants/example`) and rename it to the name of your assistant.
3. Step 2 has created a route your assistant automatically, so if you visit `/assistants/ASSISTANT_NAME`, there should exist a page there. Learn more about routing in Next.js [here](https://nextjs.org/docs/app/building-your-application/routing).
4. Inside this folder, there is a `page.js` file, which is the main page for your assistant. This page contains 3 main sections:
    - `AssistantPicker`: the left-most column with all the assistants
    - `AssistantHistory`: the second left-most column, containing the history of your interactions
    - `Assistant`: **YOUR ASSISTANT**

    It is *recommended* you do not change this main structure, as it is the same for all assistants.

5. Inside the `page.js` file, edit the `assistName`, `assistType` and `assistHistory` accordingly.
6. I've also created an `Assistant` component, located inside the `components` folder of your assistant, which is where you'll be adding the code for your **Assistant**. You can create your own components inside this folder.

**Note**: If you create a component you think would be useful to other assistants, you can place it the general components folder.

7. Finally, you need to add your assintant to the [assistantPicker](/frontend/webapp/src/app/components/assistantPicker.js). Inside the `AssistantPickerItems`, add a row for your assistant in the `assistantList` array. The link must be `/assistants/YOUR_ASSISTANT`.


## Final Note: Branches

Write your code in a separate branch and then create a pull request for the main branch. Follow this [template](https://github.com/FEUP-MEIC-DS-2024-25/ai4sd/pull/13) when creating your pull request. Name your branch after your assistant's name.


## Changes
| Date       | Author               | Description        |
|------------|----------------------|--------------------|
| 15/11/2024 | José Miguel Isidro   | Created the guide  |