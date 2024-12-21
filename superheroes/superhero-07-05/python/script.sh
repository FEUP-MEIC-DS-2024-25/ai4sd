
# Comando que escreve para mutation_report.txt os resultados obtidos de criar os mutation tests
mut.py --target my_code --unit-test test_my_code --show-mutants > mutation_report.txt

#Filtar as linhas das mutacoes
python3 filtra_linhas.py mutation_report.txt mutation_report_filtered.txt

#Eliminar ficheiro auxiliar
rm mutation_report.txt -rf