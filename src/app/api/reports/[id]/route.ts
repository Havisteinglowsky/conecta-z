import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const report = await db.report.findUnique({
      where: { id },
      include: {
        student: { select: { id: true, nomeCompleto: true, matricula: true } },
        psychologist: { select: { id: true, nomeCompleto: true, crp: true } },
      },
    });

    if (!report) {
      return NextResponse.json({ error: 'Relatório não encontrado' }, { status: 404 });
    }

    return NextResponse.json(report);
  } catch (error) {
    console.error('[REPORT_GET]', error);
    return NextResponse.json({ error: 'Erro ao buscar relatório' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const report = await db.report.update({ where: { id }, data: body });
    return NextResponse.json(report);
  } catch (error) {
    console.error('[REPORT_PUT]', error);
    return NextResponse.json({ error: 'Erro ao atualizar relatório' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const report = await db.report.delete({ where: { id } });
    return NextResponse.json(report);
  } catch (error) {
    console.error('[REPORT_DELETE]', error);
    return NextResponse.json({ error: 'Erro ao remover relatório' }, { status: 500 });
  }
}
