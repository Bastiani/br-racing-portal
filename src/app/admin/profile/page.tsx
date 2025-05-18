import { FiUser, FiMail, FiPhone, FiBriefcase, FiSave, FiBell, FiGlobe } from 'react-icons/fi';

export default function ProfilePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Perfil do Usuu00e1rio</h1>
      
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg shadow-md overflow-hidden mb-6">
        <div className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-6">
            <div className="w-24 h-24 rounded-full bg-[var(--dark-cyan)] flex items-center justify-center text-white text-3xl font-bold">
              <FiUser size={36} />
            </div>
            <div>
              <h2 className="text-xl font-bold">Usuu00e1rio Demonstrau00e7u00e3o</h2>
              <p className="text-gray-600 dark:text-gray-400">Administrador</p>
              <p className="text-gray-600 dark:text-gray-400">usuario@exemplo.com</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Membro desde: 01/01/2023</p>
            </div>
          </div>
          
          <div className="border-t border-[var(--card-border)] pt-6">
            <h3 className="text-lg font-medium mb-4">Informau00e7u00f5es Pessoais</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                  <FiUser className="text-[var(--dark-cyan)] w-4 h-4" />
                  <span>Nome Completo</span>
                </label>
                <input 
                  type="text" 
                  className="w-full border border-[var(--card-border)] bg-[var(--background)] rounded-md px-3 py-2" 
                  defaultValue="Usuu00e1rio Demonstrau00e7u00e3o"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                  <FiMail className="text-[var(--dark-cyan)] w-4 h-4" />
                  <span>Email</span>
                </label>
                <input 
                  type="email" 
                  className="w-full border border-[var(--card-border)] bg-[var(--background)] rounded-md px-3 py-2" 
                  defaultValue="usuario@exemplo.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                  <FiPhone className="text-[var(--dark-cyan)] w-4 h-4" />
                  <span>Telefone</span>
                </label>
                <input 
                  type="tel" 
                  className="w-full border border-[var(--card-border)] bg-[var(--background)] rounded-md px-3 py-2" 
                  defaultValue="(11) 98765-4321"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                  <FiBriefcase className="text-[var(--dark-cyan)] w-4 h-4" />
                  <span>Cargo</span>
                </label>
                <input 
                  type="text" 
                  className="w-full border border-[var(--card-border)] bg-[var(--background)] rounded-md px-3 py-2" 
                  defaultValue="Administrador"
                />
              </div>
            </div>
            
            <div className="mt-6">
              <button className="bg-[var(--dark-cyan)] hover:bg-[var(--midnight-green)] text-white px-4 py-2 rounded-md transition-colors flex items-center gap-2">
                <FiSave className="w-4 h-4" />
                <span>Salvar Alterau00e7u00f5es</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h3 className="text-lg font-medium mb-4">Preferuu00eancias</h3>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="email-notifications" 
                className="h-4 w-4 text-[var(--dark-cyan)] border-[var(--card-border)] rounded" 
                defaultChecked
              />
              <label htmlFor="email-notifications" className="ml-2 block text-sm flex items-center gap-2">
                <FiBell className="text-[var(--dark-cyan)] w-4 h-4" />
                <span>Receber notificau00e7u00f5es por email</span>
              </label>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                <FiGlobe className="text-[var(--dark-cyan)] w-4 h-4" />
                <span>Idioma</span>
              </label>
              <select className="w-full border border-[var(--card-border)] bg-[var(--background)] rounded-md px-3 py-2">
                <option>Portuguuu00eas (Brasil)</option>
                <option>English (US)</option>
                <option>Espau00f1ol</option>
              </select>
            </div>
          </div>
          
          <div className="mt-6">
            <button className="bg-[var(--dark-cyan)] hover:bg-[var(--midnight-green)] text-white px-4 py-2 rounded-md transition-colors flex items-center gap-2">
              <FiSave className="w-4 h-4" />
              <span>Salvar Preferuu00eancias</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}