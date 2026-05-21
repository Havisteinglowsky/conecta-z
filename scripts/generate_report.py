#!/usr/bin/env python3
"""NeuroLynx PDF Report Generator using ReportLab"""
import sys
import json
import os
from datetime import datetime

# ReportLab imports
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm, cm
from reportlab.lib.colors import HexColor, black, white, gray
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, HRFlowable
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT, TA_JUSTIFY
from reportlab.pdfgen import canvas as pdfcanvas

# Colors
EMERALD = HexColor('#059669')
TEAL = HexColor('#0d9488')
LIGHT_EMERALD = HexColor('#ecfdf5')
DARK = HexColor('#1e293b')
MUTED = HexColor('#64748b')
BORDER = HexColor('#e2e8f0')
BG = HexColor('#f8fafc')


def create_styles():
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(name='Title_NL', fontSize=18, textColor=EMERALD, fontName='Helvetica-Bold', spaceAfter=6, alignment=TA_LEFT))
    styles.add(ParagraphStyle(name='Subtitle_NL', fontSize=12, textColor=MUTED, fontName='Helvetica', spaceAfter=12, alignment=TA_LEFT))
    styles.add(ParagraphStyle(name='Section_NL', fontSize=13, textColor=EMERALD, fontName='Helvetica-Bold', spaceBefore=16, spaceAfter=8, alignment=TA_LEFT))
    styles.add(ParagraphStyle(name='Body_NL', fontSize=10, textColor=DARK, fontName='Helvetica', spaceAfter=6, leading=14, alignment=TA_JUSTIFY))
    styles.add(ParagraphStyle(name='Small_NL', fontSize=8, textColor=MUTED, fontName='Helvetica', spaceAfter=4, alignment=TA_LEFT))
    styles.add(ParagraphStyle(name='Label_NL', fontSize=9, textColor=MUTED, fontName='Helvetica-Bold', spaceAfter=2, alignment=TA_LEFT))
    styles.add(ParagraphStyle(name='Value_NL', fontSize=10, textColor=DARK, fontName='Helvetica', spaceAfter=6, alignment=TA_LEFT))
    styles.add(ParagraphStyle(name='Confidential', fontSize=9, textColor=HexColor('#dc2626'), fontName='Helvetica-Bold', alignment=TA_CENTER, spaceAfter=6))
    styles.add(ParagraphStyle(name='Center_NL', fontSize=10, textColor=DARK, fontName='Helvetica', alignment=TA_CENTER, spaceAfter=6))
    return styles


def header_section(canvas, doc, student, report_type):
    canvas.saveState()
    # Top bar
    canvas.setFillColor(EMERALD)
    canvas.rect(0, A4[1] - 25*mm, A4[0], 25*mm, fill=1, stroke=0)
    # Logo text
    canvas.setFillColor(white)
    canvas.setFont('Helvetica-Bold', 14)
    canvas.drawString(15*mm, A4[1] - 12*mm, 'NeuroLynx')
    canvas.setFont('Helvetica', 9)
    canvas.drawString(15*mm, A4[1] - 18*mm, 'Educação Adaptativa & Inclusiva')
    # Report type
    canvas.setFont('Helvetica-Bold', 10)
    canvas.drawRightString(A4[0] - 15*mm, A4[1] - 12*mm, report_type)
    canvas.setFont('Helvetica', 8)
    canvas.drawRightString(A4[0] - 15*mm, A4[1] - 18*mm, datetime.now().strftime('%d/%m/%Y'))
    canvas.restoreState()


