import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getLiveMatches = async () => {
  // Fetch from database where status is 'LIVE'
  return await prisma.match.findMany({
    where: { status: 'LIVE' },
    include: { homeTeam: true, awayTeam: true, tournament: true }
  });
};