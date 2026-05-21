import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const search = request.nextUrl.searchParams.get('search');

    const where: Record<string, unknown> = { ativo: true };

    if (search) {
      where.OR = [
        { nomeFantasia: { contains: search } },
        { razaoSocial: { contains: search } },
        { cnpj: { contains: search } },
        { municipio: { contains: search } },
      ];
    }

    const institutions = await db.institution.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(institutions);
  } catch (error) {
    console.error('[INSTITUTIONS_GET]', error);
    return NextResponse.json({ error: 'Erro ao buscar instituições' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const institution = await db.institution.create({ data: body });
    return NextResponse.json(institution, { status: 201 });
  } catch (error) {
    console.error('[INSTITUTIONS_POST]', error);
    return NextResponse.json({ error: 'Erro ao criar instituição' }, { status: 500 });
  }
}
