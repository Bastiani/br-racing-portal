import { useState, useEffect } from 'react'
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
import { updateChampionship, getChampionshipById } from '@/lib/championshipDB'
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

interface ChampionshipEditFormRHFProps {
  championshipId: number
  onSuccess?: () => void
  onCancel?: () => void
}

export default function ChampionshipEditFormRHF({ championshipId, onSuccess, onCancel }: ChampionshipEditFormRHFProps) {
  const {
    setError,
    setSuccess,
    error,
    success
  } = useAdminForms()

  const [isLoading, setIsLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)

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

  const loadChampionshipData = async () => {
    try {
      setLoadingData(true)
      const championship = await getChampionshipById(championshipId)
      if (championship) {
        form.reset({
          name: championship.name,
          season: championship.season.toString(),
          status: championship.status,
          start_date: championship.start_date ? new Date(championship.start_date).toISOString().split('T')[0] : '',
          end_date: championship.end_date ? new Date(championship.end_date).toISOString().split('T')[0] : '',
          image_url: championship.image_url || ''
        })
      }
    } catch (err) {
      setError('Erro ao carregar dados do campeonato')
      console.error('Erro ao carregar campeonato:', err)
    } finally {
      setLoadingData(false)
    }
  }

  useEffect(() => {
    loadChampionshipData()
  }, [championshipId])

  const onSubmit = async (data: ChampionshipFormData) => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // Criar datas locais para evitar problemas de fuso horário
      let startDate: Date | null = null
      let endDate: Date | null = null
      
      if (data.start_date) {
        const [year, month, day] = data.start_date.split('-').map(Number)
        startDate = new Date(year, month - 1, day)
      }
      
      if (data.end_date) {
        const [year, month, day] = data.end_date.split('-').map(Number)
        endDate = new Date(year, month - 1, day)
      }
      
      await updateChampionship(championshipId, {
        name: data.name,
        season: parseInt(data.season),
        status: data.status,
        start_date: startDate || undefined,
        end_date: endDate || undefined,
        image_url: data.image_url || undefined
      })
      
      setSuccess(`Campeonato "${data.name}" atualizado com sucesso!`)
      
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      setError(`Erro ao atualizar campeonato: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  const statusOptions = [
    { value: "active", label: "Ativo" },
    { value: "finished", label: "Finalizado" },
    { value: "cancelled", label: "Cancelado" },
  ]

  if (loadingData) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="text-center">Carregando dados do campeonato...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Editar Campeonato</CardTitle>
        <CardDescription>
          Atualize as informações do campeonato.
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