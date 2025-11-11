import { sql } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { containerEvent } from "@/db/schemas/container-schema";
import { MonthlyStats } from "@/types/containerTypes";

export async function getContainerMonthlyStats(
  containerId: string,
  year: number = new Date().getFullYear(),
): Promise<MonthlyStats[]> {
  const startOfYear = new Date(Date.UTC(year, 0, 1));
  const endOfYear = new Date(Date.UTC(year, 11, 31, 23, 59, 59, 999));

  const { rows } = await db.execute<MonthlyStats>(sql`
with months as (
  select generate_series(
    date_trunc('year', ${startOfYear}::timestamptz),
    date_trunc('month', ${endOfYear}::timestamptz),
    interval '1 month'
  ) as month_start
),
    events as (
      select
        date_trunc('month', ${containerEvent.occurredAt}) as month_start,
        ${containerEvent.eventType} as event_type,
        count(*) as total
      from ${containerEvent}
      where ${containerEvent.containerId} = ${containerId}
        and ${containerEvent.occurredAt} between ${startOfYear} and ${endOfYear}
      group by 1, 2
    )
    select
      to_char(months.month_start, 'FMMonth') as month,
      coalesce(sum(events.total) filter (where events.event_type = 'view'), 0) as views,
      coalesce(sum(events.total) filter (where events.event_type = 'download'), 0) as downloads
    from months
    left join events on events.month_start = months.month_start
    group by months.month_start
    order by months.month_start;
  `);

  return rows;
}
