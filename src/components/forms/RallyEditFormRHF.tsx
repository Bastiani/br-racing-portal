import { useState, useEffect, useCallback } from 'react'
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
import { getRallyById, getAllChampionships, updateRally } from '@/lib/championshipDB'
import { useAdminForms } from '@/contexts/AdminFormsContext'
import { RsfChampionship } from '@/types/championship'

const rallySchema = z.object({
  championship_id: z.string().min(1, "Campeonato é obrigatório"),
  name: z.string().min(1, "Nome é obrigatório"),
  location: z.string().optional(),
  rally_date: z.string().min(1, "Data do rally é obrigatória"),
  rsf_rally: z.string().min(1, "Rally RSF é obrigatório"),
  status: z.enum(["scheduled", "ongoing", "finished", "cancelled"]),
})

type RallyFormData = z.infer<typeof rallySchema>

interface RallyEditFormRHFProps {
  rallyId: number
  onSuccess?: () => void
  onCancel?: () => void
}

export default function RallyEditFormRHF({ rallyId, onSuccess, onCancel }: RallyEditFormRHFProps) {
  const {
    setError,
    setSuccess,
    error,
    success
  } = useAdminForms()

  const [championships, setChampionships] = useState<RsfChampionship[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [isLoadingChampionships, setIsLoadingChampionships] = useState(false)

  const form = useForm<RallyFormData>({
    resolver: zodResolver(rallySchema),
    defaultValues: {
      championship_id: "",
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
    } catch (err) {
      setError('Erro ao carregar campeonatos')
      console.error('Erro ao carregar campeonatos:', err)
    } finally {
      setIsLoadingChampionships(false)
    }
  }, [setError])

  const loadRallyData = useCallback(async () => {
    try {
      setLoadingData(true)
      const rally = await getRallyById(rallyId)
      if (rally) {
        form.reset({
          championship_id: rally.championship_id.toString(),
          name: rally.name,
          location: rally.location || '',
          rally_date: rally.rally_date ? new Date(rally.rally_date).toISOString().split('T')[0] : '',
          rsf_rally: rally.rsf_rally,
          status: rally.status
        })
      }
    } catch (err) {
      setError('Erro ao carregar dados do rally')
      console.error('Erro ao carregar rally:', err)
    } finally {
      setLoadingData(false)
    }
  }, [rallyId, setError, form])

  useEffect(() => {
    loadRallyData()
    loadChampionships()
  }, [loadRallyData, loadChampionships])

  const onSubmit = async (data: RallyFormData) => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // Criar data local para evitar problemas de fuso horário
      const [year, month, day] = data.rally_date.split('-').map(Number)
      const rallyDate = new Date(year, month - 1, day)
      
      await updateRally(rallyId, {
        championship_id: parseInt(data.championship_id),
        name: data.name,
        location: data.location || undefined,
        rally_date: rallyDate,
        rsf_rally: data.rsf_rally,
        status: data.status
      })
      
      setSuccess(`Rally "${data.name}" atualizado com sucesso!`)
      
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      setError(`Erro ao atualizar rally: ${error}`)
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

  if (loadingData) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="text-center">Carregando dados do rally...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Editar Rally</CardTitle>
        <CardDescription>
          Atualize as informações do rally.
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
                  disabled={isLoadingChampionships}
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
                {isLoading ? "Salvando..." : "Salvar Alterações"}
              </Button>
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}