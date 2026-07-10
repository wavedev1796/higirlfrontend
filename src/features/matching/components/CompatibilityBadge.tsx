interface CompatibilityBadgeProps {
  value: number;
  className?: string;
}

export function formatCompatibility(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}

export function CompatibilityBadge({
  value,
  className = "",
}: CompatibilityBadgeProps) {
  return (
    <span className={`compatibility-badge ${className}`}>
      {formatCompatibility(value)}% compatible
    </span>
  );
}
