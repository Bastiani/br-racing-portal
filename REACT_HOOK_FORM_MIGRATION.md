# Migração para React Hook Form

Este documento descreve a migração dos formulários existentes para usar `react-hook-form` e os novos componentes criados.

## Novos Componentes Criados

### Componentes de UI com React Hook Form

1. **FormInputField** (`/src/components/ui/FormInputField.tsx`)
   - Versão do `InputField` compatível com react-hook-form
   - Integra automaticamente com validação e mensagens de erro
   - Suporte a ícones e variantes

2. **FormDatePickerField** (`/src/components/ui/FormDatePickerField.tsx`)
   - Versão do `DatePickerField` compatível com react-hook-form
   - Integra com o sistema de formulários

3. **FormSelectField** (`/src/components/ui/FormSelectField.tsx`)
   - Campo de seleção compatível com react-hook-form
   - Suporte a opções dinâmicas

### Formulários Migrados

1. **ChampionshipCreateFormRHF** (`/src/components/forms/ChampionshipCreateFormRHF.tsx`)
   - Versão migrada do `ChampionshipCreateForm`
   - Validação com Zod schema
   - Melhor gerenciamento de estado

2. **RallyCreateFormRHF** (`/src/components/forms/RallyCreateFormRHF.tsx`)
   - Versão migrada do `RallyCreateForm`
   - Validação com Zod schema
   - Carregamento dinâmico de campeonatos

3. **ChampionshipEditFormRHF** (`/src/components/forms/ChampionshipEditFormRHF.tsx`)
   - Versão migrada do `ChampionshipEditForm`
   - Carregamento automático de dados existentes
   - Validação com Zod schema

4. **RallyEditFormRHF** (`/src/components/forms/RallyEditFormRHF.tsx`)
   - Versão migrada do `RallyEditForm`
   - Carregamento automático de dados existentes
   - Validação com Zod schema

5. **ChampionshipImportFormRHF** (`/src/components/forms/ChampionshipImportFormRHF.tsx`)
   - Versão migrada do `ChampionshipImportForm`
   - Validação de arquivo CSV
   - Validação com Zod schema

## Principais Melhorias

### 1. Validação com Zod
- Validação tipada e robusta
- Mensagens de erro personalizadas
- Validação em tempo real

### 2. Melhor Performance
- Re-renderizações otimizadas
- Validação apenas quando necessário
- Melhor gerenciamento de estado

### 3. Experiência do Desenvolvedor
- TypeScript completo
- Autocompletar melhorado
- Menos código boilerplate

### 4. Experiência do Usuário
- Validação em tempo real
- Mensagens de erro mais claras
- Melhor acessibilidade

## Como Usar

### Exemplo Básico

```tsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormField } from "@/components/ui/form"
import { FormInputField } from "@/components/ui/FormInputField"

const schema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
})

type FormData = z.infer<typeof schema>

function MyForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
    },
  })

  const onSubmit = (data: FormData) => {
    console.log(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormInputField
              label="Nome"
              placeholder="Digite seu nome"
              {...field}
            />
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormInputField
              label="Email"
              type="email"
              placeholder="Digite seu email"
              {...field}
            />
          )}
        />
        
        <Button type="submit">Enviar</Button>
      </form>
    </Form>
  )
}
```

### Substituindo Formulários Existentes

Para migrar um formulário existente:

1. **Importe os novos componentes:**
```tsx
// Ao invés de:
import ChampionshipCreateForm from '@/components/forms/ChampionshipCreateForm'

// Use:
import ChampionshipCreateFormRHF from '@/components/forms/ChampionshipCreateFormRHF'
```

2. **Substitua no JSX:**
```tsx
// Ao invés de:
<ChampionshipCreateForm onChampionshipCreated={handleCreate} />

// Use:
<ChampionshipCreateFormRHF onChampionshipCreated={handleCreate} />
```

## Dependências

As seguintes dependências já estão instaladas no projeto:

- `react-hook-form`: ^7.58.1
- `@hookform/resolvers`: ^5.0.1
- `zod`: ^3.25.55

## Próximos Passos

1. **Testar os novos formulários** em desenvolvimento
2. **Substituir gradualmente** os formulários antigos pelos novos
3. **Remover os formulários antigos** após confirmação de que tudo funciona
4. **Criar novos formulários** usando os componentes RHF

## Estrutura de Arquivos

```
src/
├── components/
│   ├── ui/
│   │   ├── FormInputField.tsx      # Novo
│   │   ├── FormDatePickerField.tsx # Novo
│   │   ├── FormSelectField.tsx     # Novo
│   │   ├── InputField.tsx          # Existente (manter para compatibilidade)
│   │   └── form.tsx                # Existente (componentes base do shadcn)
│   └── forms/
│       ├── ChampionshipCreateForm.tsx    # Existente
│       ├── ChampionshipCreateFormRHF.tsx # Novo
│       ├── RallyCreateForm.tsx           # Existente
│       ├── RallyCreateFormRHF.tsx        # Novo
│       ├── ChampionshipEditForm.tsx      # Existente
│       ├── ChampionshipEditFormRHF.tsx   # Novo
│       ├── RallyEditForm.tsx             # Existente
│       ├── RallyEditFormRHF.tsx          # Novo
│       ├── ChampionshipImportForm.tsx    # Existente
│       └── ChampionshipImportFormRHF.tsx # Novo
```

## Benefícios da Migração

- ✅ **Validação robusta** com Zod
- ✅ **Melhor performance** com re-renderizações otimizadas
- ✅ **TypeScript completo** com inferência de tipos
- ✅ **Menos código boilerplate**
- ✅ **Melhor experiência do usuário** com validação em tempo real
- ✅ **Acessibilidade aprimorada**
- ✅ **Manutenibilidade melhorada**