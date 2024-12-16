# Settings Pop-Up Implementation 

This document explains the purpose of the [SettingsPopUp](../../components/settingsPopUp.js) component and provides guidance on how you can implement it for your assistant.

## Implementation

To enhance the end-user experience, we utilized the previously unused **Settings** option in [prepareMockButtons()](../../components/assistantHistory.js#prepareMockButtons) inside [AssistantHistory](../../components/assistantHistory.js) to create a customizable filter system. This system allows users to personalize assistant outputs according to their preferences (or for any other purpose you deem useful).

### How it works

- **Accessing Filters:** By clicking on the **Settings** option, users can view and select filters from the list [1].
- **Nested Filter System:** To allow for more granular filtering, we implemented a recursive filter system. This enables users to select an entire category of filters, which automatically selects all its sub-filters. This approach is particularly useful when users need to quickly select multiple related filters [2].
- **Selecting Filters:** When a parent filter is selected, all its child filters are also automatically selected, saving time and effort for the user [2].
- **Saving Selections:** Once the user has made their filter selections, they can click the **Register** button to save them [3].

This system provides a flexible and user-friendly way to control assistant outputs (or any other idea you might have that could be interesting for your assistant).


## How to integrate it

One of our key goals was to ensure that this filter system could be easily integrated into any assistant. We believe we have achieved that. Here's how you can do it:

1. Define Your Filters
    - Locate the `assistantFilters` map inside [utils.js](../../utils/utils.js), where each assistant is assigned an unique key corresponding to its name.
    - The assistant name that you must use is defined in [HistoryHeader](../../components/assistantHistory.js#HistoryHeader), the name that appears on top of your assistant's History [4]. 
    - Add the filters you want your assistant to support under this key. Filters are structured as boolean checkboxes, so their values can only be `true` or `false`.

> **Note:** If your assistant's name has separate words, this won't work for you so you'll have to change your assistant's name so that every word is concatenated into a single one.

2. Example Structure
    - You can refer to an example in [utils.js](../../utils/utils.js), on the variable `assistantFilters`, under the key `AssistantName`. This example demonstrates how to structure and define filters for your assistant.
    - Filters can be nested if you want to create a hierarchical filter system. This allows you to create parent-child relationships where selecting a parent automatically selects all its children [2].

> **Note:** If you use the provided filter structure, please keep the list under the key `AssistantName` intact to help other groups understand how they could implement this if they find it interesting.

Finally, to retrieve the options that were selected, you just have to make a call of the function [getAssistantSelectedFilters()](../../utils/utils.js#getAssistantSelectedFilters) and you are able to return the select options inside a `map`.
Don't forget to import the function in the file where you want to use the function: 
```js
import { getAssistantSelectedFilters } from "@/app/utils/utils";
```

Right next, we show 2 examples of how the function output is received:

### Example 1 (Simple - No deeply nested options)

**Selected:**
```
[x] Option
[x] Functional
[ ] NonFunctional
    [ ] Option1
    [ ] Option2
    [ ] Option3
```
**Retrieved on getAssistantSelectedFilters():**
```
Retrieved Options: ["Option", "Functional"]
```


### Example 2 (More Complex - Deeply nested options)

**Selected:**
```
[x] Functional
[ ] NonFunctional
    [ ] Option1
    [x] Option2
    [ ] Option3
    [x] NestedOption
        [x] Option4
        [x] Option5
```
**Retrieved on getAssistantSelectedFilters():**
```
Retrieved Options: ["Functional", "NonFunctional.Option2", "NonFunctional.NestedOption.Option4", "NonFunctional.NestedOption.Option5"]
```

> **Note:** In this case, if you want to retrieve, for example, inside "NonFunctional.Option2", the string "Option2", you'll have to extract it using `substr()`, or another method you prefer.


By following these instructions, you'll be able to add a customizable filter system to your assistant, enhancing its flexibility and user experience.

If you find any problems, please let us know on the DS Discord server!
