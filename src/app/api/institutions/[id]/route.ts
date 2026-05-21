import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const institution = await db.institution.findUnique({ where: { id } });

    if (!institution) {
      return NextResponse.json({ error: 'Instituição não encontrada' }, { status: 404 });
    }

    return NextResponse.json(institution);
  } catch (error) {
    console.error('[INSTITUTION_GET]', error);
    return NextResponse.json({ error: 'Erro ao buscar instituição' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const institution = await db.institution.update({ where: { id }, data: body });
    return NextResponse.json(institution);
  } catch (error) {
    console.error('[INSTITUTION_PUT]', error);
    return NextResponse.json({ error: 'Erro ao atualizar instituição' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const institution = await db.institution.update({
      where: { id },
      data: { ativo: false },
    });
    return NextResponse.json(institution);
  } catch (error) {
    console.error('[INSTITUTION_DELETE]', error);
    return NextResponse.json({ error: 'Erro ao desativar instituição' }, { status: 500 });
  }
}
