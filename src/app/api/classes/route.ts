import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const institutionId = request.nextUrl.searchParams.get('institutionId');
    const search = request.nextUrl.searchParams.get('search');

    const where: Record<string, unknown> = { ativo: true };

    if (institutionId) {
      where.institutionId = institutionId;
    }

    if (search) {
      where.OR = [
        { nome: { contains: search } },
        { serieAno: { contains: search } },
        { turno: { contains: search } },
        { sala: { contains: search } },
      ];
    }

    const classes = await db.class.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        institution: { select: { id: true, nomeFantasia: true } },
        teacher: { select: { id: true, nomeCompleto: true } },
        _count: { select: { students: true } },
      },
    });

    return NextResponse.json(classes);
  } catch (error) {
    console.error('[CLASSES_GET]', error);
    return NextResponse.json({ error: 'Erro ao buscar turmas' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const cls = await db.class.create({ data: body });
    return NextResponse.json(cls, { status: 201 });
  } catch (error) {
    console.error('[CLASSES_POST]', error);
    return NextResponse.json({ error: 'Erro ao criar turma' }, { status: 500 });
  }
}
