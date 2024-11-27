def parse_input(text: str):
    final = "Each of the following phrases is a requirement. Classify them as functional or non-functional requirements and say which type"
    final += "of requirement they are. Start each type with the type name and a new line. Then list the requirements that belong on that type."
    final += "Each requirement should be separated by a new line.\n" + text