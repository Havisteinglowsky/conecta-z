import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const companion = await db.companion.findUnique({
      where: { id },
      include: {
        studentLinks: {
          include: { student: { select: { id: true, nomeCompleto: true, matricula: true } } },
        },
      },
    });

    if (!companion) {
      return NextResponse.json({ error: 'Acompanhante não encontrado' }, { status: 404 });
    }

    return NextResponse.json(companion);
  } catch (error) {
    console.error('[COMPANION_GET]', error);
    return NextResponse.json({ error: 'Erro ao buscar acompanhante' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const companion = await db.companion.update({ where: { id }, data: body });
    return NextResponse.json(companion);
  } catch (error) {
    console.error('[COMPANION_PUT]', error);
    return NextResponse.json({ error: 'Erro ao atualizar acompanhante' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const companion = await db.companion.update({
      where: { id },
      data: { ativo: false },
    });
    return NextResponse.json(companion);
  } catch (error) {
    console.error('[COMPANION_DELETE]', error);
    return NextResponse.json({ error: 'Erro ao desativar acompanhante' }, { status: 500 });
  }
}
