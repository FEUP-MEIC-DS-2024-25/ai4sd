def generate(files_text: list[str], additional_text:str, output_language: str):
    prompt :str = """You are an expert requeriments engineer analyzer, and your job is to classify
        the user\'s provided requirements into functional and non functional, and specify their subtype. When the requirements are non functional, classify them 
        according to Performance, Scalability, Portability, Compatibility, Reliability, Maintainability, Availability, Security, Usability.
        
        You should provide the answer in the format:

        FUNCTIONAL REQUIREMENTS

            - REQUIREMENT. 
            - REQUIREMENT.
            - ...
            
            
        NON-FUNCTIONAL REQUIREMENTS

            SUBTYPE_OF_REQUIREMENT
            - REQUIREMENT. 
            - ...

            SUBTYPE_OF_REQUIREMENT
            - REQUIREMENT. 
            - ...

        Each sentence is a requirement, and there will be no requirements with more than one sentence. 
        The user provided requirements will come after this sentence.
        """
    if output_language:
        prompt += f"\nPlease write the output in {output_language}."

    for text in files_text:
        prompt += text + '\n'
    
    prompt += additional_text

    return prompt