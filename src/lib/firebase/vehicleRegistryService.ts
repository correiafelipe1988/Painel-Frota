import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  QueryConstraint
} from 'firebase/firestore';
import { db } from './config';
import type { VehicleRegistry } from '@/lib/types';

const COLLECTION_NAME = 'vehicle_registry';

// Subscription para mudanças em tempo real
export const subscribeToVehicleRegistry = (
  callback: (vehicles: VehicleRegistry[]) => void,
  filters?: QueryConstraint[]
) => {
  const vehicleCollection = collection(db, COLLECTION_NAME);
  
  // Construir query com filtros opcionais
  const constraints = [
    orderBy('dataCriacao', 'desc'),
    ...(filters || [])
  ];
  
  const q = query(vehicleCollection, ...constraints);
  
  return onSnapshot(q, (snapshot) => {
    const vehicles: VehicleRegistry[] = [];
    snapshot.forEach((doc) => {
      vehicles.push({ id: doc.id, ...doc.data() } as VehicleRegistry);
    });
    callback(vehicles);
  });
};

// Buscar todos os veículos
export const getAllVehicles = async (): Promise<VehicleRegistry[]> => {
  try {
    const vehicleCollection = collection(db, COLLECTION_NAME);
    const q = query(vehicleCollection, orderBy('dataCriacao', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const vehicles: VehicleRegistry[] = [];
    querySnapshot.forEach((doc) => {
      vehicles.push({ id: doc.id, ...doc.data() } as VehicleRegistry);
    });
    
    return vehicles;
  } catch (error) {
    console.error('Erro ao buscar veículos:', error);
    throw error;
  }
};

// Buscar veículo por ID
export const getVehicleById = async (id: string): Promise<VehicleRegistry | null> => {
  try {
    const vehicleDoc = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(vehicleDoc);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as VehicleRegistry;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Erro ao buscar veículo:', error);
    throw error;
  }
};

// Buscar veículo por placa
export const getVehicleByPlaca = async (placa: string): Promise<VehicleRegistry | null> => {
  try {
    const vehicleCollection = collection(db, COLLECTION_NAME);
    const q = query(vehicleCollection, where('placa', '==', placa));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() } as VehicleRegistry;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Erro ao buscar veículo por placa:', error);
    throw error;
  }
};

// Função para limpar campos undefined
const cleanVehicleData = (data: any) => {
  const cleaned: any = {};
  
  Object.keys(data).forEach(key => {
    const value = data[key];
    if (value !== undefined && value !== null && value !== '') {
      cleaned[key] = value;
    }
  });
  
  return cleaned;
};

// Adicionar novo veículo
export const addVehicle = async (
  vehicle: Omit<VehicleRegistry, 'id' | 'dataCriacao' | 'dataUltimaAtualizacao'>,
  userId: string
): Promise<string> => {
  try {
    const vehicleCollection = collection(db, COLLECTION_NAME);
    
    // Verificar se a placa já existe
    const existingVehicle = await getVehicleByPlaca(vehicle.placa);
    if (existingVehicle) {
      throw new Error('Já existe um veículo com esta placa');
    }
    
    // Limpar dados antes de salvar
    const cleanedVehicle = cleanVehicleData(vehicle);
    
    const vehicleData = {
      ...cleanedVehicle,
      dataCriacao: serverTimestamp(),
      dataUltimaAtualizacao: serverTimestamp(),
      criadoPor: userId,
      atualizadoPor: userId,
    };
    
    const docRef = await addDoc(vehicleCollection, vehicleData);
    return docRef.id;
  } catch (error) {
    console.error('Erro ao adicionar veículo:', error);
    throw error;
  }
};

// Atualizar veículo
export const updateVehicle = async (
  id: string,
  updates: Partial<VehicleRegistry>,
  userId: string
): Promise<void> => {
  try {
    const vehicleDoc = doc(db, COLLECTION_NAME, id);
    
    // Se a placa está sendo atualizada, verificar se já existe
    if (updates.placa) {
      const existingVehicle = await getVehicleByPlaca(updates.placa);
      if (existingVehicle && existingVehicle.id !== id) {
        throw new Error('Já existe um veículo com esta placa');
      }
    }
    
    // Limpar dados antes de atualizar
    const cleanedUpdates = cleanVehicleData(updates);
    
    const updateData = {
      ...cleanedUpdates,
      dataUltimaAtualizacao: serverTimestamp(),
      atualizadoPor: userId,
    };
    
    await updateDoc(vehicleDoc, updateData);
  } catch (error) {
    console.error('Erro ao atualizar veículo:', error);
    throw error;
  }
};

// Deletar veículo
export const deleteVehicle = async (id: string): Promise<void> => {
  try {
    const vehicleDoc = doc(db, COLLECTION_NAME, id);
    await deleteDoc(vehicleDoc);
  } catch (error) {
    console.error('Erro ao deletar veículo:', error);
    throw error;
  }
};

// Buscar veículos por filtros
export const getVehiclesByFilters = async (filters: {
  disponibilidade?: string;
  cidade?: string;
  estado?: string;
  statusPropriedade?: string;
  tipo?: string;
  marca?: string;
}): Promise<VehicleRegistry[]> => {
  try {
    const vehicleCollection = collection(db, COLLECTION_NAME);
    const constraints: QueryConstraint[] = [orderBy('dataCriacao', 'desc')];
    
    // Adicionar filtros dinamicamente
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        constraints.push(where(key, '==', value));
      }
    });
    
    const q = query(vehicleCollection, ...constraints);
    const querySnapshot = await getDocs(q);
    
    const vehicles: VehicleRegistry[] = [];
    querySnapshot.forEach((doc) => {
      vehicles.push({ id: doc.id, ...doc.data() } as VehicleRegistry);
    });
    
    return vehicles;
  } catch (error) {
    console.error('Erro ao buscar veículos com filtros:', error);
    throw error;
  }
};

