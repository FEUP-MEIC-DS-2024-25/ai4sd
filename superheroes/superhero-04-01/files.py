import PyPDF2
import tempfile

def process_files(files):
    result = []
    

    for file in files:
        print(f"Received file: {file.filename}")
        if file.filename.endswith('.pdf'):
            try:
                reader = PyPDF2.PdfReader(file)
                text = ""
                for page in reader.pages:
                    text += page.extract_text()
                result.append(text)
            except Exception as e:
                print(f"Error reading PDF file {file.filename}: {e}")
        else:
            print(f"{file.filename} is not a PDF, cannot process.")
    
    return result

def create_response_txt(text):
    with tempfile.NamedTemporaryFile(mode='w', delete=False, suffix='.txt') as temp:
        temp.write(text.encode('utf-8'))
        return temp.name
