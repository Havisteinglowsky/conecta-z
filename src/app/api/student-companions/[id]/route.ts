import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const studentCompanion = await db.studentCompanion.update({ where: { id }, data: body });
    return NextResponse.json(studentCompanion);
  } catch (error) {
    console.error('[STUDENT_COMPANION_PUT]', error);
    return NextResponse.json({ error: 'Erro ao atualizar vínculo' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const studentCompanion = await db.studentCompanion.delete({ where: { id } });
    return NextResponse.json(studentCompanion);
  } catch (error) {
    console.error('[STUDENT_COMPANION_DELETE]', error);
    return NextResponse.json({ error: 'Erro ao remover vínculo' }, { status: 500 });
  }
}