def add_student_info(story, student, styles):
    story.append(Paragraph('Dados do Aluno', styles['Section_NL']))
    story.append(HRFlowable(width='100%', thickness=0.5, color=BORDER, spaceAfter=6))

    turma_nome = '-'
    if student.get('turma') and isinstance(student.get('turma'), dict):
        turma_nome = student.get('turma', {}).get('nome', '-')

    info_data = [
        ['Nome:', student.get('nomeCompleto', ''), 'Matrícula:', student.get('matricula', '')],
        ['Data Nasc.:', student.get('dataNascimento', ''), 'Turma:', turma_nome],
        ['Série:', student.get('serieAno', '-'), 'Turno:', student.get('turno', '-')],
    ]

    info_table = Table(info_data, colWidths=[25*mm, 55*mm, 25*mm, 55*mm])
    info_table.setStyle(TableStyle([
        ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('TEXTCOLOR', (0, 0), (0, -1), MUTED),
        ('TEXTCOLOR', (2, 0), (2, -1), MUTED),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTNAME', (2, 0), (2, -1), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('TOPPADDING', (0, 0), (-1, -1), 2),
    ]))
    story.append(info_table)
    story.append(Spacer(1, 8))


def progress_bar_table(profile, styles):
    """Create a visual progress bar table from cognitive profile"""
    if not profile:
        return None

    dimensions = [
        ('Atenção', profile.get('atencao')),
        ('Foco', profile.get('foco')),
        ('Memória', profile.get('memoria')),
        ('Raciocínio Lógico', profile.get('raciocinioLogico')),
        ('Compreensão', profile.get('compreensao')),
        ('Leitura', profile.get('leitura')),
        ('Escrita', profile.get('escrita')),
        ('Cálculo', profile.get('calculo')),
        ('Sociabilidade', profile.get('sociabilidade')),
        ('Autonomia', profile.get('autonomia')),
        ('Criatividade', profile.get('criatividade')),
        ('Linguagem', profile.get('linguagem')),
    ]

    rows = []
    for name, val in dimensions:
        if val is not None:
            try:
                filled = '█' * int(val)
                empty = '░' * (10 - int(val))
                rows.append([name, f'{filled}{empty} {val}/10'])
            except (ValueError, TypeError):
                pass

    if not rows:
        return None

    t = Table(rows, colWidths=[50*mm, 110*mm])
    t.setStyle(TableStyle([
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTNAME', (1, 0), (1, -1), 'Courier'),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
        ('TOPPADDING', (0, 0), (-1, -1), 3),
        ('TEXTCOLOR', (0, 0), (0, -1), MUTED),
    ]))
    return t


def generate_school_performance(data, output_path):
    student = data.get('student', {})
    profiles = data.get('cognitiveProfiles', [])
    records = data.get('records', [])
    plans = data.get('teachingPlans', [])

    doc = SimpleDocTemplate(output_path, pagesize=A4, leftMargin=15*mm, rightMargin=15*mm, topMargin=30*mm, bottomMargin=15*mm)
    styles = create_styles()
    story = []

    story.append(Paragraph('Relatório de Desempenho Escolar', styles['Title_NL']))
    story.append(Paragraph(f'Período: {data.get("periodo", "Atual")}', styles['Subtitle_NL']))

    add_student_info(story, student, styles)

    # Cognitive profile
    if profiles:
        latest = profiles[-1] if isinstance(profiles, list) else profiles
        story.append(Paragraph('Perfil Cognitivo Atual', styles['Section_NL']))
        story.append(HRFlowable(width='100%', thickness=0.5, color=BORDER, spaceAfter=6))
        bar_table = progress_bar_table(latest, styles)
        if bar_table:
            story.append(bar_table)
            story.append(Spacer(1, 8))

        if latest.get('nivelEvolucao'):
            story.append(Paragraph(f'<b>Nível de Evolução:</b> {latest.get("nivelEvolucao", "-")}', styles['Body_NL']))
        if latest.get('estadoEmocional'):
            story.append(Paragraph(f'<b>Estado Emocional:</b> {latest.get("estadoEmocional", "-")}', styles['Body_NL']))

    # Recent records
    if records:
        story.append(Paragraph('Registros Recentes', styles['Section_NL']))
        story.append(HRFlowable(width='100%', thickness=0.5, color=BORDER, spaceAfter=6))
        for rec in records[:5]:
            story.append(Paragraph(f'<b>{rec.get("titulo", "")}</b> ({rec.get("tipo", "")})', styles['Body_NL']))
            story.append(Paragraph(rec.get('descricao', '')[:200], styles['Small_NL']))

    # Teaching plan
    if plans:
        plan = plans[0] if isinstance(plans, list) else plans
        story.append(Paragraph('Plano de Ensino Personalizado', styles['Section_NL']))
        story.append(HRFlowable(width='100%', thickness=0.5, color=BORDER, spaceAfter=6))
        if plan.get('objetivoGeral'):
            story.append(Paragraph(f'<b>Objetivo Geral:</b> {plan.get("objetivoGeral", "")}', styles['Body_NL']))
        if plan.get('adaptacaoMetodologia'):
            story.append(Paragraph(f'<b>Adaptação Metodológica:</b> {plan.get("adaptacaoMetodologia", "")}', styles['Body_NL']))

    # Footer
    story.append(Spacer(1, 20))
    story.append(HRFlowable(width='100%', thickness=0.5, color=BORDER, spaceAfter=6))
    story.append(Paragraph('Documento gerado automaticamente pelo NeuroLynx', styles['Small_NL']))
    story.append(Paragraph(f'Data de emissão: {datetime.now().strftime("%d/%m/%Y %H:%M")}', styles['Small_NL']))

    doc.build(story, onFirstPage=lambda c, d: header_section(c, d, student, 'Desempenho Escolar'), onLaterPages=lambda c, d: header_section(c, d, student, 'Desempenho Escolar'))
    return output_path


