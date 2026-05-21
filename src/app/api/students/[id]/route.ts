import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const student = await db.student.findUnique({
      where: { id },
      include: {
        institution: true,
        turma: true,
        cognitiveProfiles: { orderBy: { createdAt: 'desc' } },
        companionLinks: {
          include: { companion: true },
        },
      },
    });

    if (!student) {
      return NextResponse.json({ error: 'Aluno não encontrado' }, { status: 404 });
    }

    return NextResponse.json(student);
  } catch (error) {
    console.error('[STUDENT_GET]', error);
    return NextResponse.json({ error: 'Erro ao buscar aluno' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const student = await db.student.update({ where: { id }, data: body });
    return NextResponse.json(student);
  } catch (error) {
    console.error('[STUDENT_PUT]', error);
    return NextResponse.json({ error: 'Erro ao atualizar aluno' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const student = await db.student.update({
      where: { id },
      data: { ativo: false },
    });
    return NextResponse.json(student);
  } catch (error) {
    console.error('[STUDENT_DELETE]', error);
    return NextResponse.json({ error: 'Erro ao desativar aluno' }, { status: 500 });
  }
}
