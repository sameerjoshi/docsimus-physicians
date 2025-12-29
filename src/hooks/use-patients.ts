import { useQuery } from '@tanstack/react-query';
import { patientsService } from '../services/patients.service';

/**
 * Hook to fetch all patients
 */
export function usePatients() {
    return useQuery({
        queryKey: ['patients'],
        queryFn: () => patientsService.getPatients(),
    });
}

/**
 * Hook to fetch patient statistics
 */
export function usePatientsStats() {
    return useQuery({
        queryKey: ['patients', 'stats'],
        queryFn: () => patientsService.getStats(),
    });
}

/**
 * Hook to fetch appointments for a specific patient
 */
export function usePatientAppointments(patientId: string, enabled = true) {
    return useQuery({
        queryKey: ['patients', patientId, 'appointments'],
        queryFn: () => patientsService.getPatientAppointments(patientId),
        enabled,
    });
}
