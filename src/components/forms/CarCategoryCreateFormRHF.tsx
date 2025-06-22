'use client'

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { FormInputField } from '@/components/ui/FormInputField'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Form, FormField } from "@/components/ui/form"
import { createCarCategory } from "@/lib/carCategoryDB"
import { useState } from "react"

const carCategorySchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(50, "Nome deve ter no máximo 50 caracteres"),
  description: z.string().optional(),
})

type CarCategoryFormData = z.infer<typeof carCategorySchema>

interface CarCategoryCreateFormRHFProps {
  onCategoryCreated?: (categoryId: number) => void
}

export default function CarCategoryCreateFormRHF({ onCategoryCreated }: CarCategoryCreateFormRHFProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const form = useForm<CarCategoryFormData>({
    resolver: zodResolver(carCategorySchema),
    defaultValues: {
      name: "",
      description: "",
    },
  })

  const onSubmit = async (data: CarCategoryFormData) => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const category = await createCarCategory({
        name: data.name,
        description: data.description || undefined
      })

      setSuccess(`Categoria "${category.name}" criada com sucesso!`)
      form.reset()
      
      onCategoryCreated?.(category.id)
    } catch (error) {
      setError(`Erro ao criar categoria: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Criar Nova Categoria de Carro</CardTitle>
        <CardDescription>
          Crie uma nova categoria para classificar os carros de rally (ex: RC1, RC2, RGT).
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
                  label="Nome da Categoria *"
                  placeholder="Ex: RC1, RC2, RGT, WRC"
                  {...field}
                />
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormInputField
                  label="Descrição"
                  placeholder="Ex: Carros de Rally Categoria 1"
                  {...field}
                />
              )}
            />

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Criando..." : "Criar Categoria"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}