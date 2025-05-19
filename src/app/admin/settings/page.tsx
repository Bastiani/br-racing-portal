import { FiSave, FiLock, FiMail, FiGlobe, FiBriefcase, FiBell } from 'react-icons/fi';
import { Card } from '@/components/Card';
import { InputField } from '@/components/InputField';
import { Button } from '@/components/Button';
import { SectionHeader } from '@/components/SectionHeader';
import { CheckboxField } from '@/components/CheckboxField';

export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Configurações</h1>
      
      <Card>
        <SectionHeader title="Configurações Gerais" icon={FiGlobe} />
        
        <div className="space-y-4">
          <InputField
            label="Nome da Empresa"
            icon={FiBriefcase}
            defaultValue="Minha Empresa Ltda."
          />
          
          <InputField
            label="Email de Contato"
            type="email"
            icon={FiMail}
            defaultValue="contato@minhaempresa.com"
          />
          
          <div>
            <label className="block text-sm font-medium mb-1">Fuso Horário</label>
            <select className="w-full border border-[var(--card-border)] bg-[var(--background)] rounded-md px-3 py-2">
              <option>America/Sao_Paulo (GMT-3)</option>
              <option>America/New_York (GMT-5)</option>
              <option>Europe/London (GMT+0)</option>
              <option>Asia/Tokyo (GMT+9)</option>
            </select>
          </div>
          
          <CheckboxField
            id="notifications"
            label="Ativar notificações por email"
            defaultChecked
            icon={FiBell}
          />
        </div>
        
        <div className="mt-6">
          <Button icon={FiSave}>
            Salvar Alterações
          </Button>
        </div>
      </Card>
      
      <Card>
        <SectionHeader title="Segurança" icon={FiLock} />
        
        <div className="space-y-4">
          <InputField
            label="Senha Atual"
            type="password"
            placeholder="Digite sua senha atual"
          />
          
          <InputField
            label="Nova Senha"
            type="password"
            placeholder="Digite a nova senha"
          />
          
          <InputField
            label="Confirmar Nova Senha"
            type="password"
            placeholder="Confirme a nova senha"
          />
          
          <CheckboxField
            id="two-factor"
            label="Ativar autenticação de dois fatores"
          />
        </div>
        
        <div className="mt-6">
          <Button icon={FiLock}>
            Atualizar Senha
          </Button>
        </div>
      </Card>
    </div>
  );
}