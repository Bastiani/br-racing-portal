import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { FormInputField } from '@/components/ui/FormInputField'
import { FormDatePickerField } from '@/components/ui/FormDatePickerField'
import { FormSelectField } from '@/components/ui/FormSelectField'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormField } from "@/components/ui/form"
import { User, Mail, Calendar } from "lucide-react"

// Schema de validação com Zod
const exampleSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  birthDate: z.string().optional(),
  category: z.string().min(1, "Categoria é obrigatória"),
  description: z.string().optional(),
})

type ExampleFormData = z.infer<typeof exampleSchema>

/**
 * Exemplo de formulário usando React Hook Form com os novos componentes
 * Este é um exemplo de como usar os componentes FormInputField, FormDatePickerField e FormSelectField
 */
export default function ExampleFormRHF() {
  const form = useForm<ExampleFormData>({
    resolver: zodResolver(exampleSchema),
    defaultValues: {
      name: "",
      email: "",
      birthDate: "",
      category: "",
      description: "",
    },
  })

  const onSubmit = (data: ExampleFormData) => {
    console.log("Dados do formulário:", data)
    alert("Formulário enviado com sucesso! Veja o console para os dados.")
  }

  const categoryOptions = [
    { value: "n1", label: "N1 - Produção" },
    { value: "n2", label: "N2 - Produção Melhorada" },
    { value: "n3", label: "N3 - Super Produção" },
    { value: "n4", label: "N4 - Super Produção Melhorada" },
    { value: "r3", label: "R3 - Rally" },
    { value: "r5", label: "R5 - Rally" },
  ]

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Exemplo de Formulário com React Hook Form</CardTitle>
        <CardDescription>
          Este é um exemplo de como usar os novos componentes de formulário com validação Zod.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Campo de texto com ícone */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormInputField
                  label="Nome Completo *"
                  placeholder="Digite seu nome completo"
                  icon={User}
                  {...field}
                />
              )}
            />

            {/* Campo de email com ícone */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormInputField
                  label="Email *"
                  type="email"
                  placeholder="seu@email.com"
                  icon={Mail}
                  {...field}
                />
              )}
            />

            {/* Campo de data */}
            <FormField
              control={form.control}
              name="birthDate"
              render={({ field }) => (
                <FormDatePickerField
                  label="Data de Nascimento"
                  placeholder="Selecione sua data de nascimento"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />

            {/* Campo de seleção */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormSelectField
                  label="Categoria *"
                  placeholder="Selecione uma categoria"
                  options={categoryOptions}
                  value={field.value}
                  onValueChange={field.onChange}
                />
              )}
            />

            {/* Campo de texto longo */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormInputField
                  label="Descrição"
                  placeholder="Conte um pouco sobre você..."
                  {...field}
                />
              )}
            />

            {/* Botões */}
            <div className="flex gap-2 pt-4">
              <Button type="submit">
                Enviar Formulário
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => form.reset()}
              >
                Limpar
              </Button>
            </div>
          </form>
        </Form>

        {/* Informações de debug */}
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h4 className="font-medium mb-2">Estado do Formulário (Debug):</h4>
          <div className="text-sm space-y-1">
            <p><strong>Válido:</strong> {form.formState.isValid ? "Sim" : "Não"}</p>
            <p><strong>Enviando:</strong> {form.formState.isSubmitting ? "Sim" : "Não"}</p>
            <p><strong>Campos tocados:</strong> {Object.keys(form.formState.touchedFields).join(", ") || "Nenhum"}</p>
            <p><strong>Erros:</strong> {Object.keys(form.formState.errors).join(", ") || "Nenhum"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}