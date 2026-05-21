import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const teachingPlan = await db.teachingPlan.findUnique({
      where: { id },
      include: {
        student: true,
      },
    });

    if (!teachingPlan) {
      return NextResponse.json(
        { error: 'Plano de ensino não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(teachingPlan);
  } catch (error) {
    console.error('[TEACHING_PLAN_GET]', error);
    return NextResponse.json(
      { error: 'Erro ao buscar plano de ensino' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existing = await db.teachingPlan.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: 'Plano de ensino não encontrado' },
        { status: 404 }
      );
    }

    const teachingPlan = await db.teachingPlan.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(teachingPlan);
  } catch (error) {
    console.error('[TEACHING_PLAN_PUT]', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar plano de ensino' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existing = await db.teachingPlan.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: 'Plano de ensino não encontrado' },
        { status: 404 }
      );
    }

    // Soft delete
    const teachingPlan = await db.teachingPlan.update({
      where: { id },
      data: { ativo: false },
    });

    return NextResponse.json({
      id: teachingPlan.id,
      message: 'Plano de ensino desativado com sucesso',
    });
  } catch (error) {
    console.error('[TEACHING_PLAN_DELETE]', error);
    return NextResponse.json(
      { error: 'Erro ao desativar plano de ensino' },
      { status: 500 }
    );
  }
}
