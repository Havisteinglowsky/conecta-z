import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const institutionId = request.nextUrl.searchParams.get('institutionId');

    const where: Record<string, unknown> = { ativo: true };

    if (institutionId) {
      where.institutionId = institutionId;
    }

    const curriculums = await db.curriculum.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        institution: { select: { id: true, nomeFantasia: true } },
      },
    });

    return NextResponse.json(curriculums);
  } catch (error) {
    console.error('[CURRICULUMS_GET]', error);
    return NextResponse.json({ error: 'Erro ao buscar currículos' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const curriculum = await db.curriculum.create({ data: body });
    return NextResponse.json(curriculum, { status: 201 });
  } catch (error) {
    console.error('[CURRICULUMS_POST]', error);
    return NextResponse.json({ error: 'Erro ao criar currículo' }, { status: 500 });
  }
}
