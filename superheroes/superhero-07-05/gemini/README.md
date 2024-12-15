# Dependencies
To work with the gemini you need to have installed the SDK for the API Gemini. To do that, make the following command:
```bash
pip install -q -U google-generativeai
```

# How to select the mutation tests
1. Insert the mutation tests in the tests.txt file present inside the directory files.
2. Insert the context about your program in the context.txt file present inside the directory files.
3. Run the select_tests.py program, and a file named tests_selected.txt will appear inside the files directory with the results.