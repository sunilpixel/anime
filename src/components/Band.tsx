import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export function Band({ children, className = "" }: Props) {
  return (
    <div
      data-band
      className={`absolute inset-x-[-8%] inset-y-[4%] origin-center -rotate-[2.4deg] overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
}
