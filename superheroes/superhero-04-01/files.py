import PyPDF2
import tempfile
from fpdf import FPDF

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
            text = file.file.read().decode('utf-8')
            result.append(text)
    return result

def create_response_txt(text):
    with tempfile.NamedTemporaryFile(mode='w', delete=False, suffix='.txt') as temp:
        temp.write(text)
        return temp.name

def create_response_pdf(text):
    with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp:
        pdf = FPDF()
        pdf.set_auto_page_break(auto=True, margin=15)
        pdf.add_page()
        pdf.set_font("Arial", size=11)
        pdf.multi_cell(0, 10, text)
        pdf.output(temp.name)
        return temp.name
    