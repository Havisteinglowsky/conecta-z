import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const search = request.nextUrl.searchParams.get('search');
    const institutionId = request.nextUrl.searchParams.get('institutionId');
    const turmaId = request.nextUrl.searchParams.get('turmaId');

    const where: Record<string, unknown> = { ativo: true };

    if (institutionId) {
      where.institutionId = institutionId;
    }

    if (turmaId) {
      where.turmaId = turmaId;
    }

    if (search) {
      where.OR = [
        { nomeCompleto: { contains: search } },
        { matricula: { contains: search } },
        { cpf: { contains: search } },
        { email: { contains: search } },
      ];
    }

    const students = await db.student.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        institution: { select: { id: true, nomeFantasia: true } },
        turma: { select: { id: true, nome: true } },
      },
    });

    return NextResponse.json(students);
  } catch (error) {
    console.error('[STUDENTS_GET]', error);
    return NextResponse.json({ error: 'Erro ao buscar alunos' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const student = await db.student.create({ data: body });
    return NextResponse.json(student, { status: 201 });
  } catch (error) {
    console.error('[STUDENTS_POST]', error);
    return NextResponse.json({ error: 'Erro ao criar aluno' }, { status: 500 });
  }
}
