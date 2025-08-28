"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";
import { ptBR } from "date-fns/locale";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

// export NOMEADO (use: import { Calendar } from ".../calendar")
export function Calendar(props: CalendarProps) {
  return <DayPicker locale={ptBR} showOutsideDays {...props} />;
}
