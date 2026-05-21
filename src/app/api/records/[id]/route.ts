import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const record = await db.record.findUnique({
      where: { id },
      include: {
        student: { select: { id: true, nomeCompleto: true, matricula: true } },
      },
    });

    if (!record) {
      return NextResponse.json({ error: 'Registro não encontrado' }, { status: 404 });
    }

    return NextResponse.json(record);
  } catch (error) {
    console.error('[RECORD_GET]', error);
    return NextResponse.json({ error: 'Erro ao buscar registro' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const record = await db.record.update({ where: { id }, data: body });
    return NextResponse.json(record);
  } catch (error) {
    console.error('[RECORD_PUT]', error);
    return NextResponse.json({ error: 'Erro ao atualizar registro' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const record = await db.record.delete({ where: { id } });
    return NextResponse.json(record);
  } catch (error) {
    console.error('[RECORD_DELETE]', error);
    return NextResponse.json({ error: 'Erro ao remover registro' }, { status: 500 });
  }
}
