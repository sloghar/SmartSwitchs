import { ActivityIndicator } from 'react-native'

import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import InitScreen from './src/screens/InitScreen'
import LoginScreen from './src/screens/LoginScreen'
import SignupScreen from './src/screens/SignupScreen'
import ConfirmAccountScreen from './src/screens/ConfirmAccountScreen'
import DashboardScreen from './src/screens/DashboardScreen'

import { SessionContext } from './src/context/sessionContext'

import { useSession } from './src/hooks/useSessionHook.js'

const Stack = createNativeStackNavigator()

export default function SmartSwitch () {
  const { isLoading, userData, setUserData } = useSession()

  if (isLoading) {
    return (
      <ActivityIndicator style={{ flex: 1 }} size='large' />
    )
  }
  return (
    <SessionContext.Provider value={{
      userData,
      setUserData
    }}
    >
      <NavigationContainer>

        <Stack.Navigator initialRouteName='Init' screenOptions={{ headerShown: false }}>
          {
            userData
              ? <Stack.Screen name='Dashboard' component={DashboardScreen} />
              : <>
                <Stack.Screen name='Init' component={InitScreen} />
                <Stack.Screen name='Login' component={LoginScreen} />
                <Stack.Screen name='Signup' component={SignupScreen} />
                <Stack.Screen name='Confirm' component={ConfirmAccountScreen} />
                </>
          }
        </Stack.Navigator>

      </NavigationContainer>
    </SessionContext.Provider>
  )
}
