import { IconType } from 'react-icons';

interface CheckboxFieldProps {
  id: string;
  label: string;
  defaultChecked?: boolean;
  icon?: IconType;
  variant?: 'default' | 'profile';
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function CheckboxField({ 
  id, 
  label, 
  defaultChecked, 
  icon: Icon,
  variant = 'default',
  onChange 
}: CheckboxFieldProps) {
  const styles = {
    default: {
      input: "h-4 w-4 text-[var(--dark-cyan)] border-[var(--card-border)] rounded",
      icon: "text-[var(--dark-cyan)] w-4 h-4"
    },
    profile: {
      input: "h-4 w-4 text-blue-500 border-gray-300 rounded",
      icon: "text-blue-500 w-4 h-4"
    }
  };

  return (
    <div className="flex items-center">
      <input 
        type="checkbox" 
        id={id}
        className={styles[variant].input}
        defaultChecked={defaultChecked}
        onChange={onChange}
      />
      <label htmlFor={id} className="ml-2 block text-sm flex items-center gap-2">
        {Icon && <Icon className={styles[variant].icon} />}
        <span>{label}</span>
      </label>
    </div>
  );
}