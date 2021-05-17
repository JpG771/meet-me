export interface UserDetail {
  id?: string;
  preferences: {
    receiveEmail: boolean;
  },
  autosuggest?: {
    
  }
}

export const getDefaultUserDetail = (): UserDetail => ({
  preferences: {
    receiveEmail: false
  } 
})