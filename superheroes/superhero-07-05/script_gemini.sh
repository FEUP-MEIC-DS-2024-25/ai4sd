#Mover os ficheiros para a pasta adequada no gemini
mv "mutations.txt" "gemini/files"
mv "context.txt" "gemini/files"

#Mudar o nome dos ficheiros para os adequados
cd gemini/files

mv "mutations.txt" "tests.txt"

#Executar gemini
cd ../

python3 select_tests.py

#Passar ficheiros de novo para a pasta original + puxar o resultante + remover o que ja nao percisamos
cd files

mv "context.txt" "../../"
mv "tests_selected.txt" "../../"

rm tests.txt

#Mudar o nome dos testes selecionados
cd ../../ 

mv "tests_selected.txt" "mutations.txt"