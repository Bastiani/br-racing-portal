import { IconType } from 'react-icons';

interface InputFieldProps {
  label: string;
  type?: 'text' | 'email' | 'password';
  defaultValue?: string;
  value?: string;
  placeholder?: string;
  icon?: IconType;
  variant?: 'default' | 'profile';
  readOnly?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function InputField({ 
  label, 
  type = 'text', 
  defaultValue, 
  value,
  placeholder, 
  icon: Icon,
  variant = 'default',
  readOnly,
  onChange
}: InputFieldProps) {
  const styles = {
    default: {
      input: "w-full border border-[var(--card-border)] bg-[var(--background)] rounded-md px-3 py-2",
      icon: "text-[var(--dark-cyan)] w-4 h-4"
    },
    profile: {
      input: "w-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-md px-3 py-2",
      icon: "text-blue-500 w-4 h-4"
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-1 flex items-center gap-2">
        {Icon && <Icon className={styles[variant].icon} />}
        <span>{label}</span>
      </label>
      <input 
        type={type}
        className={styles[variant].input}
        defaultValue={defaultValue}
        value={value}
        placeholder={placeholder}
        readOnly={readOnly}
        onChange={onChange}
      />
    </div>
  );
}