import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs/promises';

const execAsync = promisify(exec);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { reportId, studentId: rawStudentId, tipo: rawTipo } = body;

    let studentId = rawStudentId as string | undefined;
    let tipo = rawTipo as string | undefined;
    let report: Record<string, unknown> | null = null;

    if (reportId) {
      report = (await db.report.findUnique({
        where: { id: reportId as string },
      })) as Record<string, unknown> | null;

      if (!report) {
        return NextResponse.json(
          { error: 'Relatório não encontrado' },
          { status: 404 }
        );
      }

      studentId = report.studentId as string | undefined;

      // Map report tipo to PDF tipo
      const reportTipo = (report.tipo as string) || '';
      if (reportTipo.toLowerCase().includes('psicológic') || reportTipo.toLowerCase().includes('psicologic')) {
        tipo = 'psicologico';
      } else if (reportTipo.toLowerCase().includes('familiar')) {
        tipo = 'familiar';
      } else {
        tipo = 'desempenho_escolar';
      }
    }

    if (!studentId) {
      return NextResponse.json(
        { error: 'studentId ou reportId obrigatório' },
        { status: 400 }
      );
    }

    // Fetch student with all relations
    const studentData = await db.student.findUnique({
      where: { id: studentId },
      include: {
        institution: true,
        turma: true,
        cognitiveProfiles: { orderBy: { createdAt: 'asc' as const } },
        records: { orderBy: { createdAt: 'desc' as const }, take: 10 },
        reports: { orderBy: { createdAt: 'desc' as const } },
        teachingPlans: {
          where: { ativo: true },
          orderBy: { createdAt: 'desc' as const },
        },
        companionLinks: {
          include: { companion: true },
          where: { ativo: true },
        },
      },
    });

    if (!studentData) {
      return NextResponse.json(
        { error: 'Aluno não encontrado' },
        { status: 404 }
      );
    }

    // Map report type from Portuguese names to internal keys
    const tipoMap: Record<string, string> = {
      'Pedagógico': 'desempenho_escolar',
      'Psicológico': 'psicologico',
      'Familiar': 'familiar',
      'Multidisciplinar': 'evolucao_aprendizado',
      'Governamental': 'desempenho_escolar',
    };

    const reportType =
      tipoMap[tipo || ''] || tipo || 'desempenho_escolar';

    // Prepare data for Python script
    const data: Record<string, unknown> = {
      student: studentData,
      cognitiveProfiles: studentData.cognitiveProfiles,
      records: studentData.records,
      reports: studentData.reports,
      teachingPlans: studentData.teachingPlans,
      psychologist: null,
      periodo:
        (report?.periodo as string) || new Date().getFullYear().toString(),
    };

    // Get psychologist if available
    const psychologistId =
      (report?.psychologistId as string) ||
      (studentData.reports[0]?.psychologistId as string) ||
      '';

    if (psychologistId) {
      const psy = await db.psychologist.findUnique({
        where: { id: psychologistId },
      });
      data.psychologist = psy;
    }

    // If teaching plan report, add the plan
    if (
      reportType === 'plano_ensino' &&
      studentData.teachingPlans &&
      studentData.teachingPlans.length > 0
    ) {
      data.teachingPlan = studentData.teachingPlans[0];
    }

    // Generate PDF using Python
    const outputDir = path.join(process.cwd(), 'public', 'reports');
    await fs.mkdir(outputDir, { recursive: true });

    const filename = `relatorio_${reportType}_${studentData.matricula}_${Date.now()}.pdf`;
    const outputPath = path.join(outputDir, filename);

    // Call Python script
    const pythonScript = path.join(
      process.cwd(),
      'scripts',
      'generate_report.py'
    );

    // Serialize data and pass to Python via temp file
    const jsonData = JSON.stringify(data);
    const tmpJsonPath = path.join(outputDir, `tmp_${Date.now()}.json`);
    await fs.writeFile(tmpJsonPath, jsonData, 'utf-8');

    try {
      const { stdout, stderr } = await execAsync(
        `python3 "${pythonScript}" "${tmpJsonPath}" "${reportType}" "${outputPath}"`,
        {
          timeout: 30000,
          maxBuffer: 10 * 1024 * 1024,
        }
      );

      if (stderr && !stdout.includes('success')) {
        console.error('[GENERATE_PDF] Python stderr:', stderr);
      }
    } finally {
      // Clean up temp file
      await fs.unlink(tmpJsonPath).catch(() => {});
    }

    // Verify the PDF was created
    try {
      await fs.access(outputPath);
    } catch {
      return NextResponse.json(
        { error: 'Falha ao gerar o arquivo PDF' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      url: `/reports/${filename}`,
      filename,
    });
  } catch (error) {
    console.error('[GENERATE_PDF]', error);
    return NextResponse.json(
      { error: 'Erro ao gerar PDF' },
      { status: 500 }
    );
  }
}
