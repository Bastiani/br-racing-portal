import Link from 'next/link';
import { FiHome, FiFileText, FiSettings, FiFlag } from 'react-icons/fi';

type SidebarItemProps = {
  icon: React.ReactNode;
  text: string;
  href: string;
};

const SidebarItem = ({ icon, text, href }: SidebarItemProps) => {
  return (
    <Link 
      href={href} 
      className="flex items-center gap-4 px-3 py-2 rounded-lg hover:bg-[var(--sidebar-hover)] transition-colors"
    >
      <div className="w-6 h-6 flex items-center justify-center text-[var(--tiffany-blue)]">
        {icon}
      </div>
      <span className="sidebar-item-text">{text}</span>
    </Link>
  );
};

export default function Sidebar() {
  return (
    <aside className="sidebar text-[var(--sidebar-text)] h-screen overflow-hidden hover:overflow-y-auto sticky top-0 left-0 z-10">
      <div className="p-4">
        <div className="flex items-center justify-center h-12 mb-6">
          <div className="text-[var(--dark-cyan)] text-2xl font-bold">AD</div>
        </div>
        
        <nav className="flex flex-col gap-2">
          <SidebarItem icon={<FiHome size={20} />} text="Dashboard" href="/admin" />
          <SidebarItem icon={<FiFlag size={20} />} text="Rallies" href="/admin/rallies" />
          <SidebarItem icon={<FiFileText size={20} />} text="Relatórios" href="/admin/reports" />
          <SidebarItem icon={<FiSettings size={20} />} text="Configurações" href="/admin/settings" />
        </nav>
      </div>
    </aside>
  );
}