import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { FormInputField } from '@/components/ui/FormInputField'
import { FormDatePickerField } from '@/components/ui/FormDatePickerField'
import { FormSelectField } from '@/components/ui/FormSelectField'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Form, FormField } from "@/components/ui/form"
import { createChampionship } from "@/lib/championshipDB"
import { useAdminForms } from '@/contexts/AdminFormsContext'

const championshipSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  season: z.string().min(1, "Temporada é obrigatória"),
  status: z.enum(["active", "finished", "cancelled"]),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  image_url: z.string().optional(),
})

type ChampionshipFormData = z.infer<typeof championshipSchema>

interface ChampionshipCreateFormRHFProps {
  onChampionshipCreated?: (championshipId: number) => void
}

export default function ChampionshipCreateFormRHF({ onChampionshipCreated }: ChampionshipCreateFormRHFProps) {
  const {
    setSelectedChampionshipId,
    setCurrentStep,
    isLoading,
    setIsLoading,
    error,
    setError,
    success,
    setSuccess
  } = useAdminForms()

  const form = useForm<ChampionshipFormData>({
    resolver: zodResolver(championshipSchema),
    defaultValues: {
      name: "",
      season: "",
      status: "active",
      start_date: "",
      end_date: "",
      image_url: "",
    },
  })

  const onSubmit = async (data: ChampionshipFormData) => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // Criar datas locais para evitar problemas de fuso horário
      let startDate: Date | undefined
      let endDate: Date | undefined
      
      if (data.start_date) {
        const [year, month, day] = data.start_date.split('-').map(Number)
        startDate = new Date(year, month - 1, day)
      }
      
      if (data.end_date) {
        const [year, month, day] = data.end_date.split('-').map(Number)
        endDate = new Date(year, month - 1, day)
      }
      
      const championship = await createChampionship({
        name: data.name,
        season: parseInt(data.season),
        status: data.status,
        start_date: startDate,
        end_date: endDate,
        image_url: data.image_url || undefined
      })

      setSuccess(`Campeonato "${championship.name}" criado com sucesso!`)
      form.reset()
      
      // Atualizar contexto e navegar para próximo passo
      setSelectedChampionshipId(championship.id)
      setCurrentStep('rally')
      
      onChampionshipCreated?.(championship.id)
    } catch (error) {
      setError(`Erro ao criar campeonato: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  const statusOptions = [
    { value: "active", label: "Ativo" },
    { value: "finished", label: "Finalizado" },
    { value: "cancelled", label: "Cancelado" },
  ]

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Criar Novo Campeonato</CardTitle>
        <CardDescription>
          Crie um novo campeonato para organizar os rallies e calcular pontuações.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert className="mb-4">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormInputField
                  label="Nome do Campeonato *"
                  placeholder="Ex: Campeonato Brasileiro de Rally 2024"
                  {...field}
                />
              )}
            />

            <FormField
              control={form.control}
              name="season"
              render={({ field }) => (
                <FormInputField
                  label="Temporada *"
                  placeholder="Ex: 2024"
                  type="number"
                  {...field}
                />
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormSelectField
                  label="Status"
                  placeholder="Selecione o status"
                  options={statusOptions}
                  value={field.value}
                  onValueChange={field.onChange}
                />
              )}
            />

            <FormField
              control={form.control}
              name="start_date"
              render={({ field }) => (
                <FormDatePickerField
                  label="Data de Início"
                  placeholder="Selecione a data de início"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />

            <FormField
              control={form.control}
              name="end_date"
              render={({ field }) => (
                <FormDatePickerField
                  label="Data de Fim"
                  placeholder="Selecione a data de fim"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />

            <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormInputField
                  label="URL da Imagem"
                  placeholder="https://exemplo.com/imagem.jpg"
                  type="url"
                  {...field}
                />
              )}
            />

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Criando..." : "Criar Campeonato"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}