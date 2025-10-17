import { create } from 'zustand';
import { JobPosting } from '@/services/postingService';

interface PostingState {
  currentPosting: JobPosting | null;
  setCurrentPosting: (posting: JobPosting | null) => void;
  updateCurrentPosting: (data: Partial<JobPosting>) => void;
  clearCurrentPosting: () => void;
}

export const usePostingStore = create<PostingState>((set) => ({
  currentPosting: null,

  setCurrentPosting: (posting) => set({ currentPosting: posting }),

  updateCurrentPosting: (data) =>
    set((state) => ({
      currentPosting: state.currentPosting
        ? { ...state.currentPosting, ...data }
        : null,
    })),

  clearCurrentPosting: () => set({ currentPosting: null }),
}));
