from itertools import product
import sys
import re

def filtrar_conteudo(entrada, saida):
    with open(entrada, 'r') as arquivo_entrada:
        linhas = arquivo_entrada.readlines()

    # Variável para armazenar o conteúdo filtrado
    conteudo_filtrado = []
    dentro_do_bloco = False

    # Itera sobre cada linha para encontrar o conteúdo entre as linhas de separação
    for linha in linhas:
        if '-' * 80 in linha:
            # Alterna o estado quando encontra uma linha de separação
            dentro_do_bloco = not dentro_do_bloco
            continue 

        if dentro_do_bloco:
            conteudo_filtrado.append(linha)

    #Separa o numero e o conteudo da linha e tirar sinais da linha
    conteudo_formatado_para_dic = []
    for linha in conteudo_filtrado:
        linha = linha.split(':',1)
        linha[0] = re.sub(r'.*(\d+)$', r'\1', linha[0])
        conteudo_formatado_para_dic.append(linha)

    #Fazer dicionário numero de linha - [possivel conteduo da linha]
    dic_opcoes_linhas_das_mutacoes = {}
    for linha in conteudo_formatado_para_dic:
        if linha[0] in dic_opcoes_linhas_das_mutacoes:
            dic_opcoes_linhas_das_mutacoes[linha[0]].append(linha[1])
        else:
            dic_opcoes_linhas_das_mutacoes[linha[0]] = [linha[1]]

    #Eliminar valores repetidos
    for key,value in dic_opcoes_linhas_das_mutacoes.items():
        dic_opcoes_linhas_das_mutacoes[key]=list(set(value))

    #Fazer todas as combinacoes possiveis
    combinacoes = list(product(*dic_opcoes_linhas_das_mutacoes.values()))

    # Exibir as combinações
    with open(saida, 'w') as arquivo_saida:
        for i, combinacao in enumerate(combinacoes, start=1):
            for linha in combinacao:
                arquivo_saida.write(linha)

if __name__ == "__main__":
    try:
        arquivo_entrada = sys.argv[1]
        arquivo_saida = sys.argv[2]
        filtrar_conteudo(arquivo_entrada, arquivo_saida)
    except Exception as e:
        print(f"Houve algum problema ao abrir o arquivo: {e}")
