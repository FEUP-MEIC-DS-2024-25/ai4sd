# Verificar se os argumentos foram passados
if [ "$#" -ne 1 ]; then
    echo "Uso: $0 <my_code>"
    exit 1
fi

# Argumentos
MY_CODE="$1"

# Filtrar as linhas das mutações
python3 ./javascript/gera_tests.py "$MY_CODE"

echo "Relatório de mutações filtrado salvo em mutations.txt"
