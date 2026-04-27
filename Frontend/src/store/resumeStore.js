import { create } from "zustand";

const useResumeStore = create((set) => ({
  resumeData: null,

  setResumeData: (data) =>
    set({
      resumeData: data,
    }),

  clearResumeData: () =>
    set({
      resumeData: null,
    }),
}));

export default useResumeStore;