import itertools
import re
import argparse

def load_code_from_file(file_path):
    with open(file_path, "r") as file:
        return file.read()

def save_mutations_to_file(file_path, mutations):
    with open(file_path, "w") as file:
        for i, mutated_code in enumerate(mutations, start=1):
            file.write(mutated_code)

def apply_mutation_at_positions(code, positions, replacements):
    code_list = list(code)
    for pos, replacement in zip(positions, replacements):
        code_list[pos] = replacement
    return "".join(code_list)

def generate_combinations(replacements):
    mutation_combinations = []
    for replacement_set in itertools.product(*replacements):
        mutation_combinations.append(replacement_set)
    return mutation_combinations

def generate_unique_mutations(code):
    mutation_options = {
        "+": ["-", "+"],
        "-": ["+", "-"],
        "*": ["/", "*"],
        "/": ["*", "/"],
        "<": [">=", "<"],
        ">": ["<=", ">"],
        "<=": [">", "<="],
        ">=": ["<", ">="],
        "true": ["false", "true"],
        "false": ["true", "false"],
        "==": ["!=", "=="],
        "!=": ["==", "!="],
    }

    positions = []
    replacements = []
    for operator, replacement_set in mutation_options.items():
        for match in re.finditer(re.escape(operator), code):
            positions.append(match.start())
            replacements.append(replacement_set)
    
    mutation_combinations = generate_combinations(replacements)
    
    unique_mutations = set()
    
    for combination in mutation_combinations:
        mutated_code = apply_mutation_at_positions(code, positions, combination)
        unique_mutations.add(mutated_code)

    return list(unique_mutations)

def main():
    parser = argparse.ArgumentParser(description="Gera mutações de código.")
    parser.add_argument("input_file", help="Caminho do arquivo Java original.")
    
    args = parser.parse_args()

    output_file_path = "mutations.txt"

    original_code = load_code_from_file(args.input_file)

    mutated_versions = generate_unique_mutations(original_code)

    save_mutations_to_file(output_file_path, mutated_versions)

    print(f"Todas as {len(mutated_versions)} mutações foram salvas em '{output_file_path}'.")

if __name__ == "__main__":
    main()
