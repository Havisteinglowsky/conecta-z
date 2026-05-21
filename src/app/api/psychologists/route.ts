import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const search = request.nextUrl.searchParams.get('search');
    const institutionId = request.nextUrl.searchParams.get('institutionId');

    const where: Record<string, unknown> = { ativo: true };

    if (institutionId) {
      where.institutionId = institutionId;
    }

    if (search) {
      where.OR = [
        { nomeCompleto: { contains: search } },
        { crp: { contains: search } },
        { cpf: { contains: search } },
        { email: { contains: search } },
      ];
    }

    const psychologists = await db.psychologist.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        institution: { select: { id: true, nomeFantasia: true } },
      },
    });

    return NextResponse.json(psychologists);
  } catch (error) {
    console.error('[PSYCHOLOGISTS_GET]', error);
    return NextResponse.json({ error: 'Erro ao buscar psicólogos' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const psychologist = await db.psychologist.create({ data: body });
    return NextResponse.json(psychologist, { status: 201 });
  } catch (error) {
    console.error('[PSYCHOLOGISTS_POST]', error);
    return NextResponse.json({ error: 'Erro ao criar psicólogo' }, { status: 500 });
  }
}