def generate_family_report(data, output_path):
    student = data.get('student', {})
    profiles = data.get('cognitiveProfiles', [])

    doc = SimpleDocTemplate(output_path, pagesize=A4, leftMargin=15*mm, rightMargin=15*mm, topMargin=30*mm, bottomMargin=15*mm)
    styles = create_styles()
    story = []

    story.append(Paragraph('Relatório para Família', styles['Title_NL']))
    story.append(Paragraph('Linguagem acessível e simplificada', styles['Subtitle_NL']))

    add_student_info(story, student, styles)

    story.append(Paragraph('Como seu filho(a) está se desenvolvendo', styles['Section_NL']))
    story.append(HRFlowable(width='100%', thickness=0.5, color=BORDER, spaceAfter=6))

    if profiles:
        latest = profiles[-1] if isinstance(profiles, list) else profiles
        bar_table = progress_bar_table(latest, styles)
        if bar_table:
            story.append(bar_table)
            story.append(Spacer(1, 8))

        # Simplified explanation
        nivel = latest.get('nivelEvolucao', 'Não avaliado')
        story.append(Paragraph(f'<b>Evolução geral:</b> {nivel}', styles['Body_NL']))
        story.append(Paragraph('Este gráfico mostra como seu filho(a) está se desenvolvendo em diferentes áreas. Cada barra vai de 1 a 10, onde valores maiores indicam melhor desenvolvimento.', styles['Body_NL']))

    story.append(Paragraph('Como você pode ajudar em casa', styles['Section_NL']))
    story.append(HRFlowable(width='100%', thickness=0.5, color=BORDER, spaceAfter=6))
    tips = [
        'Converse diariamente sobre o que aconteceu na escola',
        'Crie uma rotina tranquila para estudos em casa',
        'Valorize cada conquista, por menor que seja',
        'Mantenha contato regular com a escola',
        'Incentive a leitura e atividades criativas',
    ]
    for tip in tips:
        story.append(Paragraph(f'• {tip}', styles['Body_NL']))

    # Important contacts
    story.append(Paragraph('Contatos Importantes', styles['Section_NL']))
    story.append(HRFlowable(width='100%', thickness=0.5, color=BORDER, spaceAfter=6))
    if student.get('institution'):
        inst = student['institution']
        story.append(Paragraph(f'<b>Escola:</b> {inst.get("nomeFantasia", "-")}', styles['Body_NL']))
        story.append(Paragraph(f'<b>Telefone:</b> {inst.get("telefone", "-")}', styles['Body_NL']))

    story.append(Spacer(1, 20))
    story.append(HRFlowable(width='100%', thickness=0.5, color=BORDER, spaceAfter=6))
    story.append(Paragraph('Documento gerado automaticamente pelo NeuroLynx', styles['Small_NL']))

    doc.build(story, onFirstPage=lambda c, d: header_section(c, d, student, 'Relatório Familiar'), onLaterPages=lambda c, d: header_section(c, d, student, 'Relatório Familiar'))
    return output_path


