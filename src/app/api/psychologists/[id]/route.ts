import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const psychologist = await db.psychologist.findUnique({
      where: { id },
      include: {
        institution: { select: { id: true, nomeFantasia: true } },
      },
    });

    if (!psychologist) {
      return NextResponse.json({ error: 'Psicólogo não encontrado' }, { status: 404 });
    }

    return NextResponse.json(psychologist);
  } catch (error) {
    console.error('[PSYCHOLOGIST_GET]', error);
    return NextResponse.json({ error: 'Erro ao buscar psicólogo' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const psychologist = await db.psychologist.update({ where: { id }, data: body });
    return NextResponse.json(psychologist);
  } catch (error) {
    console.error('[PSYCHOLOGIST_PUT]', error);
    return NextResponse.json({ error: 'Erro ao atualizar psicólogo' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const psychologist = await db.psychologist.update({
      where: { id },
      data: { ativo: false },
    });
    return NextResponse.json(psychologist);
  } catch (error) {
    console.error('[PSYCHOLOGIST_DELETE]', error);
    return NextResponse.json({ error: 'Erro ao desativar psicólogo' }, { status: 500 });
  }
}
