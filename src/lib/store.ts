
import {create} from 'zustand';

type User = {
    user : {
        id : string,
        name : string,
        email : string,
        image : string,
        collegeId : string,
        address : string,
        room : {
            name : string,
            hostel : {
                name : string,
                id : string
            }
        }
    }
} 



interface UserStore {
  user: User | null
  setUser: (user: User) => void
  clearUser: () => void
}

const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}))

export default useUserStore