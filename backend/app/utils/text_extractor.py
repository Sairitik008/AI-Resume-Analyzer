import PyPDF2
import docx

def extract_text_from_pdf(file_path):
    text = []
    with open(file_path, 'rb') as f:
        reader = PyPDF2.PdfReader(f)
        for page in reader.pages:
            t = page.extract_text()
            if t:
                text.append(t)
    return "\n".join(text)

def extract_text_from_docx(file_path):
    doc = docx.Document(file_path)
    return "\n".join([para.text for para in doc.paragraphs])

def extract_resume_text(file_path, file_extension):
    try:
        if file_extension == 'pdf':
            raw_text = extract_text_from_pdf(file_path)
        elif file_extension == 'docx':
            raw_text = extract_text_from_docx(file_path)
        else:
            raise ValueError(f"Unsupported file extension: {file_extension}")
            
        # Clean text by removing excessive whitespace
        cleaned_text = ' '.join(raw_text.split())
        return cleaned_text
    except Exception as e:
        raise RuntimeError(f"Failed to extract text: {str(e)}")
