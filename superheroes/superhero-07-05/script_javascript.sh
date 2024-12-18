# Verificar se os argumentos foram passados
if [ "$#" -ne 2 ]; then
    echo "Uso: $0 <my_code> <test_my_code>"
    exit 1
fi

# Argumentos
MY_CODE="$1"
TEST_MY_CODE="$2"

# Extrai o nome do ficheiro do MY_CODE (sem a extensão)
BASE_NAME=$(basename "$MY_CODE" .js)

# Cria o novo nome para o TEST_MY_CODE
NEW_NAME="${BASE_NAME}.test.js"

# Renomeia o TEST_MY_CODE para o novo nome
mv "$TEST_MY_CODE" "$NEW_NAME"

#Mover os ficheiros para a pasta abaixo
mv "$MY_CODE" "javascript"
mv "$NEW_NAME" "javascript"

#Fazer o processo normal para obter os teste
cd javascript
node generate_mutants.js "$MY_CODE"

#Voltar a mover os ficheiros para a pasta principal + resultado
mv "$MY_CODE" "../"
mv "$NEW_NAME" "../"
mv "mutations.txt" "../"

#Voltar a dar o nome antigo ao ficheiro
cd ..
mv "$NEW_NAME" "$TEST_MY_CODE"