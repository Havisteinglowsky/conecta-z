import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const teacher = await db.teacher.findUnique({
      where: { id },
      include: {
        institution: { select: { id: true, nomeFantasia: true } },
        classes: true,
      },
    });

    if (!teacher) {
      return NextResponse.json({ error: 'Professor não encontrado' }, { status: 404 });
    }

    return NextResponse.json(teacher);
  } catch (error) {
    console.error('[TEACHER_GET]', error);
    return NextResponse.json({ error: 'Erro ao buscar professor' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const teacher = await db.teacher.update({ where: { id }, data: body });
    return NextResponse.json(teacher);
  } catch (error) {
    console.error('[TEACHER_PUT]', error);
    return NextResponse.json({ error: 'Erro ao atualizar professor' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const teacher = await db.teacher.update({
      where: { id },
      data: { ativo: false },
    });
    return NextResponse.json(teacher);
  } catch (error) {
    console.error('[TEACHER_DELETE]', error);
    return NextResponse.json({ error: 'Erro ao desativar professor' }, { status: 500 });
  }
}
