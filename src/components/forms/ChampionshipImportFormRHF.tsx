import { useEffect, useCallback } from "react"
import { Resolver, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { FormInputField } from '@/components/ui/FormInputField'
import { FormSelectField } from '@/components/ui/FormSelectField'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { getAllChampionships, getRalliesByChampionship } from "@/lib/championshipDB"
import { formatDatabaseDate } from "@/lib/utils"
import { useAdminForms } from '@/contexts/AdminFormsContext'

const importSchema = z.object({
  championshipId: z.string().min(1, "Campeonato é obrigatório"),
  rallyId: z.string().min(1, "Rally é obrigatório"),
  stageName: z.string().min(1, "Nome da especial é obrigatório"),
  stageNumber: z.string().min(1, "Número da especial é obrigatório"),
  file: z.any().refine((file) => file instanceof File, "Arquivo é obrigatório")
    .refine((file) => file?.size <= 10 * 1024 * 1024, "Arquivo muito grande. Tamanho máximo: 10MB")
    .refine(
      (file) => file?.name.toLowerCase().endsWith('.csv') || file?.type === 'text/csv',
      "Por favor, selecione um arquivo CSV válido"
    ),
})

type ImportFormData = z.infer<typeof importSchema>

interface ChampionshipImportFormRHFProps {
  onImportComplete?: () => void
  preselectedChampionshipId?: number
  preselectedRallyId?: number
}

export default function ChampionshipImportFormRHF({ 
  onImportComplete, 
  preselectedChampionshipId, 
  preselectedRallyId 
}: ChampionshipImportFormRHFProps) {
  const {
    championships,
    setChampionships,
    rallies,
    setRallies,
    isLoading,
    setIsLoading,
    isLoadingChampionships,
    setIsLoadingChampionships,
    error,
    setError,
    success,
    setSuccess
  } = useAdminForms()

  const form = useForm<ImportFormData>({
    resolver: zodResolver(importSchema) as Resolver<ImportFormData>,
    defaultValues: {
      championshipId: preselectedChampionshipId?.toString() || "",
      rallyId: preselectedRallyId?.toString() || "",
      stageName: "",
      stageNumber: "",
      file: undefined,
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

  const loadRallies = useCallback(async (championshipId: number) => {
    try {
      const data = await getRalliesByChampionship(championshipId)
      setRallies(data)
    } catch (error) {
      setError(`Erro ao carregar rallies: ${error}`)
    }
  }, [setRallies, setError])

  useEffect(() => {
    loadChampionships()
  }, [])

  useEffect(() => {
    const championshipId = form.watch('championshipId')
    if (championshipId) {
      loadRallies(parseInt(championshipId))
    } else {
      setRallies([])
      form.setValue('rallyId', '')
    }
  }, [form.watch('championshipId')])

  const onSubmit = async (data: ImportFormData) => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const formData = new FormData()
      formData.append('file', data.file)
      formData.append('championshipId', data.championshipId)
      formData.append('rallyId', data.rallyId)
      formData.append('stageName', data.stageName)
      formData.append('stageNumber', data.stageNumber)

      const response = await fetch('/api/import-results', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao importar resultados')
      }

      const result = await response.json()
      setSuccess(`Resultados importados com sucesso! ${result.imported} registros processados.`)
      
      form.reset({
        championshipId: preselectedChampionshipId?.toString() || "",
        rallyId: preselectedRallyId?.toString() || "",
        stageName: "",
        stageNumber: "",
        file: undefined,
      })
      
      onImportComplete?.()
    } catch (error) {
      setError(`Erro ao importar resultados: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  const championshipOptions = championships.map(championship => ({
    value: championship.id.toString(),
    label: `${championship.name} (${championship.season})`
  }))

  const rallyOptions = rallies.map(rally => ({
    value: rally.id.toString(),
    label: `${rally.name} - ${formatDatabaseDate(rally.rally_date)}`
  }))

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Importar Resultados</CardTitle>
        <CardDescription>
          Importe os resultados de uma especial a partir de um arquivo CSV.
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
              name="championshipId"
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
              name="rallyId"
              render={({ field }) => (
                <FormSelectField
                  label="Rally *"
                  placeholder="Selecione um rally"
                  options={rallyOptions}
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={!form.watch('championshipId') || !!preselectedRallyId}
                />
              )}
            />

            <FormField
              control={form.control}
              name="stageName"
              render={({ field }) => (
                <FormInputField
                  label="Nome da Especial *"
                  placeholder="Ex: Especial 1 - Setor Norte"
                  {...field}
                />
              )}
            />

            <FormField
              control={form.control}
              name="stageNumber"
              render={({ field }) => (
                <FormInputField
                  label="Número da Especial *"
                  placeholder="Ex: 1"
                  type="number"
                  {...field}
                />
              )}
            />

            <FormField
              control={form.control}
              name="file"
              render={({ field: { onChange, ...field } }) => {
                return (
                  <FormItem>
                    <FormLabel>Arquivo CSV *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value="" // Reset value to empty string to avoid type error with File object
                        type="file"
                        accept=".csv,text/csv"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          onChange(file)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />

            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium mb-2">Formato do arquivo CSV:</h4>
              <p className="text-sm text-muted-foreground mb-2">
                O arquivo deve conter as seguintes colunas (na ordem):
              </p>
              <code className="text-xs bg-background p-2 rounded block">
                Posição,Número,Piloto,Navegador,Categoria,Tempo,Penalidade
              </code>
              <p className="text-xs text-muted-foreground mt-2">
                Exemplo: 1,101,João Silva,Maria Santos,N4,00:05:30.50,00:00:00
              </p>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={isLoading || isLoadingChampionships}>
                {isLoading ? "Importando..." : "Importar Resultados"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}