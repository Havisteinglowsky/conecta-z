import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const studentId = request.nextUrl.searchParams.get('studentId');

    const where: Record<string, unknown> = {};

    if (studentId) {
      where.studentId = studentId;
    }

    const studentCompanions = await db.studentCompanion.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        student: { select: { id: true, nomeCompleto: true, matricula: true } },
        companion: true,
      },
    });

    return NextResponse.json(studentCompanions);
  } catch (error) {
    console.error('[STUDENT_COMPANIONS_GET]', error);
    return NextResponse.json({ error: 'Erro ao buscar vínculos' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const studentCompanion = await db.studentCompanion.create({ data: body });
    return NextResponse.json(studentCompanion, { status: 201 });
  } catch (error) {
    console.error('[STUDENT_COMPANIONS_POST]', error);
    return NextResponse.json({ error: 'Erro ao criar vínculo' }, { status: 500 });
  }
}
