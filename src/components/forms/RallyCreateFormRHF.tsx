import { useEffect, useCallback } from "react"
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
import { createRally, getAllChampionships } from "@/lib/championshipDB"
import { useAdminForms } from '@/contexts/AdminFormsContext'

const rallySchema = z.object({
  championship_id: z.string().min(1, "Campeonato é obrigatório"),
  name: z.string().min(1, "Nome é obrigatório"),
  location: z.string().optional(),
  rally_date: z.string().min(1, "Data do rally é obrigatória"),
  rsf_rally: z.string().min(1, "Rally RSF é obrigatório"),
  status: z.enum(["scheduled", "ongoing", "finished", "cancelled"]),
})

type RallyFormData = z.infer<typeof rallySchema>

interface RallyCreateFormRHFProps {
  onRallyCreated?: (rallyId: number) => void
  preselectedChampionshipId?: number
}

export default function RallyCreateFormRHF({ onRallyCreated, preselectedChampionshipId }: RallyCreateFormRHFProps) {
  const {
    championships,
    setChampionships,
    setSelectedRallyId,
    setCurrentStep,
    isLoading,
    setIsLoading,
    isLoadingChampionships,
    setIsLoadingChampionships,
    error,
    setError,
    success,
    setSuccess
  } = useAdminForms()

  const form = useForm<RallyFormData>({
    resolver: zodResolver(rallySchema),
    defaultValues: {
      championship_id: preselectedChampionshipId?.toString() || "",
      name: "",
      location: "",
      rally_date: "",
      rsf_rally: "",
      status: "scheduled",
    },
  })

  const loadChampionships = useCallback(async () => {
    try {
      setIsLoadingChampionships(true)
      const data = await getAllChampionships()
      setChampionships(data)
    } catch (error) {
      setError(`Erro ao carregar campeonatos: ${error}`)
    } finally {
      setIsLoadingChampionships(false)
    }
  }, [setIsLoadingChampionships, setChampionships, setError])

  useEffect(() => {
    if (preselectedChampionshipId) {
      form.setValue('championship_id', preselectedChampionshipId.toString())
    }
  }, [preselectedChampionshipId, form])

  useEffect(() => {
    loadChampionships()
  }, [loadChampionships])

  const onSubmit = async (data: RallyFormData) => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // Criar data local para evitar problemas de fuso horário
      const [year, month, day] = data.rally_date.split('-').map(Number)
      const localDate = new Date(year, month - 1, day)
      
      const rally = await createRally({
        championship_id: parseInt(data.championship_id),
        name: data.name,
        location: data.location || undefined,
        rally_date: localDate,
        rsf_rally: data.rsf_rally,
        status: data.status
      })

      setSuccess(`Rally "${rally.name}" criado com sucesso!`)
      form.reset({
        championship_id: preselectedChampionshipId?.toString() || "",
        name: "",
        location: "",
        rally_date: "",
        rsf_rally: "",
        status: "scheduled",
      })
      
      // Atualizar contexto e navegar para próximo passo
      setSelectedRallyId(rally.id)
      setCurrentStep('import')
      
      onRallyCreated?.(rally.id)
    } catch (error) {
      setError(`Erro ao criar rally: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  const statusOptions = [
    { value: "scheduled", label: "Agendado" },
    { value: "ongoing", label: "Em Andamento" },
    { value: "finished", label: "Finalizado" },
    { value: "cancelled", label: "Cancelado" },
  ]

  const championshipOptions = championships.map(championship => ({
    value: championship.id.toString(),
    label: `${championship.name} (${championship.season})`
  }))

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Criar Novo Rally</CardTitle>
        <CardDescription>
          Adicione um novo rally ao campeonato selecionado.
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
              name="championship_id"
              render={({ field }) => (
                <FormSelectField
                  label="Campeonato *"
                  placeholder={isLoadingChampionships ? "Carregando..." : "Selecione um campeonato"}
                  options={championshipOptions}
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isLoadingChampionships || !!preselectedChampionshipId}
                />
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormInputField
                  label="Nome do Rally *"
                  placeholder="Ex: Rally de Brasília"
                  {...field}
                />
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormInputField
                  label="Localização"
                  placeholder="Ex: Brasília, DF"
                  {...field}
                />
              )}
            />

            <FormField
              control={form.control}
              name="rally_date"
              render={({ field }) => (
                <FormDatePickerField
                  label="Data do Rally *"
                  placeholder="Selecione a data do rally"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />

            <FormField
              control={form.control}
              name="rsf_rally"
              render={({ field }) => (
                <FormInputField
                  label="Rally RSF *"
                  placeholder="Ex: RSF001"
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

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={isLoading || isLoadingChampionships}>
                {isLoading ? "Criando..." : "Criar Rally"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}