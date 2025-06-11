"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getAllChampionships, getRalliesByChampionship } from "@/lib/championshipDB";
import { formatDatabaseDate } from "@/lib/utils";
import { RsfChampionship, RsfRally } from "@/types/championship";

interface ChampionshipImportProps {
  onImportComplete?: () => void;
  preselectedChampionshipId?: number;
  preselectedRallyId?: number;
}

export default function ChampionshipImport({ 
  onImportComplete, 
  preselectedChampionshipId, 
  preselectedRallyId 
}: ChampionshipImportProps) {
  const [championships, setChampionships] = useState<RsfChampionship[]>([]);
  const [rallies, setRallies] = useState<RsfRally[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    championshipId: preselectedChampionshipId?.toString() || '',
    rallyId: preselectedRallyId?.toString() || '',
    stageName: '',
    stageNumber: '1'
  });

  useEffect(() => {
    loadChampionships();
  }, []);

  useEffect(() => {
    if (formData.championshipId) {
      loadRallies(parseInt(formData.championshipId));
    } else {
      setRallies([]);
      setFormData(prev => ({ ...prev, rallyId: '' }));
    }
  }, [formData.championshipId]);

  const loadChampionships = async () => {
    try {
      const data = await getAllChampionships();
      setChampionships(data);
    } catch (error) {
      setError(`Erro ao carregar campeonatos: ${error}`);
    } finally {
      setIsLoadingData(false);
    }
  };

  const loadRallies = async (championshipId: number) => {
    try {
      const data = await getRalliesByChampionship(championshipId);
      setRallies(data);
    } catch (error) {
      setError(`Erro ao carregar rallies: ${error}`);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Verificar se é um arquivo CSV
      if (!selectedFile.name.toLowerCase().endsWith('.csv') && selectedFile.type !== 'text/csv') {
        setError('Por favor, selecione um arquivo CSV válido.');
        return;
      }
      
      // Verificar tamanho do arquivo (máximo 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('Arquivo muito grande. Tamanho máximo: 10MB.');
        return;
      }
      
      // Ler e validar cabeçalhos do CSV
      const reader = new FileReader();
      reader.onload = (event) => {
        const csvText = event.target?.result as string;
        const lines = csvText.split('\n');
        if (lines.length < 2) {
          setError('Arquivo CSV deve conter pelo menos um cabeçalho e uma linha de dados.');
          return;
        }
        
        // Usar ponto e vírgula como delimitador
        const headers = lines[0].toLowerCase().split(';').map(h => h.trim().replace(/"/g, ''));
        const requiredColumns = ['userid', 'user_name', 'position', 'time3'];
        const alternativeColumns = {
          'userid': ['userid', 'user_id', 'id'],
          'user_name': ['user_name', 'username', 'name'],
          'position': ['position', 'pos'],
          'time3': ['time3', 'time', 'lap_time']
        };
        console.log('========>>>> ', headers)
        
        const missingColumns = [];
        for (const required of requiredColumns) {
          const alternatives = alternativeColumns[required as keyof typeof alternativeColumns];
          const found = alternatives.some(alt => headers.includes(alt));
          if (!found) {
            missingColumns.push(required);
          }
        }
        
        if (missingColumns.length > 0) {
          setError(`Colunas obrigatórias não encontradas: ${missingColumns.join(', ')}. Verifique se o CSV contém as colunas necessárias.`);
          return;
        }
        
        setFile(selectedFile);
        setError('');
      };
      
      reader.onerror = () => {
        setError('Erro ao ler o arquivo CSV.');
      };
      
      reader.readAsText(selectedFile);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setError('Por favor, selecione um arquivo CSV');
      return;
    }

    if (!formData.championshipId || !formData.rallyId || !formData.stageName) {
      setError('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('file', file);
      formDataToSend.append('championshipId', formData.championshipId);
      formDataToSend.append('rallyId', formData.rallyId);
      formDataToSend.append('stageName', formData.stageName);
      formDataToSend.append('stageNumber', formData.stageNumber);

      const response = await fetch('/api/championship/import-csv', {
        method: 'POST',
        body: formDataToSend
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess(result.message);
        setFile(null);
        setFormData(prev => ({
          ...prev,
          stageName: '',
          stageNumber: '1'
        }));
        onImportComplete?.();
      } else {
        setError(result.error || 'Erro ao importar CSV');
      }
    } catch {
      setError('Erro ao processar arquivo. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="text-center">Carregando dados...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Importar Resultados de Etapa</CardTitle>
        <CardDescription>
          Faça upload de um arquivo CSV com os resultados da etapa para calcular automaticamente os pontos do campeonato.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="championshipId">Campeonato *</Label>
              <Select 
                value={formData.championshipId} 
                onValueChange={(value) => handleInputChange('championshipId', value)}
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
              <Label htmlFor="rallyId">Rally *</Label>
              <Select 
                value={formData.rallyId} 
                onValueChange={(value) => handleInputChange('rallyId', value)}
                disabled={!formData.championshipId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um rally" />
                </SelectTrigger>
                <SelectContent>
                  {rallies.map((rally) => (
                    <SelectItem key={rally.id} value={rally.id.toString()}>
                      {rally.name} - {formatDatabaseDate(rally.rally_date)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="stageName">Nome da Etapa *</Label>
              <Input
                id="stageName"
                value={formData.stageName}
                onChange={(e) => handleInputChange('stageName', e.target.value)}
                placeholder="Ex: SS1 - Monte Alegre"
                required
              />
            </div>
            <div>
              <Label htmlFor="stageNumber">Número da Etapa</Label>
              <Input
                id="stageNumber"
                type="number"
                value={formData.stageNumber}
                onChange={(e) => handleInputChange('stageNumber', e.target.value)}
                placeholder="1"
                min="1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="csvFile">Arquivo CSV *</Label>
            <Input
              id="csvFile"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              O CSV deve conter as colunas: position, userid, username, real_name, nationality, car, time, penalty
            </p>
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

          <Button type="submit" disabled={isLoading || !file} className="w-full">
            {isLoading ? 'Processando...' : 'Importar e Calcular Pontos'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}