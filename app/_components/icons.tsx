import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function IconBase({ children, ...props }: IconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

export function CheckCircleIcon(props: IconProps) {
  return <IconBase {...props}><circle cx="8" cy="8" r="5.5" /><path d="m5.5 8 1.65 1.65 3.6-3.65" /></IconBase>;
}

export function ClockIcon(props: IconProps) {
  return <IconBase {...props}><circle cx="8" cy="8" r="5.5" /><path d="M8 4.75V8l2.25 1.35" /></IconBase>;
}

export function TrendUpIcon(props: IconProps) {
  return <IconBase {...props}><path d="m3 10.75 3.2-3.2 2.15 2.15L13 5.05" /><path d="M9.75 5.05H13V8.3" /></IconBase>;
}

export function TrendDownIcon(props: IconProps) {
  return <IconBase {...props}><path d="m3 5.25 3.2 3.2 2.15-2.15L13 10.95" /><path d="M9.75 10.95H13V7.7" /></IconBase>;
}

export function MinusIcon(props: IconProps) {
  return <IconBase {...props}><path d="M4 8h8" /></IconBase>;
}

export function PendingIcon(props: IconProps) {
  return <IconBase {...props}><circle cx="8" cy="8" r="5.5" /><path d="M8 4.75V8h2.5" /></IconBase>;
}

export function LogoutIcon(props: IconProps) {
  return <IconBase {...props}><path d="M6.25 3H3.5v10h2.75" /><path d="M8.25 5.25 11 8l-2.75 2.75M11 8H6" /></IconBase>;
}

export function CalendarRangeIcon(props: IconProps) {
  return <IconBase {...props}><rect x="2.5" y="3.5" width="11" height="10" rx="1.5" /><path d="M5 2.5v2M11 2.5v2M2.5 6.5h11" /></IconBase>;
}

export function ArrowRightIcon(props: IconProps) {
  return <IconBase {...props}><path d="M3.5 8h9M9.5 5l3 3-3 3" /></IconBase>;
}

export function SeriesLineIcon(props: IconProps) {
  return <IconBase {...props}><path d="M2.5 9.5c2-3 3.25-3 5-1.5s3 .75 6-2" /></IconBase>;
}

export function ActivityIcon(props: IconProps) {
  return <IconBase {...props}><path d="M2.25 8h2.1l1.4-3.25L8.5 11.5l1.55-3.5h3.7" /></IconBase>;
}

export function AlertCircleIcon(props: IconProps) {
  return <IconBase {...props}><circle cx="8" cy="8" r="5.5" /><path d="M8 5v3.5M8 11h.01" /></IconBase>;
}
