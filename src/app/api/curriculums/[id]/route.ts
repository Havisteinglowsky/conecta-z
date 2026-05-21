import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const curriculum = await db.curriculum.findUnique({
      where: { id },
      include: {
        institution: { select: { id: true, nomeFantasia: true } },
      },
    });

    if (!curriculum) {
      return NextResponse.json({ error: 'Currículo não encontrado' }, { status: 404 });
    }

    return NextResponse.json(curriculum);
  } catch (error) {
    console.error('[CURRICULUM_GET]', error);
    return NextResponse.json({ error: 'Erro ao buscar currículo' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const curriculum = await db.curriculum.update({ where: { id }, data: body });
    return NextResponse.json(curriculum);
  } catch (error) {
    console.error('[CURRICULUM_PUT]', error);
    return NextResponse.json({ error: 'Erro ao atualizar currículo' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const curriculum = await db.curriculum.update({
      where: { id },
      data: { ativo: false },
    });
    return NextResponse.json(curriculum);
  } catch (error) {
    console.error('[CURRICULUM_DELETE]', error);
    return NextResponse.json({ error: 'Erro ao desativar currículo' }, { status: 500 });
  }
}
