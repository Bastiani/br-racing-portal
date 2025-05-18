import { FiUsers, FiFileText, FiActivity } from 'react-icons/fi';

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { title: 'Usuu00e1rios', value: '1,234', color: 'bg-[var(--dark-cyan)]', icon: <FiUsers className="w-5 h-5" /> },
          { title: 'Relatu00f3rios', value: '56', color: 'bg-[var(--gamboge)]', icon: <FiFileText className="w-5 h-5" /> },
          { title: 'Atividades', value: '832', color: 'bg-[var(--midnight-green)]', icon: <FiActivity className="w-5 h-5" /> }
        ].map((stat, index) => (
          <div key={index} className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg shadow-md overflow-hidden">
            <div className={`${stat.color} h-2`}></div>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">{stat.title}</h3>
                <div className="text-[var(--dark-cyan)]">{stat.icon}</div>
              </div>
              <p className="text-3xl font-bold mt-2">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Atividades Recentes</h2>
          <div className="space-y-4">
            {[
              { user: 'Jou00e3o Silva', action: 'criou um novo relatu00f3rio', time: '2 horas atru00e1s' },
              { user: 'Maria Oliveira', action: 'atualizou configurau00e7u00f5es', time: '5 horas atru00e1s' },
              { user: 'Pedro Santos', action: 'adicionou um novo usuu00e1rio', time: '1 dia atru00e1s' },
              { user: 'Ana Costa', action: 'gerou relatu00f3rio mensal', time: '2 dias atru00e1s' },
            ].map((activity, index) => (
              <div key={index} className="flex items-start pb-4 border-b border-[var(--card-border)] last:border-0 last:pb-0">
                <div className="w-10 h-10 rounded-full bg-[var(--dark-cyan)] text-white flex items-center justify-center mr-3 flex-shrink-0">
                  {activity.user.charAt(0)}
                </div>
                <div>
                  <p>
                    <span className="font-medium">{activity.user}</span>
                    <span className="text-gray-600 dark:text-gray-400"> {activity.action}</span>
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}