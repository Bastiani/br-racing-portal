import { IconType } from 'react-icons';

interface ButtonProps {
  children: React.ReactNode;
  icon?: IconType;
  onClick?: () => void;
  variant?: 'default' | 'profile';
}

export function Button({ children, icon: Icon, onClick, variant = 'default' }: ButtonProps) {
  const styles = {
    default: "bg-[var(--dark-cyan)] hover:bg-[var(--midnight-green)] text-white px-4 py-2 rounded-md transition-colors flex items-center gap-2",
    profile: "bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors flex items-center gap-2"
  };

  return (
    <button 
      onClick={onClick}
      className={styles[variant]}
    >
      {Icon && <Icon className="w-4 h-4" />}
      <span>{children}</span>
    </button>
  );
}