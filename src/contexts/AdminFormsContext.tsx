'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { RsfChampionship, RsfRally } from '@/types/championship';

interface AdminFormsState {
  // Championship Form State
  championshipFormData: {
    name: string;
    season: string;
    status: 'active' | 'finished' | 'cancelled';
    start_date: string;
    end_date: string;
    image_url: string;
  };
  
  // Rally Form State
  rallyFormData: {
    championship_id: string;
    name: string;
    location: string;
    rally_date: string;
    rsf_rally: string;
    status: 'scheduled' | 'ongoing' | 'finished' | 'cancelled';
  };
  
  // Import Form State
  importFormData: {
    championshipId: string;
    rallyId: string;
    stageName: string;
    stageNumber: string;
  };
  
  // Shared State
  championships: RsfChampionship[];
  rallies: RsfRally[];
  selectedChampionshipId?: number;
  selectedRallyId?: number;
  currentStep: 'championship' | 'rally' | 'import';
  editingChampionshipId?: number;
  editingRallyId?: number;
  
  // Loading States
  isLoading: boolean;
  isLoadingChampionships: boolean;
  isLoadingRallies: boolean;
  
  // Error and Success States
  error: string | null;
  success: string | null;
}

interface AdminFormsActions {
  // Championship Form Actions
  updateChampionshipFormData: (field: string, value: string) => void;
  resetChampionshipForm: () => void;
  
  // Rally Form Actions
  updateRallyFormData: (field: string, value: string) => void;
  resetRallyForm: () => void;
  
  // Import Form Actions
  updateImportFormData: (field: string, value: string) => void;
  resetImportForm: () => void;
  
  // Shared Actions
  setChampionships: (championships: RsfChampionship[]) => void;
  setRallies: (rallies: RsfRally[]) => void;
  setSelectedChampionshipId: (id?: number) => void;
  setSelectedRallyId: (id?: number) => void;
  setCurrentStep: (step: 'championship' | 'rally' | 'import') => void;
  setEditingChampionshipId: (id?: number) => void;
  setEditingRallyId: (id?: number) => void;
  
  // Loading Actions
  setIsLoading: (loading: boolean) => void;
  setIsLoadingChampionships: (loading: boolean) => void;
  setIsLoadingRallies: (loading: boolean) => void;
  
  // Error and Success Actions
  setError: (error: string | null) => void;
  setSuccess: (success: string | null) => void;
  
  // Flow Actions
  resetFlow: () => void;
  goToImportExisting: () => void;
}

type AdminFormsContextType = AdminFormsState & AdminFormsActions;

const AdminFormsContext = createContext<AdminFormsContextType | undefined>(undefined);

interface AdminFormsProviderProps {
  children: ReactNode;
}

