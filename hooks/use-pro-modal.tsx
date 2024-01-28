
import { create } from "zustand"

// interface for the modal store
interface useProModalStore{
     // State to track if the modal is open and functions to open and close the modal
    isOpen: boolean
    onOpen: () => void
    onClose: () => void
}

// The zustand store for the modal where you have the initial state, and functions to  open or close the modal
export const useProModal = create<useProModalStore>((set) => ({
    isOpen: false,
    onOpen: () => set({isOpen: true}),
    onClose: () => set({isOpen: false})
}))