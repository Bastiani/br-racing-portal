'use client';

import { useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePickerField } from "@/components/ui/date-picker-field";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createRally, getAllChampionships } from "@/lib/championshipDB";
import { useAdminForms } from '@/contexts/AdminFormsContext';

interface RallyCreateFormProps {
  onRallyCreated?: (rallyId: number) => void;
  preselectedChampionshipId?: number;
}

export default function RallyCreateForm({ onRallyCreated, preselectedChampionshipId }: RallyCreateFormProps) {
  const {
    rallyFormData,
    updateRallyFormData,
    resetRallyForm,
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
  } = useAdminForms();

  const loadChampionships = useCallback(async () => {
    try {
      setIsLoadingChampionships(true);
      const data = await getAllChampionships();
      setChampionships(data);
    } catch (error) {
      setError(`Erro ao carregar campeonatos: ${error}`);
    } finally {
      setIsLoadingChampionships(false);
    }
  }, [setIsLoadingChampionships, setChampionships, setError]);

  useEffect(() => {
    if (preselectedChampionshipId) {
      updateRallyFormData('championship_id', preselectedChampionshipId.toString());
    }
  }, [preselectedChampionshipId]);

  useEffect(() => {
    loadChampionships();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!rallyFormData.championship_id || !rallyFormData.name || !rallyFormData.rally_date || !rallyFormData.rsf_rally) {
      setError('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Criar data local para evitar problemas de fuso horário
      const [year, month, day] = rallyFormData.rally_date.split('-').map(Number);
      const localDate = new Date(year, month - 1, day);
      
      const rally = await createRally({
        championship_id: parseInt(rallyFormData.championship_id),
        name: rallyFormData.name,
        location: rallyFormData.location || undefined,
        rally_date: localDate,
        rsf_rally: rallyFormData.rsf_rally,
        status: rallyFormData.status
      });

      setSuccess(`Rally "${rally.name}" criado com sucesso!`);
      resetRallyForm();
      
      // Atualizar contexto e navegar para próximo passo
      setSelectedRallyId(rally.id);
      setCurrentStep('import');
      
      onRallyCreated?.(rally.id);
    } catch (error) {
      setError(`Erro ao criar rally: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingChampionships) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="text-center">Carregando campeonatos...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Criar Novo Rally</CardTitle>
        <CardDescription>
          Crie um novo rally vinculado a um campeonato existente.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="championship_id">Campeonato *</Label>
            <Select 
              value={rallyFormData.championship_id} 
              onValueChange={(value) => updateRallyFormData('championship_id', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um campeonato" />
              </SelectTrigger>
              <SelectContent>
                {championships.map((championship) => (
                  <SelectItem key={championship.id} value={championship.id.toString()}>
                    {championship.name} ({championship.season})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="name">Nome do Rally *</Label>
            <Input
              id="name"
              value={rallyFormData.name}
              onChange={(e) => updateRallyFormData('name', e.target.value)}
              placeholder="Ex: Rally de Monte Alegre"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location">Localização</Label>
              <Input
                id="location"
                value={rallyFormData.location}
                onChange={(e) => updateRallyFormData('location', e.target.value)}
                placeholder="Ex: Monte Alegre, PA"
              />
            </div>
            <div>
              <DatePickerField
                id="rally_date"
                label="Data do Rally"
                value={rallyFormData.rally_date}
                onChange={(value) => updateRallyFormData('rally_date', value)}
                placeholder="Selecione a data do rally"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="rsf_rally">ID RSF Rally *</Label>
            <div className="flex gap-2">
              <Input
                id="rsf_rally"
                value={rallyFormData.rsf_rally}
                onChange={(e) => updateRallyFormData('rsf_rally', e.target.value)}
                placeholder="ID do rally no RSF"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={rallyFormData.status} onValueChange={(value) => updateRallyFormData('status', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="scheduled">Agendado</SelectItem>
                <SelectItem value="ongoing">Em Andamento</SelectItem>
                <SelectItem value="finished">Finalizado</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Criando...' : 'Criar Rally'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}