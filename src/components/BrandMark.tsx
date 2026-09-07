interface BrandMarkProps {
  className?: string;
}

export function BrandMark({ className }: BrandMarkProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 110 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <text
        x="50%"
        y="53%"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="currentColor"
        fontFamily="'Manrope', 'DM Sans', sans-serif"
        fontSize="15"
        fontWeight="800"
        letterSpacing="0.14em"
      >
        HABITUS
      </text>
    </svg>
  );
}
