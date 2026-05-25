import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import QuizGameClient from "@/components/QuizGameClient";

export default async function StudentGamesPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("growaiedu_token")?.value;

  if (!token) {
    redirect("/login");
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    redirect("/login");
  }

  // Fetch student actual record
  const user = await prisma.user.findUnique({
    where: { id: decoded.id as string },
    select: { name: true },
  });

  const studentName = user?.name ? user.name.split(" ")[0] : "Student";

  return (
    <main className="min-h-screen bg-slate-50 pt-24 pb-20 px-6 font-sans">
      <div className="max-w-5xl mx-auto">
        <QuizGameClient studentName={studentName} />
      </div>
    </main>
  );
}
