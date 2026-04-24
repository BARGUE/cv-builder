"use client";

import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { FileText, Calendar, TrendingUp } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import type { AccountStatsProps } from "@/src/components/account/types";
import { getTemplateColor } from "@/src/lib/utils";

const AccountStats = ({ cvs }: AccountStatsProps) => {
  const t = useTranslations("account");
  const locale = useLocale();

  const { totalCvs, templateData, monthlyData, lastActivity } = useMemo(() => {
    const totalCvs = cvs.length;

    const tplMap: Record<string, number> = {};
    cvs.forEach((cv) => {
      tplMap[cv.template] = (tplMap[cv.template] || 0) + 1;
    });
    const templateData = Object.entries(tplMap).map(([name, value]) => ({ name, value }));

    const months: Record<string, number> = {};
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.toLocaleDateString(locale, { month: "short" });
      months[key] = 0;
    }
    cvs.forEach((cv) => {
      const d = new Date(cv.updatedAt);
      const key = d.toLocaleDateString(locale, { month: "short" });
      if (key in months) months[key]++;
    });
    const monthlyData = Object.entries(months).map(([month, count]) => ({ month, count }));

    let lastActivity: string | null = null;
    if (cvs.length > 0) {
      const latest = cvs.reduce((a, b) =>
        new Date(a.updatedAt) > new Date(b.updatedAt) ? a : b
      );
      lastActivity = new Date(latest.updatedAt).toLocaleDateString(locale, {
        day: "numeric", month: "long", year: "numeric",
      });
    }

    return { totalCvs, templateData, monthlyData, lastActivity };
  }, [cvs, locale]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-card p-4 flex flex-col items-center gap-1">
          <FileText className="h-5 w-5 text-primary mb-1" />
          <span className="text-2xl font-bold text-foreground">{totalCvs}</span>
          <span className="text-xs text-muted-foreground">{t("stats.cvsCreated")}</span>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 flex flex-col items-center gap-1">
          <TrendingUp className="h-5 w-5 text-primary mb-1" />
          <span className="text-2xl font-bold text-foreground">{templateData.length}</span>
          <span className="text-xs text-muted-foreground">{t("stats.templatesUsed")}</span>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 flex flex-col items-center gap-1">
          <Calendar className="h-5 w-5 text-primary mb-1" />
          <span className="text-2xl font-bold text-foreground text-center text-sm">{lastActivity || "—"}</span>
          <span className="text-xs text-muted-foreground">{t("stats.lastActivity")}</span>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">{t("stats.activityChartTitle")}</h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={monthlyData}>
            <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {templateData.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">{t("stats.templateDistribution")}</h3>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width={120} height={120}>
              <PieChart>
                <Pie data={templateData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={50} strokeWidth={2}>
                  {templateData.map((entry, i) => (
                    <Cell key={i} fill={getTemplateColor(entry.name, i)} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2">
              {templateData.map((tpl, i) => (
                <div key={tpl.name} className="flex items-center gap-2 text-sm">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: getTemplateColor(tpl.name, i) }} />
                  <span className="text-muted-foreground capitalize">{tpl.name}</span>
                  <span className="font-medium text-foreground">{tpl.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountStats;
