#!/bin/bash

# Verificar se os argumentos foram passados
if [ "$#" -ne 2 ]; then
    echo "Uso: $0 <my_code> <test_my_code>"
    exit 1
fi

# Argumentos
MY_CODE="$1"
TEST_MY_CODE="$2"

# Gerar o relatório de mutações
mut.py --target "$MY_CODE" --unit-test "$TEST_MY_CODE" --show-mutants > mutation_report.txt

# Filtrar as linhas das mutações
python3 ./python/filtra_linhas.py mutation_report.txt mutations.txt

# Eliminar o ficheiro auxiliar
rm -rf mutation_report.txt

echo "Relatório de mutações filtrado salvo em mutations.txt"
