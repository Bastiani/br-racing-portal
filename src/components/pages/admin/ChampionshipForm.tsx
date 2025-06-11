"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { InputField } from '@/components/ui/InputField'
import { DatePickerField } from '@/components/ui/date-picker-field'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createChampionship } from "@/lib/championshipDB";
import { Label } from "@/components/ui/label";

interface ChampionshipFormProps {
  onChampionshipCreated?: (championshipId: number) => void;
}

export default function ChampionshipForm({ onChampionshipCreated }: ChampionshipFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    season: new Date().getFullYear().toString(),
    status: 'active' as 'active' | 'finished' | 'cancelled',
    start_date: '',
    end_date: '',
    image_url: ''
  });

  const handleInputChange = (field: string, value: string) => {
    console.log('=========>>>> ', field, value)
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

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
      let startDate: Date | undefined;
      let endDate: Date | undefined;
      
      if (formData.start_date) {
        const [year, month, day] = formData.start_date.split('-').map(Number);
        startDate = new Date(year, month - 1, day);
      }
      
      if (formData.end_date) {
        const [year, month, day] = formData.end_date.split('-').map(Number);
        endDate = new Date(year, month - 1, day);
      }
      
      const championship = await createChampionship({
        name: formData.name,
        season: parseInt(formData.season),
        status: formData.status,
        start_date: startDate,
        end_date: endDate,
        image_url: formData.image_url || undefined
      });

      setSuccess(`Campeonato "${championship.name}" criado com sucesso!`);
      setFormData({
        name: '',
        season: new Date().getFullYear().toString(),
        status: 'active',
        start_date: '',
        end_date: '',
        image_url: ''
      });
      
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

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Criando...' : 'Criar Campeonato'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}