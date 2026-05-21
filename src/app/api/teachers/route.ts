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
        { matricula: { contains: search } },
        { cpf: { contains: search } },
        { email: { contains: search } },
      ];
    }

    const teachers = await db.teacher.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        institution: { select: { id: true, nomeFantasia: true } },
      },
    });

    return NextResponse.json(teachers);
  } catch (error) {
    console.error('[TEACHERS_GET]', error);
    return NextResponse.json({ error: 'Erro ao buscar professores' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const teacher = await db.teacher.create({ data: body });
    return NextResponse.json(teacher, { status: 201 });
  } catch (error) {
    console.error('[TEACHERS_POST]', error);
    return NextResponse.json({ error: 'Erro ao criar professor' }, { status: 500 });
  }
}
