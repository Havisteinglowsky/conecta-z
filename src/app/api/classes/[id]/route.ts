import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cls = await db.class.findUnique({
      where: { id },
      include: {
        institution: true,
        teacher: true,
        students: {
          where: { ativo: true },
          orderBy: { nomeCompleto: 'asc' },
        },
      },
    });

    if (!cls) {
      return NextResponse.json({ error: 'Turma não encontrada' }, { status: 404 });
    }

    return NextResponse.json(cls);
  } catch (error) {
    console.error('[CLASS_GET]', error);
    return NextResponse.json({ error: 'Erro ao buscar turma' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const cls = await db.class.update({ where: { id }, data: body });
    return NextResponse.json(cls);
  } catch (error) {
    console.error('[CLASS_PUT]', error);
    return NextResponse.json({ error: 'Erro ao atualizar turma' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cls = await db.class.update({
      where: { id },
      data: { ativo: false },
    });
    return NextResponse.json(cls);
  } catch (error) {
    console.error('[CLASS_DELETE]', error);
    return NextResponse.json({ error: 'Erro ao desativar turma' }, { status: 500 });
  }
}
