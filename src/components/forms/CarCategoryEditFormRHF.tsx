'use client'

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { FormInputField } from '@/components/ui/FormInputField'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Form, FormField } from "@/components/ui/form"
import { updateCarCategory, getCarCategoryById, deleteCarCategory, isCarCategoryInUse } from "@/lib/carCategoryDB"
import { useState, useEffect } from "react"
import { RsfCarCategory } from "@/types/championship"

const carCategorySchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(50, "Nome deve ter no máximo 50 caracteres"),
  description: z.string().optional(),
})

type CarCategoryFormData = z.infer<typeof carCategorySchema>

interface CarCategoryEditFormRHFProps {
  categoryId: number
  onCategoryUpdated?: (category: RsfCarCategory) => void
  onCategoryDeleted?: () => void
}

export default function CarCategoryEditFormRHF({ 
  categoryId, 
  onCategoryUpdated, 
  onCategoryDeleted 
}: CarCategoryEditFormRHFProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [category, setCategory] = useState<RsfCarCategory | null>(null)
  const [canDelete, setCanDelete] = useState(false)

  const form = useForm<CarCategoryFormData>({
    resolver: zodResolver(carCategorySchema),
    defaultValues: {
      name: "",
      description: "",
    },
  })

  useEffect(() => {
    const loadCategory = async () => {
      try {
        const categoryData = await getCarCategoryById(categoryId)
        if (categoryData) {
          setCategory(categoryData)
          form.reset({
            name: categoryData.name,
            description: categoryData.description || "",
          })
          
          // Verifica se a categoria pode ser deletada
          const inUse = await isCarCategoryInUse(categoryId)
          setCanDelete(!inUse)
        }
      } catch (error) {
        setError(`Erro ao carregar categoria: ${error}`)
      }
    }

    loadCategory()
  }, [categoryId, form])

  const onSubmit = async (data: CarCategoryFormData) => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const updatedCategory = await updateCarCategory(categoryId, {
        name: data.name,
        description: data.description || undefined
      })

      setSuccess(`Categoria "${updatedCategory.name}" atualizada com sucesso!`)
      setCategory(updatedCategory)
      
      onCategoryUpdated?.(updatedCategory)
    } catch (error) {
      setError(`Erro ao atualizar categoria: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!canDelete) {
      setError("Esta categoria não pode ser deletada pois está sendo usada por carros ou resultados de rally.")
      return
    }

    if (!confirm(`Tem certeza que deseja deletar a categoria "${category?.name}"?`)) {
      return
    }

    setIsDeleting(true)
    setError(null)
    setSuccess(null)

    try {
      await deleteCarCategory(categoryId)
      setSuccess(`Categoria "${category?.name}" deletada com sucesso!`)
      
      setTimeout(() => {
        onCategoryDeleted?.()
      }, 1500)
    } catch (error) {
      setError(`Erro ao deletar categoria: ${error}`)
    } finally {
      setIsDeleting(false)
    }
  }

  if (!category) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="text-center">Carregando categoria...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Editar Categoria de Carro</CardTitle>
        <CardDescription>
          Edite as informações da categoria &quot;{category.name}&quot;.
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
                {isLoading ? "Salvando..." : "Salvar Alterações"}
              </Button>
              
              <Button 
                type="button" 
                variant="destructive" 
                disabled={isDeleting || !canDelete}
                onClick={handleDelete}
              >
                {isDeleting ? "Deletando..." : "Deletar Categoria"}
              </Button>
            </div>
            
            {!canDelete && (
              <div className="text-sm text-muted-foreground">
                * Esta categoria não pode ser deletada pois está sendo usada.
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}