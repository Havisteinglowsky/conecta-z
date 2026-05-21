import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const studentId = request.nextUrl.searchParams.get('studentId');
    const tipo = request.nextUrl.searchParams.get('tipo');
    const authorId = request.nextUrl.searchParams.get('authorId');
    const prioridade = request.nextUrl.searchParams.get('prioridade');
    const status = request.nextUrl.searchParams.get('status');

    const where: Record<string, unknown> = {};

    if (studentId) {
      where.studentId = studentId;
    }

    if (tipo) {
      where.tipo = tipo;
    }

    if (authorId) {
      where.authorId = authorId;
    }

    if (prioridade) {
      where.prioridade = prioridade;
    }

    if (status) {
      where.status = status;
    }

    const records = await db.record.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        student: { select: { id: true, nomeCompleto: true, matricula: true } },
      },
    });

    return NextResponse.json(records);
  } catch (error) {
    console.error('[RECORDS_GET]', error);
    return NextResponse.json({ error: 'Erro ao buscar registros' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const record = await db.record.create({ data: body });
    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    console.error('[RECORDS_POST]', error);
    return NextResponse.json({ error: 'Erro ao criar registro' }, { status: 500 });
  }
}
