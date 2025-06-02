import { IconType } from 'react-icons';

interface SectionHeaderProps {
  title: string;
  icon: IconType;
}

export function SectionHeader({ title, icon: Icon }: SectionHeaderProps) {
  return (
    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
      <Icon className="text-[var(--dark-cyan)]" />
      <span>{title}</span>
    </h2>
  );
}