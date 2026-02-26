from io import BytesIO

from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib.colors import black
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    HRFlowable,
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER

from app.agents.outputs.cv_reader_output import CVReaderOutput


def _build_styles():
    styles = getSampleStyleSheet()

    styles.add(ParagraphStyle(
        "CandidateName",
        parent=styles["Title"],
        fontName="Times-Bold",
        fontSize=18,
        leading=22,
        alignment=TA_CENTER,
        spaceAfter=2,
    ))
    styles.add(ParagraphStyle(
        "ContactInfo",
        parent=styles["Normal"],
        fontName="Times-Roman",
        fontSize=10,
        leading=12,
        alignment=TA_CENTER,
        spaceAfter=6,
    ))
    styles.add(ParagraphStyle(
        "SectionHeader",
        parent=styles["Heading2"],
        fontName="Times-Bold",
        fontSize=12,
        leading=14,
        spaceBefore=10,
        spaceAfter=2,
    ))
    styles.add(ParagraphStyle(
        "EntryTitle",
        parent=styles["Normal"],
        fontName="Times-Bold",
        fontSize=10,
        leading=12,
        spaceAfter=1,
    ))
    styles.add(ParagraphStyle(
        "EntrySubtitle",
        parent=styles["Normal"],
        fontName="Times-Italic",
        fontSize=10,
        leading=12,
        spaceAfter=2,
    ))
    styles.add(ParagraphStyle(
        "BodyText_CV",
        parent=styles["Normal"],
        fontName="Times-Roman",
        fontSize=10,
        leading=12,
    ))
    styles.add(ParagraphStyle(
        "BulletItem",
        parent=styles["Normal"],
        fontName="Times-Roman",
        fontSize=10,
        leading=12,
        leftIndent=18,
        bulletIndent=6,
    ))
    return styles


def _section(flowables, title, styles):
    flowables.append(Spacer(1, 4))
    flowables.append(HRFlowable(width="100%", thickness=0.5, color=black))
    flowables.append(Paragraph(title.upper(), styles["SectionHeader"]))


class CVPdfGenerationService:
    def generate_pdf(self, cv_data: CVReaderOutput) -> bytes:
        buf = BytesIO()
        doc = SimpleDocTemplate(
            buf,
            pagesize=letter,
            topMargin=0.6 * inch,
            bottomMargin=0.6 * inch,
            leftMargin=0.75 * inch,
            rightMargin=0.75 * inch,
        )

        styles = _build_styles()
        story: list = []

        # Header
        info = cv_data.personal_info
        story.append(Paragraph(info.full_name, styles["CandidateName"]))
        contact_parts = [info.email, info.phone_number]
        story.append(Paragraph(" | ".join(p for p in contact_parts if p), styles["ContactInfo"]))

        if info.role_name:
            story.append(Paragraph(info.role_name, styles["ContactInfo"]))

        # Professional Summary
        if info.professional_summary:
            _section(story, "Professional Summary", styles)
            story.append(Paragraph(info.professional_summary, styles["BodyText_CV"]))

        # Experience
        if cv_data.experience:
            _section(story, "Experience", styles)
            for exp in cv_data.experience:
                story.append(Paragraph(
                    f"{exp.position} — {exp.organization}",
                    styles["EntryTitle"],
                ))
                story.append(Paragraph(
                    f"{exp.start_date} – {exp.end_date}",
                    styles["EntrySubtitle"],
                ))
                for detail in exp.details:
                    story.append(Paragraph(
                        detail,
                        styles["BulletItem"],
                        bulletText="•",
                    ))
                story.append(Spacer(1, 4))

        # Education
        if cv_data.education:
            _section(story, "Education", styles)
            for edu in cv_data.education:
                story.append(Paragraph(
                    f"{edu.degree} — {edu.institution}",
                    styles["EntryTitle"],
                ))
                subtitle_parts = [f"{edu.start_date} – {edu.end_date}"]
                if edu.location:
                    subtitle_parts.append(edu.location)
                story.append(Paragraph(
                    " | ".join(subtitle_parts),
                    styles["EntrySubtitle"],
                ))
                for detail in edu.details:
                    story.append(Paragraph(
                        detail,
                        styles["BulletItem"],
                        bulletText="•",
                    ))
                story.append(Spacer(1, 4))

        # Skills
        if cv_data.skills:
            _section(story, "Skills", styles)
            story.append(Paragraph(", ".join(cv_data.skills), styles["BodyText_CV"]))

        # Languages
        if cv_data.languages:
            _section(story, "Languages", styles)
            story.append(Paragraph(", ".join(cv_data.languages), styles["BodyText_CV"]))

        doc.build(story)
        return buf.getvalue()
