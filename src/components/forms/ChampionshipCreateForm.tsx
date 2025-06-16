'use client';

import { Button } from "@/components/ui/button";
import { InputField } from '@/components/ui/InputField'
import { DatePickerField } from '@/components/ui/date-picker-field'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createChampionship } from "@/lib/championshipDB";
import { Label } from "@/components/ui/label";
import { useAdminForms } from '@/contexts/AdminFormsContext';

interface ChampionshipCreateFormProps {
  onChampionshipCreated?: (championshipId: number) => void;
}

export default function ChampionshipCreateForm({ onChampionshipCreated }: ChampionshipCreateFormProps) {
  const {
    championshipFormData,
    updateChampionshipFormData,
    resetChampionshipForm,
    setSelectedChampionshipId,
    setCurrentStep,
    isLoading,
    setIsLoading,
    error,
    setError,
    success,
    setSuccess
  } = useAdminForms();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!championshipFormData.name || !championshipFormData.season) {
      setError('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Criar datas locais para evitar problemas de fuso horário
      let startDate: Date | undefined;
      let endDate: Date | undefined;
      
      if (championshipFormData.start_date) {
        const [year, month, day] = championshipFormData.start_date.split('-').map(Number);
        startDate = new Date(year, month - 1, day);
      }
      
      if (championshipFormData.end_date) {
        const [year, month, day] = championshipFormData.end_date.split('-').map(Number);
        endDate = new Date(year, month - 1, day);
      }
      
      const championship = await createChampionship({
        name: championshipFormData.name,
        season: parseInt(championshipFormData.season),
        status: championshipFormData.status,
        start_date: startDate,
        end_date: endDate,
        image_url: championshipFormData.image_url || undefined
      });

      setSuccess(`Campeonato "${championship.name}" criado com sucesso!`);
      resetChampionshipForm();
      
      // Atualizar contexto e navegar para próximo passo
      setSelectedChampionshipId(championship.id);
      setCurrentStep('rally');
      
      onChampionshipCreated?.(championship.id);
    } catch (error) {
      setError(`Erro ao criar campeonato: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Criar Novo Campeonato</CardTitle>
        <CardDescription>
          Crie um novo campeonato para organizar os rallies e calcular pontuações.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <InputField
              id="name"
              label="Nome do Campeonato *"
              value={championshipFormData.name}
              onChange={(e) => updateChampionshipFormData('name', e.target.value)}
              placeholder="Ex: Campeonato Brasileiro de Rally 2024"
              required
            />
          </div>

          <div>
            <InputField
              id="image_url"
              label="URL da Imagem"
              value={championshipFormData.image_url}
              onChange={(e) => updateChampionshipFormData('image_url', e.target.value)}
              placeholder="https://exemplo.com/imagem.jpg"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <InputField
                id="season"
                label="Temporada *"
                type="number"
                value={championshipFormData.season}
                onChange={(e) => updateChampionshipFormData('season', e.target.value)}
                placeholder="2024"
                required
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={championshipFormData.status} onValueChange={(value) => updateChampionshipFormData('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="finished">Finalizado</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <DatePickerField
                id="start_date"
                label="Data de Início"
                value={championshipFormData.start_date}
                onChange={(value) => updateChampionshipFormData('start_date', value)}
                placeholder="Selecione a data de início"
              />
            </div>
            <div>
              <DatePickerField
                id="end_date"
                label="Data de Término"
                value={championshipFormData.end_date}
                onChange={(value) => updateChampionshipFormData('end_date', value)}
                placeholder="Selecione a data de término"
              />
            </div>
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
            {isLoading ? 'Criando...' : 'Criar Campeonato'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}