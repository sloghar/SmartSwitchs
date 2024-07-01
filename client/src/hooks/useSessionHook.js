import { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

export function useSession () {
  const [isLoading, setIsLoading] = useState(true)
  const [userData, setUserData] = useState(false)

  useEffect(() => {
    async function getCredentials () {
      try {
        const credentials = await AsyncStorage.getItem('@userData')
        if (credentials !== null) {
          const userDataBBDD = JSON.parse(credentials)
          // TODO: veerificaar si el token no ha expirado

          setUserData(userDataBBDD)
          setIsLoading(false)
        } else {
          setIsLoading(false)
          setUserData(false)
        }
      } catch (error) {
        setIsLoading(false)
        setUserData(false)
      }
    }

    getCredentials()
  }, [])

  return { isLoading, userData, setUserData }
}
