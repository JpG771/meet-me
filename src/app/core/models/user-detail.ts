export interface UserDetail {
  id?: string;
  userName: string;
  preferences: {
    receiveEmail: boolean;
  },
  autosuggest?: {
    
  }
}

export const getDefaultUserDetail = (userName: string): UserDetail => ({
  userName: userName,
  preferences: {
    receiveEmail: false
  } 
})