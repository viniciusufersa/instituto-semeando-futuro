"use client";

import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

export function StatNumber({ value, suffix = "+" }: { value: number; suffix?: string }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.5 });
  return <span ref={ref}>{inView ? <CountUp end={value} duration={1.8} separator="." suffix={suffix} /> : "0"}</span>;
}
