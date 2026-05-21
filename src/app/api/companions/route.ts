import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const search = request.nextUrl.searchParams.get('search');

    const where: Record<string, unknown> = { ativo: true };

    if (search) {
      where.OR = [
        { nomeCompleto: { contains: search } },
        { cpf: { contains: search } },
        { email: { contains: search } },
        { funcao: { contains: search } },
      ];
    }

    const companions = await db.companion.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        studentLinks: {
          include: { student: { select: { id: true, nomeCompleto: true } } },
        },
      },
    });

    return NextResponse.json(companions);
  } catch (error) {
    console.error('[COMPANIONS_GET]', error);
    return NextResponse.json({ error: 'Erro ao buscar acompanhantes' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const companion = await db.companion.create({ data: body });
    return NextResponse.json(companion, { status: 201 });
  } catch (error) {
    console.error('[COMPANIONS_POST]', error);
    return NextResponse.json({ error: 'Erro ao criar acompanhante' }, { status: 500 });
  }
}
