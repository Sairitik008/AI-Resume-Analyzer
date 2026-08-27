import re

def check_ats_structure(extracted_text: str, file_extension: str) -> dict:
    """
    Evaluates text-pattern-based signals correlating with structural ATS parsing issues.
    This is a deterministic, regex-based check, NOT an LLM block.
    
    DISCLAIMER: This checks textual conventions commonly flagged by older, rigid ATS structures. 
    Because we only evaluate flat extracted text, we cannot detect complex visual layout elements
    (e.g., dual columns, floating tables) which can also fail standard PDF parsers. We cannot 
    guarantee pass-through for any specific proprietary corporate ATS algorithm.
    """
    text_lower = extracted_text.lower()
    
    # a) SECTION HEADER DETECTION (Case-insensitive matching)
    standard_sections = {
        "Experience": [r'\bexperience\b', r'\bwork experience\b', r'\bemployment\b'],
        "Education": [r'\beducation\b', r'\bacademic\b'],
        "Skills": [r'\bskills\b', r'\btechnical skills\b', r'\bcore competencies\b'],
        "Projects": [r'\bprojects\b', r'\bacademic projects\b'],
        "Summary": [r'\bsummary\b', r'\bobjective\b', r'\bprofessional summary\b']
    }
    
    missing_sections = []
    for section, patterns in standard_sections.items():
        found = False
        for pattern in patterns:
            if re.search(pattern, text_lower):
                found = True
                break
        if not found:
            missing_sections.append(section)

    # b) CONTACT INFO DETECTION
    has_email = bool(re.search(r'[\w\.-]+@[\w\.-]+\.\w+', extracted_text))
    # Phone regex checking standard US bounds, + boundaries, and variable spacing
    has_phone = bool(re.search(r'\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}', extracted_text))
    
    # c) DATE FORMATTING CONSISTENCY
    # Matches patterns like 2020-01, Jan 2020, 01/2020, 2020 - Present, etc.
    date_patterns = [
        r'\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]* \d{4}\b',
        r'\b\d{2}/\d{4}\b',
        r'\b\d{4}-\d{2}\b',
        r'\b\d{4}\b' # Last resort, simply detecting floating 4-digit years
    ]
    has_dates = False
    for pat in date_patterns:
        if bool(re.search(pat, text_lower)):
            has_dates = True
            break
            
    # d) QUANTIFICATION CHECK (Impact Scoring)
    lines = extracted_text.split('\n')
    bullet_lines = [line.strip() for line in lines if line.strip().startswith(('-', '*', '•', '·')) or len(line.strip()) > 30]
    
    quantified_count = 0
    total_bullets = len(bullet_lines)
    
    for line in bullet_lines:
        # Check for numbers, % symbols, or $ signs
        if re.search(r'\d+|%|\$', line):
            quantified_count += 1
            
    quantification_ratio = quantified_count / total_bullets if total_bullets > 0 else 0.0
    
    # e) LENGTH CHECK
    word_count = len(extracted_text.split())
    length_flag = "ok"
    if word_count < 150:
        length_flag = "too_short"
    elif word_count > 1200:
        length_flag = "too_long"
        
    # f) SCORING ALGORITHM
    # Base Score: 100
    # Missing sections: -10 each
    # Missing email: -15
    # Missing phone: -15
    # No Dates: -10
    # Quantification Ratio < 0.2: -15, < 0.4: -5
    # Length too short: -10, too long: -5
    
    ats_score = 100
    ats_score -= (len(missing_sections) * 10)
    
    if not has_email:
        ats_score -= 15
    if not has_phone:
        ats_score -= 15
    if not has_dates:
        ats_score -= 10
        
    if quantification_ratio < 0.2:
        ats_score -= 15
    elif quantification_ratio < 0.4:
        ats_score -= 5
        
    if length_flag == "too_short":
        ats_score -= 10
    elif length_flag == "too_long":
        ats_score -= 5
        
    # Floor boundaries
    ats_score = max(0, ats_score)
    
    format_note = (
        f"File uploaded as {file_extension}. This structural check relies exclusively on flattening extracted "
        "text blocks. It cannot detect complex nested columns, opaque vector tables, or layout visuals which "
        "can occasionally derail older generation ATS parsers. Standard .docx or single-column .pdf are optimally safe."
    )
    
    return {
        "ats_score": ats_score,
        "missing_sections": missing_sections,
        "has_email": has_email,
        "has_phone": has_phone,
        "has_dates": has_dates,
        "quantification_ratio": round(quantification_ratio, 2),
        "word_count": word_count,
        "length_flag": length_flag,
        "format_note": format_note
    }
