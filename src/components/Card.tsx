interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'profile';
  className?: string;
}

export function Card({ children, variant = 'default', className = '' }: CardProps) {
  const styles = {
    default: "bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg shadow-md overflow-hidden mb-6",
    profile: "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md overflow-hidden"
  };

  return (
    <div className={`${styles[variant]} ${className}`}>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}