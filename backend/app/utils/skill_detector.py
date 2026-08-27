import re

COMMON_SKILLS = [
    "Python", "Java", "JavaScript", "React", "Node.js", "Flask", "Django", "SQL",
    "MySQL", "PostgreSQL", "MongoDB", "AWS", "Azure", "GCP", "Docker", "Kubernetes",
    "Git", "Machine Learning", "NLP", "Scikit-learn", "Pandas", "NumPy", "REST API",
    "HTML", "CSS", "TypeScript", "C++", "C#", "Go", "Ruby", "PHP", "Spring Boot",
    "GraphQL", "Redis", "Kafka", "Elasticsearch", "Linux", "Bash", "CI/CD", "Jenkins",
    "Agile", "Scrum", "TensorFlow", "PyTorch", "Tableau", "Vue.js", "Angular", "Express"
]

def detect_skills(text: str) -> list:
    detected_skills = set()
    text_lower = text.lower()
    
    for skill in COMMON_SKILLS:
        # Use lookbehind and lookahead to explicitly check non-word boundaries
        # This gracefully handles skills with special chars (e.g. C++, .NET)
        pattern = r'(?<![\w])' + re.escape(skill.lower()) + r'(?![\w])'
        if re.search(pattern, text_lower):
            detected_skills.add(skill)
            
    return list(detected_skills)
