interface BrandMarkProps {
  className?: string;
}

export function BrandMark({ className }: BrandMarkProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 96 48"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M5 7h8v13L25 7h11L21 23l16 18H26L13 26v15H5V7Z"
      />
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M40 7h16c10 0 16 5 16 14S66 35 56 35h-7v6h-9V7Zm9 8v12h7c5 0 7-2 7-6s-2-6-7-6h-7Z"
        clipRule="evenodd"
      />
      <path
        fill="currentColor"
        d="M76 7h15v7h-3v20h3v7H76v-7h3V14h-3V7Z"
      />
    </svg>
  );
}
