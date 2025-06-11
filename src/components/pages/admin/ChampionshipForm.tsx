"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createChampionship } from "@/lib/championshipDB";

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
    end_date: ''
  });

  const handleInputChange = (field: string, value: string) => {
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
      const championship = await createChampionship({
        name: formData.name,
        season: parseInt(formData.season),
        status: formData.status,
        start_date: formData.start_date ? new Date(formData.start_date) : undefined,
        end_date: formData.end_date ? new Date(formData.end_date) : undefined
      });

      setSuccess(`Campeonato "${championship.name}" criado com sucesso!`);
      setFormData({
        name: '',
        season: new Date().getFullYear().toString(),
        status: 'active',
        start_date: '',
        end_date: ''
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
            <Label htmlFor="name">Nome do Campeonato *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Ex: Campeonato Brasileiro de Rally 2024"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="season">Temporada *</Label>
              <Input
                id="season"
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
              <Label htmlFor="start_date">Data de Início</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => handleInputChange('start_date', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="end_date">Data de Término</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => handleInputChange('end_date', e.target.value)}
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