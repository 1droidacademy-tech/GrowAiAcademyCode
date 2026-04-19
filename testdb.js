const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const courses = await prisma.course.findMany();
  console.log("COURSES IN DB:");
  console.log(courses);
}
main().finally(() => prisma.$disconnect());
