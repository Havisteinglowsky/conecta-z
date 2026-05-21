import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const studentId = request.nextUrl.searchParams.get('studentId');
    const tipo = request.nextUrl.searchParams.get('tipo');
    const psychologistId = request.nextUrl.searchParams.get('psychologistId');
    const status = request.nextUrl.searchParams.get('status');

    const where: Record<string, unknown> = {};

    if (studentId) {
      where.studentId = studentId;
    }

    if (tipo) {
      where.tipo = tipo;
    }

    if (psychologistId) {
      where.psychologistId = psychologistId;
    }

    if (status) {
      where.status = status;
    }

    const reports = await db.report.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        student: { select: { id: true, nomeCompleto: true, matricula: true } },
        psychologist: { select: { id: true, nomeCompleto: true, crp: true } },
      },
    });

    return NextResponse.json(reports);
  } catch (error) {
    console.error('[REPORTS_GET]', error);
    return NextResponse.json({ error: 'Erro ao buscar relatórios' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const report = await db.report.create({ data: body });
    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error('[REPORTS_POST]', error);
    return NextResponse.json({ error: 'Erro ao criar relatório' }, { status: 500 });
  }
}
