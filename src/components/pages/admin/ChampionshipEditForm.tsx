'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { InputField } from '@/components/ui/InputField'
import { DatePickerField } from '@/components/ui/date-picker-field'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { updateChampionship, getChampionshipById } from '@/lib/championshipDB';

interface ChampionshipEditFormProps {
  championshipId: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function ChampionshipEditForm({ championshipId, onSuccess, onCancel }: ChampionshipEditFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    season: '',
    status: 'active' as 'active' | 'finished' | 'cancelled',
    start_date: '',
    end_date: '',
    image_url: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadChampionshipData = async () => {
    try {
      setLoadingData(true);
      const championship = await getChampionshipById(championshipId);
      if (championship) {
        setFormData({
          name: championship.name,
          season: championship.season.toString(),
          status: championship.status,
          start_date: championship.start_date ? new Date(championship.start_date).toISOString().split('T')[0] : '',
          end_date: championship.end_date ? new Date(championship.end_date).toISOString().split('T')[0] : '',
          image_url: championship.image_url || ''
        });
      }
    } catch (err) {
      setError('Erro ao carregar dados do campeonato');
      console.error('Erro ao carregar campeonato:', err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    loadChampionshipData();
  }, [championshipId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.season) {
      setError('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Criar datas locais para evitar problemas de fuso horário
      let startDate: Date | null = null;
      let endDate: Date | null = null;
      
      if (formData.start_date) {
        const [year, month, day] = formData.start_date.split('-').map(Number);
        startDate = new Date(year, month - 1, day);
      }
      
      if (formData.end_date) {
        const [year, month, day] = formData.end_date.split('-').map(Number);
        endDate = new Date(year, month - 1, day);
      }
      
      await updateChampionship(championshipId, {
        name: formData.name,
        season: parseInt(formData.season),
        status: formData.status,
        start_date: startDate || undefined,
        end_date: endDate || undefined,
        image_url: formData.image_url || undefined
      });
      
      setSuccess(`Campeonato "${formData.name}" atualizado com sucesso!`);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(`Erro ao atualizar campeonato: ${err}`);
      console.error('Erro ao atualizar campeonato:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loadingData) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground">Carregando dados do campeonato...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Editar Campeonato</CardTitle>
        <CardDescription>
          Edite as informações do campeonato selecionado.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <InputField
              id="name"
              label="Nome do Campeonato *"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Ex: Campeonato Brasileiro de Rally 2024"
              required
            />
          </div>

          <div>
            <InputField
              id="image_url"
              label="URL da Imagem"
              value={formData.image_url}
              onChange={(e) => handleInputChange('image_url', e.target.value)}
              placeholder="https://exemplo.com/imagem.jpg"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <InputField
                id="season"
                label="Temporada *"
                type="number"
                value={formData.season}
                onChange={(e) => handleInputChange('season', e.target.value)}
                placeholder="2024"
                required
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
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
                value={formData.start_date}
                onChange={(value) => handleInputChange('start_date', value)}
                placeholder="Selecione a data de início"
              />
            </div>
            <div>
              <DatePickerField
                id="end_date"
                label="Data de Término"
                value={formData.end_date}
                onChange={(value) => handleInputChange('end_date', value)}
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

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? 'Atualizando...' : 'Atualizar Campeonato'}
            </Button>
            
            {onCancel && (
              <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}