def generate_psychological_report(data, output_path):
    student = data.get('student', {})
    profiles = data.get('cognitiveProfiles', [])
    records = data.get('records', [])
    psychologist = data.get('psychologist') or {}

    doc = SimpleDocTemplate(output_path, pagesize=A4, leftMargin=15*mm, rightMargin=15*mm, topMargin=30*mm, bottomMargin=15*mm)
    styles = create_styles()
    story = []

    story.append(Paragraph('CONFIDENCIAL — Relatório Psicológico', styles['Title_NL']))
    story.append(Paragraph('Documento sigiloso conforme Resolução CFP 01/2009', styles['Confidential']))

    add_student_info(story, student, styles)

    # Psychologist info
    if psychologist:
        story.append(Paragraph('Profissional Responsável', styles['Section_NL']))
        story.append(HRFlowable(width='100%', thickness=0.5, color=BORDER, spaceAfter=6))
        story.append(Paragraph(f'<b>Nome:</b> {psychologist.get("nomeCompleto", "-")}', styles['Body_NL']))
        story.append(Paragraph(f'<b>CRP:</b> {psychologist.get("crp", "-")}/{psychologist.get("crpUf", "-")}', styles['Body_NL']))
        story.append(Paragraph(f'<b>Abordagem:</b> {psychologist.get("abordagemTerapeutica", "-")}', styles['Body_NL']))

    # Cognitive profile analysis
    if profiles:
        latest = profiles[-1] if isinstance(profiles, list) else profiles
        story.append(Paragraph('Avaliação Cognitiva', styles['Section_NL']))
        story.append(HRFlowable(width='100%', thickness=0.5, color=BORDER, spaceAfter=6))
        bar_table = progress_bar_table(latest, styles)
        if bar_table:
            story.append(bar_table)

        if latest.get('dificuldades'):
            try:
                diffs = json.loads(latest.get('dificuldades', '[]'))
                if diffs:
                    story.append(Paragraph(f'<b>Dificuldades identificadas:</b> {", ".join(diffs)}', styles['Body_NL']))
            except (json.JSONDecodeError, TypeError):
                if latest.get('dificuldades'):
                    story.append(Paragraph(f'<b>Dificuldades identificadas:</b> {latest.get("dificuldades", "")}', styles['Body_NL']))

        if latest.get('habilidades'):
            try:
                habs = json.loads(latest.get('habilidades', '[]'))
                if habs:
                    story.append(Paragraph(f'<b>Habilidades destacadas:</b> {", ".join(habs)}', styles['Body_NL']))
            except (json.JSONDecodeError, TypeError):
                if latest.get('habilidades'):
                    story.append(Paragraph(f'<b>Habilidades destacadas:</b> {latest.get("habilidades", "")}', styles['Body_NL']))

        if latest.get('observacoesEmocionais'):
            story.append(Paragraph(f'<b>Observações emocionais:</b> {latest.get("observacoesEmocionais", "")}', styles['Body_NL']))

    # Behavioral records
    psych_records = [r for r in records if r.get('tipo') == 'Psicológica']
    if psych_records:
        story.append(Paragraph('Intervenções e Observações', styles['Section_NL']))
        story.append(HRFlowable(width='100%', thickness=0.5, color=BORDER, spaceAfter=6))
        for rec in psych_records[:5]:
            story.append(Paragraph(f'<b>{rec.get("titulo", "")}</b> — {rec.get("dataRegistro", "")}', styles['Body_NL']))
            story.append(Paragraph(rec.get('descricao', '')[:300], styles['Small_NL']))

    # Recommendations
    story.append(Paragraph('Recomendações', styles['Section_NL']))
    story.append(HRFlowable(width='100%', thickness=0.5, color=BORDER, spaceAfter=6))
    story.append(Paragraph('A serem preenchidas pelo profissional responsável conforme avaliação.', styles['Body_NL']))

    # Signature area
    story.append(Spacer(1, 40))
    story.append(HRFlowable(width='40%', thickness=0.5, color=DARK, spaceAfter=4))
    psy_name = psychologist.get('nomeCompleto', 'Psicólogo(a)') if psychologist else 'Psicólogo(a)'
    psy_crp = f'CRP {psychologist.get("crp", "")}/{psychologist.get("crpUf", "")}' if psychologist and psychologist.get('crp') else ''
    story.append(Paragraph(psy_name, styles['Center_NL']))
    if psy_crp:
        story.append(Paragraph(psy_crp, styles['Center_NL']))

    story.append(Spacer(1, 20))
    story.append(HRFlowable(width='100%', thickness=0.5, color=BORDER, spaceAfter=6))
    story.append(Paragraph('Documento gerado automaticamente pelo NeuroLynx', styles['Small_NL']))

    doc.build(story, onFirstPage=lambda c, d: header_section(c, d, student, 'Relatório Psicológico'), onLaterPages=lambda c, d: header_section(c, d, student, 'Relatório Psicológico'))
    return output_path


