def generate(files_text: list[str], additional_text:str, output_language: str):
    prompt :str = """You are an expert requeriments engineer analyzer, and your job is to classify
        the user\'s provided requirements into functional and non functional, and specify their subtype.
        
        You should provide the answer in the format:

        TYPE_OF_REQUIREMENT

            SUBTYPE_OF_REQUIREMENT
            - REQUIREMENT. 
            - REQUIREMENT.
            - ...

            SUBTYPE_OF_REQUIREMENT
            - REQUIREMENT. 
            - ...

        Each sentence is a requirement, and there will be no requirements with more than one sentence. 
        """
    if output_language:
        prompt += f"\nPlease write the output in {output_language}."
    
    prompt += """
        The user provided requirements will come after this sentence.
        """

    for text in files_text:
        prompt += text + '\n'
    
    prompt += additional_text

    return prompt
