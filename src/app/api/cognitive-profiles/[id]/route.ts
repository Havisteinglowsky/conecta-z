import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const profile = await db.cognitiveProfile.findUnique({
      where: { id },
      include: {
        student: { select: { id: true, nomeCompleto: true, matricula: true, serieAno: true } },
      },
    });

    if (!profile) {
      return NextResponse.json({ error: 'Perfil cognitivo não encontrado' }, { status: 404 });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error('[COGNITIVE_PROFILE_GET]', error);
    return NextResponse.json({ error: 'Erro ao buscar perfil cognitivo' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const profile = await db.cognitiveProfile.update({ where: { id }, data: body });
    return NextResponse.json(profile);
  } catch (error) {
    console.error('[COGNITIVE_PROFILE_PUT]', error);
    return NextResponse.json({ error: 'Erro ao atualizar perfil cognitivo' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const profile = await db.cognitiveProfile.delete({ where: { id } });
    return NextResponse.json(profile);
  } catch (error) {
    console.error('[COGNITIVE_PROFILE_DELETE]', error);
    return NextResponse.json({ error: 'Erro ao remover perfil cognitivo' }, { status: 500 });
  }
}
