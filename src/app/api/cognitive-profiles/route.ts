import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const studentId = request.nextUrl.searchParams.get('studentId');

    const where: Record<string, unknown> = {};

    if (studentId) {
      where.studentId = studentId;
    }

    const profiles = await db.cognitiveProfile.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        student: { select: { id: true, nomeCompleto: true, matricula: true } },
      },
    });

    return NextResponse.json(profiles);
  } catch (error) {
    console.error('[COGNITIVE_PROFILES_GET]', error);
    return NextResponse.json({ error: 'Erro ao buscar perfis cognitivos' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const profile = await db.cognitiveProfile.create({ data: body });
    return NextResponse.json(profile, { status: 201 });
  } catch (error) {
    console.error('[COGNITIVE_PROFILES_POST]', error);
    return NextResponse.json({ error: 'Erro ao criar perfil cognitivo' }, { status: 500 });
  }
}
