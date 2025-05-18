import { FiSave, FiLock, FiMail, FiGlobe, FiBriefcase, FiBell } from 'react-icons/fi';

export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Configurau00e7u00f5es</h1>
      
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg shadow-md overflow-hidden mb-6">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <FiGlobe className="text-[var(--dark-cyan)]" />
            <span>Configurau00e7u00f5es Gerais</span>
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                <FiBriefcase className="text-[var(--dark-cyan)] w-4 h-4" />
                <span>Nome da Empresa</span>
              </label>
              <input 
                type="text" 
                className="w-full border border-[var(--card-border)] bg-[var(--background)] rounded-md px-3 py-2" 
                defaultValue="Minha Empresa Ltda."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                <FiMail className="text-[var(--dark-cyan)] w-4 h-4" />
                <span>Email de Contato</span>
              </label>
              <input 
                type="email" 
                className="w-full border border-[var(--card-border)] bg-[var(--background)] rounded-md px-3 py-2" 
                defaultValue="contato@minhaempresa.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Fuso Horu00e1rio</label>
              <select className="w-full border border-[var(--card-border)] bg-[var(--background)] rounded-md px-3 py-2">
                <option>America/Sao_Paulo (GMT-3)</option>
                <option>America/New_York (GMT-5)</option>
                <option>Europe/London (GMT+0)</option>
                <option>Asia/Tokyo (GMT+9)</option>
              </select>
            </div>
            
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="notifications" 
                className="h-4 w-4 text-[var(--dark-cyan)] border-[var(--card-border)] rounded" 
                defaultChecked
              />
              <label htmlFor="notifications" className="ml-2 block text-sm flex items-center gap-2">
                <FiBell className="text-[var(--dark-cyan)] w-4 h-4" />
                <span>Ativar notificau00e7u00f5es por email</span>
              </label>
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
      
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <FiLock className="text-[var(--dark-cyan)]" />
            <span>Seguranau00e7a</span>
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Senha Atual</label>
              <input 
                type="password" 
                className="w-full border border-[var(--card-border)] bg-[var(--background)] rounded-md px-3 py-2" 
                placeholder="Digite sua senha atual"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Nova Senha</label>
              <input 
                type="password" 
                className="w-full border border-[var(--card-border)] bg-[var(--background)] rounded-md px-3 py-2" 
                placeholder="Digite a nova senha"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Confirmar Nova Senha</label>
              <input 
                type="password" 
                className="w-full border border-[var(--card-border)] bg-[var(--background)] rounded-md px-3 py-2" 
                placeholder="Confirme a nova senha"
              />
            </div>
            
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="two-factor" 
                className="h-4 w-4 text-[var(--dark-cyan)] border-[var(--card-border)] rounded" 
              />
              <label htmlFor="two-factor" className="ml-2 block text-sm">
                Ativar autenticau00e7u00e3o de dois fatores
              </label>
            </div>
          </div>
          
          <div className="mt-6">
            <button className="bg-[var(--dark-cyan)] hover:bg-[var(--midnight-green)] text-white px-4 py-2 rounded-md transition-colors flex items-center gap-2">
              <FiLock className="w-4 h-4" />
              <span>Atualizar Senha</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}