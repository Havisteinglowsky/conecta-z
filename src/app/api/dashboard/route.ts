import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // Total counts (only active records)
    const [
      totalStudents,
      totalTeachers,
      totalPsychologists,
      totalCompanions,
      totalClasses,
      totalInstitutions,
      totalRecords,
      studentsWithSpecialNeeds,
      activeRecords,
      pendingReports,
    ] = await Promise.all([
      db.student.count({ where: { ativo: true } }),
      db.teacher.count({ where: { ativo: true } }),
      db.psychologist.count({ where: { ativo: true } }),
      db.companion.count({ where: { ativo: true } }),
      db.class.count({ where: { ativo: true } }),
      db.institution.count({ where: { ativo: true } }),
      db.record.count(),
      db.student.count({ where: { ativo: true, necessidadeEspecial: true } }),
      db.record.count({ where: { status: 'Aberto' } }),
      db.report.count({ where: { status: { in: ['Rascunho', 'Revisão'] } } }),
    ]);

    // Recent records (last 5)
    const recentRecords = await db.record.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        student: { select: { id: true, nomeCompleto: true, matricula: true } },
      },
    });

    // Recent reports (last 5)
    const recentReports = await db.report.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        student: { select: { id: true, nomeCompleto: true } },
        psychologist: { select: { id: true, nomeCompleto: true } },
      },
    });

    // Students by situacao
    const studentsBySituacaoRaw = await db.student.findMany({
      where: { ativo: true },
      select: { situacao: true },
    });

    const studentsBySituacao: Record<string, number> = {};
    for (const s of studentsBySituacaoRaw) {
      const key = s.situacao || 'Não definido';
      studentsBySituacao[key] = (studentsBySituacao[key] || 0) + 1;
    }

    // Students by turno
    const studentsByTurnoRaw = await db.student.findMany({
      where: { ativo: true },
      select: { turno: true },
    });

    const studentsByTurno: Record<string, number> = {};
    for (const s of studentsByTurnoRaw) {
      const key = s.turno || 'Não definido';
      studentsByTurno[key] = (studentsByTurno[key] || 0) + 1;
    }

    // Cognitive profiles by nivelEvolucao
    const profilesRaw = await db.cognitiveProfile.findMany({
      select: { nivelEvolucao: true },
    });

    const profilesByNivel: Record<string, number> = {};
    for (const p of profilesRaw) {
      const key = p.nivelEvolucao || 'Não avaliado';
      profilesByNivel[key] = (profilesByNivel[key] || 0) + 1;
    }

    return NextResponse.json({
      totalStudents,
      totalTeachers,
      totalPsychologists,
      totalCompanions,
      totalClasses,
      totalInstitutions,
      totalRecords,
      studentsWithSpecialNeeds,
      activeRecords,
      pendingReports,
      recentRecords,
      recentReports,
      studentsBySituacao,
      studentsByTurno,
      profilesByNivel,
    });
  } catch (error) {
    console.error('[DASHBOARD_GET]', error);
    return NextResponse.json({ error: 'Erro ao buscar estatísticas' }, { status: 500 });
  }
}
