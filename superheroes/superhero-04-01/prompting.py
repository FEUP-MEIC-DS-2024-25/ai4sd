def generate(files_text: list[str], additional_text:str, output_language: str, prompt_type:str):
    if prompt_type == "N":
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
    elif prompt_type == "CV":
        prompt :str = """Classify the given list of requirements
                    into functional (labelled as F) and
                    non-functional requirements (labelled
                    as NF). All the outputs to the smaller
                    subtasks must be combined before you
                    generate the final output
                    
                    Each sentence is a requirement, and there will be no requirements with more than one sentence. 
                    The user provided requirements will come after this sentence."""
    elif prompt_type == "CM":
        prompt :str = """Classify the given list of requirements
                    into functional (labelled as F) and
                    non-functional requirements (labelled
                    as NF). When you provide an answer,
                    please explain the reasoning and
                    assumptions behind your response. If
                    possible, address any potential
                    ambiguities or limitations in your
                    answer, in order to provide a more
                    complete and accurate response
                    
                    Each sentence is a requirement, and there will be no requirements with more than one sentence. 
                    The user provided requirements will come after this sentence."""
    elif prompt_type == "P":
        prompt :str = """Act as a requirements engineering
                    domain expert, and classify the given
                    list of requirements into functional
                    (labelled as F) and non-functional
                    requirements (labelled as NF)
                    
                    Each sentence is a requirement, and there will be no requirements with more than one sentence. 
                    The user provided requirements will come after this sentence."""
    elif prompt_type == "QR":
        prompt :str = """Classify the given list of requirements
                    into functional (labelled as F) and
                    non-functional requirements (labelled
                    as NF). If needed, suggest a better
                    version of the question to use that
                    incorporates information specific to
                    this task, and write the sugestion in parenthesis
                    in this style where the three dots are your sugestion -> (Sugestion: ... )
                    
                    Each sentence is a requirement, and there will be no requirements with more than one sentence. 
                    The user provided requirements will come after this sentence."""
    else: 
        prompt :str = """Read the following list of
                    requirements, and return the IDs of the requirements.
                    Write the result as a tuple of lists where each list is like (ID=X)
                    (ID=Y) (ID=Z), where X, Y, and Z are
                    IDs of requirements. The first list should contain the
                    IDs of functional requirements, and the second the IDs
                    of non-funcional requirements.
                    
                    Each sentence is a requirement, and there will be no requirements with more than one sentence. 
                    The user provided requirements will come after this sentence."""

    
    if output_language:
        prompt += f"\nPlease write the output in {output_language}."

    for text in files_text:
        prompt += text + '\n'
    
    prompt += additional_text

    return prompt