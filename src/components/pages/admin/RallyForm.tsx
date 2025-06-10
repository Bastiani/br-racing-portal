"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createRally, getAllChampionships } from "@/lib/championshipDB";
import { RsfChampionship } from "@/types/championship";

interface RallyFormProps {
  onRallyCreated?: (rallyId: number) => void;
  preselectedChampionshipId?: number;
}

export default function RallyForm({ onRallyCreated, preselectedChampionshipId }: RallyFormProps) {
  const [championships, setChampionships] = useState<RsfChampionship[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingChampionships, setIsLoadingChampionships] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    championship_id: preselectedChampionshipId?.toString() || '',
    name: '',
    location: '',
    rally_date: '',
    rsf_rally: '',
    status: 'scheduled' as 'scheduled' | 'ongoing' | 'finished' | 'cancelled'
  });

  useEffect(() => {
    loadChampionships();
  }, []);

  useEffect(() => {
    if (preselectedChampionshipId) {
      setFormData(prev => ({
        ...prev,
        championship_id: preselectedChampionshipId.toString()
      }));
    }
  }, [preselectedChampionshipId]);

  const loadChampionships = async () => {
    try {
      const data = await getAllChampionships();
      setChampionships(data);
    } catch (error) {
      setError(`Erro ao carregar campeonatos: ${error}`);
    } finally {
      setIsLoadingChampionships(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateRsfRallyId = () => {
    const uuid = crypto.randomUUID();
    setFormData(prev => ({
      ...prev,
      rsf_rally: uuid
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.championship_id || !formData.name || !formData.rally_date || !formData.rsf_rally) {
      setError('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const rally = await createRally({
        championship_id: parseInt(formData.championship_id),
        name: formData.name,
        location: formData.location || undefined,
        rally_date: formData.rally_date,
        rsf_rally: formData.rsf_rally,
        status: formData.status
      });

      setSuccess(`Rally "${rally.name}" criado com sucesso!`);
      setFormData({
        championship_id: preselectedChampionshipId?.toString() || '',
        name: '',
        location: '',
        rally_date: '',
        rsf_rally: '',
        status: 'scheduled'
      });
      
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
              value={formData.championship_id} 
              onValueChange={(value) => handleInputChange('championship_id', value)}
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
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Ex: Rally de Monte Alegre"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location">Localização</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="Ex: Monte Alegre, PA"
              />
            </div>
            <div>
              <Label htmlFor="rally_date">Data do Rally *</Label>
              <Input
                id="rally_date"
                type="date"
                value={formData.rally_date}
                onChange={(e) => handleInputChange('rally_date', e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="rsf_rally">ID RSF Rally *</Label>
            <div className="flex gap-2">
              <Input
                id="rsf_rally"
                value={formData.rsf_rally}
                onChange={(e) => handleInputChange('rsf_rally', e.target.value)}
                placeholder="UUID do rally no RSF"
                required
              />
              <Button type="button" onClick={generateRsfRallyId} variant="outline">
                Gerar UUID
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
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
