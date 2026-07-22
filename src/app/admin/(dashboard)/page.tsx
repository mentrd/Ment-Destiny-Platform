import { readDb, type StatRow, type UserRow } from "@/lib/db";
import { FEATURES } from "@/lib/features";

export const dynamic = "force-dynamic";

function dateStr(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export default async function AdminDashboardPage() {
  const stats = await readDb<StatRow[]>("stats", []);
  const users = await readDb<UserRow[]>("users", []);

  const now = new Date();
  const today = dateStr(now);
  // 本週（週一起算）
  const day = now.getUTCDay(); // 0=日
  const monday = new Date(now.getTime() - ((day + 6) % 7) * 86400000);
  const weekStart = dateStr(monday);

  const readings = stats.filter((s) => s.type === "reading_complete");
  const sum = (rows: StatRow[]) => rows.reduce((acc, r) => acc + r.count, 0);

  const todayCount = sum(readings.filter((s) => s.date === today));
  const weekCount = sum(readings.filter((s) => s.date >= weekStart));
  const totalCount = sum(readings);
  const shareCount = sum(stats.filter((s) => s.type === "share"));

  // 熱門 Top5
  const byFeature = new Map<string, number>();
  for (const s of readings) {
    if (!s.feature) continue;
    byFeature.set(s.feature, (byFeature.get(s.feature) ?? 0) + s.count);
  }
  const top5 = [...byFeature.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const topMax = Math.max(1, ...top5.map(([, c]) => c));

  // 近 7 天
  const days: { date: string; count: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = dateStr(new Date(now.getTime() - i * 86400000));
    days.push({
      date: d,
      count: sum(readings.filter((s) => s.date === d)),
    });
  }
  const dayMax = Math.max(1, ...days.map((d) => d.count));

  const cards = [
    { label: "今日測算", value: todayCount },
    { label: "本週測算", value: weekCount },
    { label: "累計測算", value: totalCount },
    { label: "分享總數", value: shareCount },
    { label: "會員數", value: users.length },
  ];

  return (
    <div>
      <h1 className="text-gradient-gold text-2xl font-bold">儀表板</h1>
      <p className="mt-1 text-sm text-slate-400">星語平台營運總覽</p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {cards.map((c) => (
          <div key={c.label} className="card-mystic p-5">
            <p className="text-sm text-slate-400">{c.label}</p>
            <p className="mt-2 text-3xl font-bold text-amber-200">
              {c.value.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="card-mystic p-6">
          <h2 className="font-semibold text-slate-200">熱門功能 Top 5</h2>
          {top5.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">尚無測算資料</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {top5.map(([slug, count]) => {
                const f = FEATURES.find((x) => x.slug === slug);
                return (
                  <li key={slug}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-300">
                        <span aria-hidden className="mr-2">
                          {f?.icon ?? "✨"}
                        </span>
                        {f?.name ?? slug}
                      </span>
                      <span className="text-slate-400">{count}</span>
                    </div>
                    <div className="mt-1 h-2.5 rounded-full bg-white/5">
                      <div
                        className="h-2.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-200"
                        style={{ width: `${(count / topMax) * 100}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="card-mystic p-6">
          <h2 className="font-semibold text-slate-200">近 7 天測算數</h2>
          <div className="mt-4 flex h-44 items-end gap-2">
            {days.map((d) => (
              <div key={d.date} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-xs text-slate-400">{d.count}</span>
                <div
                  className="w-full rounded-t bg-gradient-to-t from-indigo-500/60 to-amber-300/80"
                  style={{ height: `${Math.max(4, (d.count / dayMax) * 130)}px` }}
                />
                <span className="text-[10px] text-slate-500">
                  {d.date.slice(5)}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
