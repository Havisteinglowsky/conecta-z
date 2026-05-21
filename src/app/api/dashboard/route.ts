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
    ] = await Promise.all([
      db.student.count({ where: { ativo: true } }),
      db.teacher.count({ where: { ativo: true } }),
      db.psychologist.count({ where: { ativo: true } }),
      db.companion.count({ where: { ativo: true } }),
      db.class.count({ where: { ativo: true } }),
      db.institution.count({ where: { ativo: true } }),
      db.record.count(),
    ]);

    // Recent records (last 5)
    const recentRecords = await db.record.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        student: { select: { id: true, nomeCompleto: true, matricula: true } },
      },
    });

    // Students by serieAno
    const studentsRaw = await db.student.findMany({
      where: { ativo: true },
      select: { serieAno: true },
    });

    const studentsBySerie: Record<string, number> = {};
    for (const s of studentsRaw) {
      const key = s.serieAno || 'Não definido';
      studentsBySerie[key] = (studentsBySerie[key] || 0) + 1;
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
      recentRecords,
      studentsBySerie,
      profilesByNivel,
    });
  } catch (error) {
    console.error('[DASHBOARD_GET]', error);
    return NextResponse.json({ error: 'Erro ao buscar estatísticas' }, { status: 500 });
  }
}
