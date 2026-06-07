import { create } from 'zustand';

interface Service {
  id: string;
  name: string;
  duration_minutes: number;
  price: number;
  requires_deposit: boolean;
  deposit_amount: number;
}

interface Staff {
  id: string;
  first_name: string;
  last_name: string;
}

interface BookingState {
  service: Service | null;
  staff: Staff | null; // null means 'Any Available'
  date: string | null; // YYYY-MM-DD
  timeSlot: string | null; // HH:mm
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  formAnswers: Record<string, any>;
  
  // Actions
  setService: (service: Service | null) => void;
  setStaff: (staff: Staff | null) => void;
  setDate: (date: string | null) => void;
  setTimeSlot: (time: string | null) => void;
  setCustomer: (field: string, value: string) => void;
  setFormAnswers: (answers: Record<string, any>) => void;
  reset: () => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  service: null,
  staff: null,
  date: null,
  timeSlot: null,
  customer: {
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  },
  formAnswers: {},

  setService: (service) => set({ service, staff: null, date: null, timeSlot: null }), // Reset dependent fields
  setStaff: (staff) => set({ staff, date: null, timeSlot: null }),
  setDate: (date) => set({ date, timeSlot: null }),
  setTimeSlot: (timeSlot) => set({ timeSlot }),
  setCustomer: (field, value) => set((state) => ({ customer: { ...state.customer, [field]: value } })),
  setFormAnswers: (formAnswers) => set({ formAnswers }),
  reset: () => set({
    service: null, staff: null, date: null, timeSlot: null,
    customer: { firstName: '', lastName: '', email: '', phone: '' },
    formAnswers: {}
  })
}));
