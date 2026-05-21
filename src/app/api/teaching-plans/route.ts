import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const studentId = request.nextUrl.searchParams.get('studentId');
    const search = request.nextUrl.searchParams.get('search');

    const where: Record<string, unknown> = { ativo: true };

    if (studentId) {
      where.studentId = studentId;
    }

    if (search) {
      where.OR = [
        { titulo: { contains: search } },
        { professorResponsavel: { contains: search } },
        { psicologoResponsavel: { contains: search } },
        { coordenadorResponsavel: { contains: search } },
      ];
    }

    const teachingPlans = await db.teachingPlan.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        student: {
          select: {
            id: true,
            nomeCompleto: true,
            matricula: true,
            serieAno: true,
            turno: true,
          },
        },
      },
    });

    return NextResponse.json(teachingPlans);
  } catch (error) {
    console.error('[TEACHING_PLANS_GET]', error);
    return NextResponse.json(
      { error: 'Erro ao buscar planos de ensino' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.studentId) {
      return NextResponse.json(
        { error: 'studentId é obrigatório' },
        { status: 400 }
      );
    }

    if (!body.titulo) {
      return NextResponse.json(
        { error: 'titulo é obrigatório' },
        { status: 400 }
      );
    }

    const teachingPlan = await db.teachingPlan.create({ data: body });

    return NextResponse.json(teachingPlan, { status: 201 });
  } catch (error) {
    console.error('[TEACHING_PLANS_POST]', error);
    return NextResponse.json(
      { error: 'Erro ao criar plano de ensino' },
      { status: 500 }
    );
  }
}