export function AdminFormsProvider({ children }: AdminFormsProviderProps) {
  const [state, setState] = useState<AdminFormsState>({
    championshipFormData: {
      name: '',
      season: new Date().getFullYear().toString(),
      status: 'active',
      start_date: '',
      end_date: '',
      image_url: ''
    },
    rallyFormData: {
      championship_id: '',
      name: '',
      location: '',
      rally_date: '',
      rsf_rally: '',
      status: 'scheduled'
    },
    importFormData: {
      championshipId: '',
      rallyId: '',
      stageName: '',
      stageNumber: '1'
    },
    championships: [],
    rallies: [],
    currentStep: 'championship',
    isLoading: false,
    isLoadingChampionships: false,
    isLoadingRallies: false,
    error: null,
    success: null,
    editingRallyId: undefined
  });

  const updateChampionshipFormData = (field: string, value: string) => {
    setState(prev => ({
      ...prev,
      championshipFormData: {
        ...prev.championshipFormData,
        [field]: value
      }
    }));
  };

  const resetChampionshipForm = () => {
    setState(prev => ({
      ...prev,
      championshipFormData: {
        name: '',
        season: new Date().getFullYear().toString(),
        status: 'active',
        start_date: '',
        end_date: '',
        image_url: ''
      }
    }));
  };

  const updateRallyFormData = (field: string, value: string) => {
    setState(prev => ({
      ...prev,
      rallyFormData: {
        ...prev.rallyFormData,
        [field]: value
      }
    }));
  };

  const resetRallyForm = () => {
    setState(prev => ({
      ...prev,
      rallyFormData: {
        championship_id: prev.selectedChampionshipId?.toString() || '',
        name: '',
        location: '',
        rally_date: '',
        rsf_rally: '',
        status: 'scheduled'
      }
    }));
  };

  const updateImportFormData = (field: string, value: string) => {
    setState(prev => ({
      ...prev,
      importFormData: {
        ...prev.importFormData,
        [field]: value
      }
    }));
  };

  const resetImportForm = () => {
    setState(prev => ({
      ...prev,
      importFormData: {
        championshipId: prev.selectedChampionshipId?.toString() || '',
        rallyId: prev.selectedRallyId?.toString() || '',
        stageName: '',
        stageNumber: '1'
      }
    }));
  };

  const setChampionships = (championships: RsfChampionship[]) => {
    setState(prev => ({ ...prev, championships }));
  };

  const setRallies = (rallies: RsfRally[]) => {
    setState(prev => ({ ...prev, rallies }));
  };

  const setSelectedChampionshipId = (id?: number) => {
    setState(prev => ({ 
      ...prev, 
      selectedChampionshipId: id,
      rallyFormData: {
        ...prev.rallyFormData,
        championship_id: id?.toString() || ''
      },
      importFormData: {
        ...prev.importFormData,
        championshipId: id?.toString() || ''
      }
    }));
  };

  const setSelectedRallyId = (id?: number) => {
    setState(prev => ({ 
      ...prev, 
      selectedRallyId: id,
      importFormData: {
        ...prev.importFormData,
        rallyId: id?.toString() || ''
      }
    }));
  };

  const setCurrentStep = (step: 'championship' | 'rally' | 'import') => {
    setState(prev => ({ ...prev, currentStep: step }));
  };

  const setEditingChampionshipId = (id?: number) => {
    setState(prev => ({ ...prev, editingChampionshipId: id }));
  };

  const setEditingRallyId = (id?: number) => {
    setState(prev => ({ ...prev, editingRallyId: id }));
  };

  const setIsLoading = (loading: boolean) => {
    setState(prev => ({ ...prev, isLoading: loading }));
  };

  const setIsLoadingChampionships = (loading: boolean) => {
    setState(prev => ({ ...prev, isLoadingChampionships: loading }));
  };

  const setIsLoadingRallies = (loading: boolean) => {
    setState(prev => ({ ...prev, isLoadingRallies: loading }));
  };

  const setError = (error: string | null) => {
    setState(prev => ({ ...prev, error }));
  };

  const setSuccess = (success: string | null) => {
    setState(prev => ({ ...prev, success }));
  };

  const resetFlow = () => {
    setState(prev => ({
      ...prev,
      selectedChampionshipId: undefined,
      selectedRallyId: undefined,
      currentStep: 'championship',
      rallyFormData: {
        championship_id: '',
        name: '',
        location: '',
        rally_date: '',
        rsf_rally: '',
        status: 'scheduled'
      },
      importFormData: {
        championshipId: '',
        rallyId: '',
        stageName: '',
        stageNumber: '1'
      }
    }));
  };

  const goToImportExisting = () => {
    setState(prev => ({
      ...prev,
      selectedChampionshipId: undefined,
      selectedRallyId: undefined,
      currentStep: 'import',
      importFormData: {
        championshipId: '',
        rallyId: '',
        stageName: '',
        stageNumber: '1'
      }
    }));
  };

  const contextValue: AdminFormsContextType = {
    ...state,
    updateChampionshipFormData,
    resetChampionshipForm,
    updateRallyFormData,
    resetRallyForm,
    updateImportFormData,
    resetImportForm,
    setChampionships,
    setRallies,
    setSelectedChampionshipId,
    setSelectedRallyId,
    setCurrentStep,
    setEditingChampionshipId,
    setEditingRallyId,
    setIsLoading,
    setIsLoadingChampionships,
    setIsLoadingRallies,
    setError,
    setSuccess,
    resetFlow,
    goToImportExisting
  };

  return (
    <AdminFormsContext.Provider value={contextValue}>
      {children}
    </AdminFormsContext.Provider>
  );
}

export function useAdminForms() {
  const context = useContext(AdminFormsContext);
  if (context === undefined) {
    throw new Error('useAdminForms must be used within an AdminFormsProvider');
  }
  return context;
}