// Buscar veículos com pendências
export const getVehiclesWithPendencies = async (): Promise<VehicleRegistry[]> => {
  try {
    const vehicleCollection = collection(db, COLLECTION_NAME);
    const q = query(vehicleCollection, orderBy('dataCriacao', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const vehicles: VehicleRegistry[] = [];
    querySnapshot.forEach((doc) => {
      const vehicle = { id: doc.id, ...doc.data() } as VehicleRegistry;
      
      // Verificar se tem pendências
      const hasPendencies = 
        !vehicle.licenciamentoEmDia ||
        vehicle.multasPendentes ||
        vehicle.ipvaEmAberto ||
        !vehicle.seguroAtivo ||
        !vehicle.rastreadorAtivo;
      
      if (hasPendencies) {
        vehicles.push(vehicle);
      }
    });
    
    return vehicles;
  } catch (error) {
    console.error('Erro ao buscar veículos com pendências:', error);
    throw error;
  }
};

// Estatísticas básicas
export const getVehicleStats = async () => {
  try {
    const vehicles = await getAllVehicles();
    
    const stats = {
      total: vehicles.length,
      disponivel: vehicles.filter(v => v.disponibilidade === 'disponivel').length,
      locada: vehicles.filter(v => v.disponibilidade === 'locada').length,
      parada: vehicles.filter(v => v.disponibilidade === 'parada').length,
      sinistro: vehicles.filter(v => v.disponibilidade === 'sinistro').length,
      sucata: vehicles.filter(v => v.disponibilidade === 'sucata').length,
      comPendencias: vehicles.filter(v => 
        !v.licenciamentoEmDia || 
        v.multasPendentes || 
        v.ipvaEmAberto ||
        !v.seguroAtivo
      ).length,
      porTipo: vehicles.reduce((acc, v) => {
        const tipo = v.tipo || 'Não informado';
        acc[tipo] = (acc[tipo] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      porEstado: vehicles.reduce((acc, v) => {
        const estado = v.estado || 'Não informado';
        acc[estado] = (acc[estado] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
    
    return stats;
  } catch (error) {
    console.error('Erro ao calcular estatísticas:', error);
    throw error;
  }
};

// Bulk import de veículos
export const importVehicles = async (
  vehicles: Omit<VehicleRegistry, 'id' | 'dataCriacao' | 'dataUltimaAtualizacao'>[],
  userId: string
): Promise<{ success: number; errors: string[] }> => {
  const results = { success: 0, errors: [] as string[] };
  
  for (const vehicle of vehicles) {
    try {
      await addVehicle(vehicle, userId);
      results.success++;
    } catch (error) {
      results.errors.push(`Erro na placa ${vehicle.placa}: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }
  
  return results;
};