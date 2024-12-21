import sys
import re
from itertools import product

def gerar_mutacoes_js(linha):
    """
    Gera mutações possíveis para uma linha de código JavaScript.
    """
    mutacoes = []
    
    # Exemplo 1: Substituir operadores aritméticos
    operadores = {"+": "-", "-": "+", "*": "/", "/": "*"}
    for op in operadores:
        if op in linha:
            mutacoes.append(linha.replace(op, operadores[op]))

    # Exemplo 2: Negar condições
    if "===" in linha:
        mutacoes.append(linha.replace("===", "!=="))
    if "!==" in linha:
        mutacoes.append(linha.replace("!==", "==="))

    # Exemplo 3: Alterar valores booleanos
    if "true" in linha:
        mutacoes.append(linha.replace("true", "false"))
    if "false" in linha:
        mutacoes.append(linha.replace("false", "true"))

    return mutacoes

def main():
    if len(sys.argv) != 2:
        print("Uso: python script.py <nome_do_ficheiro_js>")
        sys.exit(1)

    nome_ficheiro = sys.argv[1]

    try:
        with open(nome_ficheiro, 'r') as ficheiro:
            linhas = ficheiro.readlines()
            dic_opcoes_linhas_das_mutacoes = {}

            for num, linha in enumerate(linhas, start=1):
                linha = linha.strip()  # Remove espaços extras
                mutacoes = gerar_mutacoes_js(linha)  # Gera mutações
                # A linha original + suas mutações possíveis
                dic_opcoes_linhas_das_mutacoes[num] = [linha] + mutacoes

            # Fazer todas as combinações possíveis
            combinacoes = list(product(*dic_opcoes_linhas_das_mutacoes.values()))

            # Exibir e salvar as combinações
            with open("mutations.txt", 'w') as arquivo_saida:
                for i, combinacao in enumerate(combinacoes, start=1):
                    for linha in combinacao:
                        arquivo_saida.write(linha + '\n')
                    arquivo_saida.write("\n")

            print(f"Mutations geradas e salvas no ficheiro 'mutations.txt'. Total: {len(combinacoes)} combinações.")

    except FileNotFoundError:
        print(f"Erro: O ficheiro '{nome_ficheiro}' não foi encontrado.")
    except Exception as e:
        print(f"Ocorreu um erro: {e}")

if __name__ == "__main__":
    main()
