def get_severity(weight: int) -> str:
    if weight >= 80:
        return "high"
    elif weight >= 50:
        return "medium"
    return "low"

def build_improvement_summary(analysis_data: dict) -> list:
    """
    Evaluates rule-based signals from the analysis and produces a capped (max 5), 
    ranked list of actionable improvements prioritized by severity weight.
    """
    candidates = []

    # Extract required fields with safe defaults
    has_email = analysis_data.get("has_email", True)
    has_phone = analysis_data.get("has_phone", True)
    missing_sections = analysis_data.get("missing_sections", [])
    has_dates = analysis_data.get("has_dates", True)
    quantification_ratio = analysis_data.get("quantification_ratio", 1.0)
    length_flag = analysis_data.get("length_flag", "ok")
    missing_skills = analysis_data.get("missing_skills", [])
    match_score = analysis_data.get("match_score", 100)

    # 1. Contact Information
    if not has_email or not has_phone:
        candidates.append({
            "weight": 95,
            "issue": "Missing Contact Information",
            "action": "Add a clearly visible email address and phone number near the top of your resume — many ATS systems reject resumes without parseable contact details."
        })

    # 2. Missing Core Sections
    for section in ["Experience", "Education"]:
        if section in missing_sections:
            candidates.append({
                "weight": 90,
                "issue": f"Missing Core Section: {section}",
                "action": f"Add a clearly labeled '{section}' section — ATS systems and recruiters look for this exact structure."
            })
            
    # 3. Missing Supplementary Sections
    for section in missing_sections:
        if section not in ["Experience", "Education"]:
            candidates.append({
                "weight": 60,
                "issue": f"Missing Section: {section}",
                "action": f"Consider adding a clearly labeled '{section}' section to highlight these details for parsers."
            })

    # 4. Dates
    if not has_dates:
        candidates.append({
            "weight": 75,
            "issue": "Missing Actionable Dates",
            "action": "Add clear start/end dates to your experience and education entries — missing timelines are a common reason resumes get flagged."
        })

    # 5. Quantification Ratio
    if quantification_ratio < 0.2:
        candidates.append({
            "weight": 70,
            "issue": "Low Quantification",
            "action": "Add measurable outcomes to your bullet points (e.g. 'increased efficiency by 20%') — right now very few of your bullet points include specific numbers or results."
        })
    elif quantification_ratio < 0.4:
        candidates.append({
            "weight": 40,
            "issue": "Needs More Metrics",
            "action": "Consider adding a few more measurable results to strengthen your bullet points further and prove impact."
        })

    # 6. Length Flags
    if length_flag == "too_short":
        candidates.append({
            "weight": 50,
            "issue": "Content Too Short",
            "action": "Your resume looks quite short — consider adding more detail about your experience, projects, or skills."
        })
    elif length_flag == "too_long":
        candidates.append({
            "weight": 35,
            "issue": "Content Too Long",
            "action": "Your resume is on the longer side — consider trimming to the most relevant, recent experience."
        })

    # 7. Missing Key Skills for JD
    if missing_skills:
        top_skills = missing_skills[:3]
        skill_str = ", ".join(top_skills)
        candidates.append({
            "weight": 65,
            "issue": "Missing Key Role Skills",
            "action": f"This role specifically looks for: {skill_str} — none of these currently appear. If you have this experience, make sure it's clearly listed."
        })

    # 8. Match Score Deficit
    if match_score < 50:
        candidates.append({
            "weight": 55,
            "issue": "Low Keyword Match",
            "action": "Your overall match with this role is on the lower side — review the job description closely and tailor your resume's language to better reflect the specific requirements."
        })

    # Sort descending by weight
    candidates.sort(key=lambda x: x["weight"], reverse=True)

    # Restructure exactly into the expected format, capping at 5 items
    final_summary = []
    for rank, cand in enumerate(candidates[:5]):
        final_summary.append({
            "priority": rank + 1,
            "issue": cand["issue"],
            "action": cand["action"],
            "severity": get_severity(cand["weight"])
        })

    return final_summary
