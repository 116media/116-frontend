"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { LAUNCH_DATE } from "@/modules/coming-soon/presentation/constants/comingSoon";
import {
    type ILaunchRemaining,
    padUnit,
    remainingUntil
} from "@/modules/coming-soon/presentation/utils/countdown/countdown.utils";

/**
 * LaunchCountdown
 *
 * @description
 * How long until the platform opens, ticking each second. Renders blank until mounted:
 * the server and the client would otherwise disagree on the remaining time and React
 * would discard the markup.
 */
export function LaunchCountdown() {
    const { t } = useTranslation();
    const [left, setLeft] = useState<ILaunchRemaining | null>(null);

    useEffect(() => {
        setLeft(remainingUntil(LAUNCH_DATE));

        const timer = window.setInterval(() => setLeft(remainingUntil(LAUNCH_DATE)), 1_000);
        return () => window.clearInterval(timer);
    }, []);

    const units = [
        { key: "days", value: left?.days, label: t("comingSoon.launch.countdown.days") },
        { key: "hours", value: left?.hours, label: t("comingSoon.launch.countdown.hours") },
        { key: "minutes", value: left?.minutes, label: t("comingSoon.launch.countdown.minutes") },
        { key: "seconds", value: left?.seconds, label: t("comingSoon.launch.countdown.seconds") }
    ];

    return (
        <div
            role="timer"
            aria-live="off"
            aria-label={
                left
                    ? t("comingSoon.launch.countdown.label", {
                          days: left.days,
                          hours: left.hours,
                          minutes: left.minutes
                      })
                    : undefined
            }
            className="flex flex-wrap gap-3"
        >
            {units.map((unit) => (
                <div
                    key={unit.key}
                    className="flex min-w-18 flex-col items-center gap-1 rounded-lg border border-foreground/5 bg-surface-raised px-4 py-3"
                >
                    <span className="font-bold text-3xl text-foreground tabular-nums">
                        {unit.value === undefined ? "--" : padUnit(unit.value)}
                    </span>
                    <span className="text-muted-foreground text-xs uppercase tracking-wide">
                        {unit.label}
                    </span>
                </div>
            ))}
        </div>
    );
}
