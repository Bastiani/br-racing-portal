import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { InputField } from '@/components/ui/InputField'
import { DatePickerField } from '@/components/ui/date-picker-field'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { getRallyById, getAllChampionships } from '@/lib/championshipDB';
import { useAdminForms } from '@/contexts/AdminFormsContext';
import { RsfChampionship } from '@/types/championship';

interface RallyEditFormProps {
  rallyId: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function RallyEditForm({ rallyId, onSuccess, onCancel }: RallyEditFormProps) {
  const {
    setError,
    setSuccess,
    error,
    success
  } = useAdminForms();

  const [formData, setFormData] = useState({
    championship_id: '',
    name: '',
    location: '',
    rally_date: '',
    rsf_rally: '',
    status: 'scheduled' as 'scheduled' | 'ongoing' | 'finished' | 'cancelled'
  });
  const [championships, setChampionships] = useState<RsfChampionship[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [isLoadingChampionships, setIsLoadingChampionships] = useState(false);

  useEffect(() => {
    loadRallyData();
    loadChampionships();
  }, [rallyId]);

  const loadChampionships = async () => {
    try {
      setIsLoadingChampionships(true);
      const data = await getAllChampionships();
      setChampionships(data);
    } catch (err) {
      setError('Erro ao carregar campeonatos');
      console.error('Erro ao carregar campeonatos:', err);
    } finally {
      setIsLoadingChampionships(false);
    }
  };

  const loadRallyData = async () => {
    try {
      setLoadingData(true);
      const rally = await getRallyById(rallyId);
      if (rally) {
        setFormData({
          championship_id: rally.championship_id.toString(),
          name: rally.name,
          location: rally.location || '',
          rally_date: rally.rally_date ? new Date(rally.rally_date).toISOString().split('T')[0] : '',
          rsf_rally: rally.rsf_rally,
          status: rally.status
        });
      }
    } catch (err) {
      setError('Erro ao carregar dados do rally');
      console.error('Erro ao carregar rally:', err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.championship_id || !formData.rally_date || !formData.rsf_rally) {
      setError('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Criar data local para evitar problemas de fuso horário
      let rallyDate: Date;
      const [year, month, day] = formData.rally_date.split('-').map(Number);
      rallyDate = new Date(year, month - 1, day);
      
      // Importar e usar a função updateRally
      const { updateRally } = await import('@/lib/championshipDB');
      
      await updateRally(rallyId, {
        championship_id: parseInt(formData.championship_id),
        name: formData.name,
        location: formData.location || undefined,
        rally_date: rallyDate,
        rsf_rally: formData.rsf_rally,
        status: formData.status
      });
      
      setSuccess(`Rally "${formData.name}" atualizado com sucesso!`);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(`Erro ao atualizar rally: ${err}`);
      console.error('Erro ao atualizar rally:', err);
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
            <div className="text-muted-foreground">Carregando dados do rally...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Editar Rally</CardTitle>
        <CardDescription>
          Edite as informações do rally selecionado.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="championship_id">Campeonato *</Label>
            <Select 
              value={formData.championship_id} 
              onValueChange={(value) => handleInputChange('championship_id', value)}
              disabled={isLoadingChampionships}
            >
              <SelectTrigger>
                <SelectValue placeholder={isLoadingChampionships ? "Carregando..." : "Selecione um campeonato"} />
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
            <InputField
              id="name"
              label="Nome do Rally *"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Ex: Rally de Monte Carlo"
              required
            />
          </div>

          <div>
            <InputField
              id="location"
              label="Localização"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="Ex: Monte Carlo, Mônaco"
            />
          </div>

          <div>
            <InputField
              id="rsf_rally"
              label="RSF Rally UUID *"
              value={formData.rsf_rally}
              onChange={(e) => handleInputChange('rsf_rally', e.target.value)}
              placeholder="Ex: 12345678-1234-1234-1234-123456789012"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <DatePickerField
                id="rally_date"
                label="Data do Rally *"
                value={formData.rally_date}
                onChange={(value) => handleInputChange('rally_date', value)}
                placeholder="Selecione a data do rally"
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
                  <SelectItem value="scheduled">Agendado</SelectItem>
                  <SelectItem value="ongoing">Em Andamento</SelectItem>
                  <SelectItem value="finished">Finalizado</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
                </SelectContent>
              </Select>
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
              {isLoading ? 'Atualizando...' : 'Atualizar Rally'}
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