def generate_learning_evolution(data, output_path):
    student = data.get('student', {})
    profiles = data.get('cognitiveProfiles', [])

    doc = SimpleDocTemplate(output_path, pagesize=A4, leftMargin=15*mm, rightMargin=15*mm, topMargin=30*mm, bottomMargin=15*mm)
    styles = create_styles()
    story = []

    story.append(Paragraph('Relatório de Evolução de Aprendizado', styles['Title_NL']))
    story.append(Paragraph('Análise longitudinal do desenvolvimento', styles['Subtitle_NL']))

    add_student_info(story, student, styles)

    # Evolution timeline
    if profiles and isinstance(profiles, list) and len(profiles) > 0:
        story.append(Paragraph('Linha do Tempo de Avaliações', styles['Section_NL']))
        story.append(HRFlowable(width='100%', thickness=0.5, color=BORDER, spaceAfter=6))

        for i, profile in enumerate(profiles):
            date_str = profile.get('dataAvaliacao', str(profile.get('createdAt', ''))[:10])
            nivel = profile.get('nivelEvolucao', 'Não avaliado')
            story.append(Paragraph(f'<b>Avaliação {i+1}</b> — {date_str} — <b>{nivel}</b>', styles['Body_NL']))
            bar_table = progress_bar_table(profile, styles)
            if bar_table:
                story.append(bar_table)
                story.append(Spacer(1, 6))

        # Comparison
        if len(profiles) >= 2:
            story.append(Paragraph('Comparação: Primeira vs Última Avaliação', styles['Section_NL']))
            story.append(HRFlowable(width='100%', thickness=0.5, color=BORDER, spaceAfter=6))
            first = profiles[0]
            last = profiles[-1]

            dims = ['atencao', 'foco', 'memoria', 'raciocinioLogico', 'leitura', 'escrita', 'calculo']
            labels = ['Atenção', 'Foco', 'Memória', 'Raciocínio Lógico', 'Leitura', 'Escrita', 'Cálculo']

            comp_data = [['Dimensão', '1ª Avaliação', 'Atual', 'Evolução']]
            for dim, label in zip(dims, labels):
                v1 = first.get(dim, '-')
                v2 = last.get(dim, '-')
                try:
                    diff = int(v2) - int(v1) if v1 and v2 else '-'
                    diff_str = f'+{diff}' if isinstance(diff, int) and diff > 0 else str(diff)
                except (ValueError, TypeError):
                    diff_str = '-'
                comp_data.append([label, str(v1), str(v2), diff_str])

            comp_table = Table(comp_data, colWidths=[45*mm, 30*mm, 30*mm, 30*mm])
            comp_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), LIGHT_EMERALD),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, -1), 9),
                ('GRID', (0, 0), (-1, -1), 0.5, BORDER),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
                ('TOPPADDING', (0, 0), (-1, -1), 4),
                ('ALIGN', (1, 0), (-1, -1), 'CENTER'),
            ]))
            story.append(comp_table)
    else:
        story.append(Paragraph('Nenhuma avaliação cognitiva registrada ainda.', styles['Body_NL']))

    story.append(Spacer(1, 20))
    story.append(HRFlowable(width='100%', thickness=0.5, color=BORDER, spaceAfter=6))
    story.append(Paragraph('Documento gerado automaticamente pelo NeuroLynx', styles['Small_NL']))

    doc.build(story, onFirstPage=lambda c, d: header_section(c, d, student, 'Evolução de Aprendizado'), onLaterPages=lambda c, d: header_section(c, d, student, 'Evolução de Aprendizado'))
    return output_path


