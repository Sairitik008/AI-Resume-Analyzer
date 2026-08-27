"""
Curated mapping of common skills to real, verifiable learning resources/certifications.
Focus on highly recognized paths (e.g. AWS, Coursera, Meta, etc.)
Avoid hallucinated links. 
"""

SKILL_RESOURCES = {
    "AWS": [
        {"name": "AWS Certified Cloud Practitioner", "provider": "Amazon Web Services", "url": "https://aws.amazon.com/certification/certified-cloud-practitioner/"},
        {"name": "AWS Certified Solutions Architect", "provider": "Amazon Web Services", "url": "https://aws.amazon.com/certification/certified-solutions-architect-associate/"}
    ],
    "Azure": [
        {"name": "Microsoft Certified: Azure Fundamentals (AZ-900)", "provider": "Microsoft", "url": "https://learn.microsoft.com/en-us/credentials/certifications/azure-fundamentals/"}
    ],
    "GCP": [
        {"name": "Google Cloud Digital Leader", "provider": "Google", "url": "https://cloud.google.com/learn/certification/cloud-digital-leader"}
    ],
    "Docker": [
        {"name": "Docker Certified Associate", "provider": "Docker", "url": "https://www.docker.com/certification/"}
    ],
    "Kubernetes": [
        {"name": "Certified Kubernetes Administrator (CKA)", "provider": "Cloud Native Computing Foundation", "url": "https://training.linuxfoundation.org/certification/certified-kubernetes-administrator-cka/"}
    ],
    "Python": [
        {"name": "Python for Everybody Specialization", "provider": "University of Michigan (Coursera)", "url": "https://www.coursera.org/specializations/python"}
    ],
    "Java": [
        {"name": "Java Programming and Software Engineering Fundamentals", "provider": "Duke University (Coursera)", "url": "https://www.coursera.org/specializations/java-programming"}
    ],
    "JavaScript": [
        {"name": "JavaScript Algorithms and Data Structures", "provider": "freeCodeCamp", "url": "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/"}
    ],
    "React": [
        {"name": "Meta Front-End Developer Professional Certificate", "provider": "Meta (Coursera)", "url": "https://www.coursera.org/professional-certificates/meta-front-end-developer"}
    ],
    "Node.js": [
        {"name": "Back-End Web Development with Node.js", "provider": "freeCodeCamp", "url": "https://www.freecodecamp.org/learn/back-end-development-and-apis/"}
    ],
    "SQL": [
        {"name": "Google Data Analytics Professional Certificate", "provider": "Google (Coursera)", "url": "https://www.coursera.org/professional-certificates/google-data-analytics"}
    ],
    "Machine Learning": [
        {"name": "Machine Learning Specialization", "provider": "DeepLearning.AI / Stanford (Coursera)", "url": "https://www.coursera.org/specializations/machine-learning-introduction"}
    ],
    "Data Science": [
        {"name": "IBM Data Science Professional Certificate", "provider": "IBM (Coursera)", "url": "https://www.coursera.org/professional-certificates/ibm-data-science"}
    ],
    "Agile": [
        {"name": "Google Project Management Professional Certificate", "provider": "Google (Coursera)", "url": "https://www.coursera.org/professional-certificates/google-project-management"}
    ],
    "Scrum": [
        {"name": "Certified ScrumMaster (CSM)", "provider": "Scrum Alliance", "url": "https://www.scrumalliance.org/get-certified/scrum-master-track"}
    ],
    "Git": [
        {"name": "Version Control with Git", "provider": "Atlassian (Coursera)", "url": "https://www.coursera.org/learn/version-control-with-git"}
    ],
    "Cybersecurity": [
        {"name": "Google Cybersecurity Professional Certificate", "provider": "Google (Coursera)", "url": "https://www.coursera.org/professional-certificates/google-cybersecurity"}
    ]
}

def get_resources_for_skills(missing_skills: list, max_suggestions: int = 5) -> list:
    """
    Given an ordered list of missing skills, returns a flat list of curated resource dictionaries.
    Caps the return length at max_suggestions to not overwhelm users.
    """
    suggestions = []
    
    for skill in missing_skills:
        # Match case-insensitively just in case, but prefer exact casing match
        mapped = None
        for key in SKILL_RESOURCES.keys():
            if key.lower() == skill.lower():
                mapped = SKILL_RESOURCES[key]
                break
                
        if mapped:
            for resource in mapped:
                if len(suggestions) >= max_suggestions:
                    return suggestions
                
                # Append formatted dictionary mapping skill -> resource
                suggestions.append({
                    "skill": key,
                    "name": resource["name"],
                    "provider": resource["provider"],
                    "url": resource["url"]
                })
                
    return suggestions