def generate_teaching_plan_report(data, output_path):
    student = data.get('student', {})
    plan = data.get('teachingPlan', {})

    doc = SimpleDocTemplate(output_path, pagesize=A4, leftMargin=15*mm, rightMargin=15*mm, topMargin=30*mm, bottomMargin=15*mm)
    styles = create_styles()
    story = []

    story.append(Paragraph('Plano de Ensino Personalizado', styles['Title_NL']))
    story.append(Paragraph(f'{plan.get("titulo", "")}', styles['Subtitle_NL']))

    add_student_info(story, student, styles)

    # Objectives
    story.append(Paragraph('Objetivos', styles['Section_NL']))
    story.append(HRFlowable(width='100%', thickness=0.5, color=BORDER, spaceAfter=6))
    if plan.get('objetivoGeral'):
        story.append(Paragraph('<b>Objetivo Geral:</b>', styles['Label_NL']))
        story.append(Paragraph(plan.get('objetivoGeral', ''), styles['Body_NL']))
    if plan.get('objetivosEspecificos'):
        try:
            objs = json.loads(plan.get('objetivosEspecificos', '[]'))
            story.append(Paragraph('<b>Objetivos Específicos:</b>', styles['Label_NL']))
            for obj in objs:
                story.append(Paragraph(f'• {obj}', styles['Body_NL']))
        except (json.JSONDecodeError, TypeError):
            story.append(Paragraph(f'<b>Objetivos Específicos:</b> {plan.get("objetivosEspecificos", "")}', styles['Body_NL']))

    # Content & Methodology
    story.append(Paragraph('Conteúdos e Metodologias', styles['Section_NL']))
    story.append(HRFlowable(width='100%', thickness=0.5, color=BORDER, spaceAfter=6))
    if plan.get('conteudos'):
        try:
            items = json.loads(plan.get('conteudos', '[]'))
            story.append(Paragraph('<b>Conteúdos:</b>', styles['Label_NL']))
            for item in items:
                story.append(Paragraph(f'• {item}', styles['Body_NL']))
        except (json.JSONDecodeError, TypeError):
            story.append(Paragraph(plan.get('conteudos', ''), styles['Body_NL']))
    if plan.get('metodologias'):
        try:
            items = json.loads(plan.get('metodologias', '[]'))
            story.append(Paragraph('<b>Metodologias:</b>', styles['Label_NL']))
            for item in items:
                story.append(Paragraph(f'• {item}', styles['Body_NL']))
        except (json.JSONDecodeError, TypeError):
            story.append(Paragraph(plan.get('metodologias', ''), styles['Body_NL']))

    # Adaptations
    story.append(Paragraph('Adaptações', styles['Section_NL']))
    story.append(HRFlowable(width='100%', thickness=0.5, color=BORDER, spaceAfter=6))
    adaptations = [
        ('Metodológica', plan.get('adaptacaoMetodologia')),
        ('Avaliativa', plan.get('adaptacaoAvaliacao')),
        ('De Conteúdo', plan.get('adaptacaoConteudo')),
        ('Temporal/Ritmo', plan.get('adaptacaoTemporal')),
    ]
    for label, value in adaptations:
        if value:
            story.append(Paragraph(f'<b>{label}:</b> {value}', styles['Body_NL']))

    # Evaluation
    if plan.get('criteriosAvaliacao') or plan.get('instrumentosAvaliacao'):
        story.append(Paragraph('Avaliação', styles['Section_NL']))
        story.append(HRFlowable(width='100%', thickness=0.5, color=BORDER, spaceAfter=6))
        if plan.get('criteriosAvaliacao'):
            story.append(Paragraph(f'<b>Critérios:</b> {plan.get("criteriosAvaliacao", "")}', styles['Body_NL']))
        if plan.get('instrumentosAvaliacao'):
            story.append(Paragraph(f'<b>Instrumentos:</b> {plan.get("instrumentosAvaliacao", "")}', styles['Body_NL']))

    # Responsible
    story.append(Paragraph('Profissionais Responsáveis', styles['Section_NL']))
    story.append(HRFlowable(width='100%', thickness=0.5, color=BORDER, spaceAfter=6))
    if plan.get('professorResponsavel'):
        story.append(Paragraph(f'<b>Professor(a):</b> {plan.get("professorResponsavel", "")}', styles['Body_NL']))
    if plan.get('psicologoResponsavel'):
        story.append(Paragraph(f'<b>Psicólogo(a):</b> {plan.get("psicologoResponsavel", "")}', styles['Body_NL']))
    if plan.get('coordenadorResponsavel'):
        story.append(Paragraph(f'<b>Coordenador(a):</b> {plan.get("coordenadorResponsavel", "")}', styles['Body_NL']))

    # Signatures
    story.append(Spacer(1, 50))
    sig_data = [
        ['_' * 30, '_' * 30, '_' * 30],
        ['Professor(a)', 'Psicólogo(a)', 'Coordenador(a)'],
    ]
    sig_table = Table(sig_data, colWidths=[55*mm, 55*mm, 55*mm])
    sig_table.setStyle(TableStyle([
        ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 8),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('TOPPADDING', (0, 0), (-1, -1), 2),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2),
    ]))
    story.append(sig_table)

    story.append(Spacer(1, 20))
    story.append(HRFlowable(width='100%', thickness=0.5, color=BORDER, spaceAfter=6))
    story.append(Paragraph('Documento gerado automaticamente pelo NeuroLynx', styles['Small_NL']))

    doc.build(story, onFirstPage=lambda c, d: header_section(c, d, student, 'Plano de Ensino'), onLaterPages=lambda c, d: header_section(c, d, student, 'Plano de Ensino'))
    return output_path


# Main entry point
if __name__ == '__main__':
    # First argument can be a JSON file path or raw JSON string
    arg1 = sys.argv[1]
    if os.path.isfile(arg1):
        with open(arg1, 'r', encoding='utf-8') as f:
            input_data = json.load(f)
    else:
        input_data = json.loads(arg1)
    report_type = sys.argv[2]
    output_path = sys.argv[3]

    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    generators = {
        'desempenho_escolar': generate_school_performance,
        'familiar': generate_family_report,
        'psicologico': generate_psychological_report,
        'evolucao_aprendizado': generate_learning_evolution,
        'plano_ensino': generate_teaching_plan_report,
    }

    generator = generators.get(report_type, generate_school_performance)
    result = generator(input_data, output_path)
    print(json.dumps({'success': True, 'path': result}))
