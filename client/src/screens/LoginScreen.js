import { useContext, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView, ScrollView, Text, StatusBar, StyleSheet, View, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native'
import Feather from '@expo/vector-icons/Feather'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { SessionContext } from '../context/sessionContext'

import { validateEmail } from '../helpers/validateEmail.js'
import { validatePassword } from '../helpers/validatePassword.js'

export default function LoginScreen () {
  const navigation = useNavigation()
  const { userData, setUserData } = useContext(SessionContext)

  const [hidePassword, setHidePassword] = useState(true)
  const [credentials, setCredentials] = useState({
    email: undefined,
    password: undefined
  })
  const [errors, setErrors] = useState({
    emailError: undefined,
    passwordError: undefined
  })
  const [focus, setFocus] = useState({
    emailFocus: false,
    passwordFocus: false
  })

  function login () {
    let emailError = ''
    let passwordError = ''

    if (!credentials.email) {
      emailError += 'Email is required.'
    } else {
      if (!validateEmail(credentials.email)) {
        emailError += 'Invalid email format.'
      }
    }

    if (!credentials.password) {
      passwordError += 'Password is required.'
    } else {
      if (!(credentials.password.length >= 8 && credentials.password.length <= 15)) {
        passwordError += 'Password should be 8 to 15 characters.'
      } else {
        if (!validatePassword(credentials.password)) {
          passwordError += 'Password should contain at least one special character (@#.%$&), one numeric, one small case and one upper case letter.'
        }
      }
    }

    if (!emailError && !passwordError) {
      const headers = new Headers()
      headers.append('Authorization', `Basic ${btoa(credentials.email + ':' + credentials.password)}`)

      fetch('http://192.168.31.228:8080/api/v1/auth/login', {
        method: 'POST',
        headers
      })
        .then(res => {
          if (res.ok) {
            return res.json()
          }

          throw new Error('Login incorrecto')
        })
        .then(json => {
          const { id, firstName, token } = json.data[0]
          setUserData({
            id,
            firstName,
            token
          })

          return AsyncStorage.setItem('@userData', JSON.stringify({
            id, firstName, token
          }))
        })
        .then(() => {
          console.log('[login]: login exitoso')
        })
        .catch(error => {
          console.log(error)
          Alert.alert('Incorrect login', 'Your password is incorrect', [
            {
              text: 'Ok',
              onPress: () => {
                setHidePassword(true)
                setCredentials({
                  email: undefined,
                  password: undefined
                })
                setErrors({
                  emailError: undefined,
                  passwordError: undefined
                })
                setFocus({
                  emailFocus: false,
                  passwordFocus: false
                })
              }
            }
          ])
        })
    } else {
      setErrors({
        emailError: emailError === '' ? undefined : emailError,
        passwordError: passwordError === '' ? undefined : passwordError
      })
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        <View style={styles.header}>
          <Text style={styles.headerTitle}>smartswitchs</Text>
          <Text style={styles.headerSubtitle}>Lorem ipsum dolor sit amet</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Email</Text>
            <TextInput
              style={[styles.formInput, focus.emailFocus ? styles.formInputOnFocus : undefined]}
              placeholder='example@mail.com'
              autoCapitalize='none'
              keyboardType='email-address'
              value={credentials.email}
              onChangeText={value => (
                setCredentials(previus => (
                  {
                    ...previus,
                    email: value
                  }
                ))
              )}
              onFocus={() => setFocus(previus => (
                {
                  ...previus,
                  emailFocus: true
                }
              ))}
              onBlur={() => {
                setFocus(previus => (
                  {
                    passwordFocus: false,
                    emailFocus: false
                  }
                ))
              }}
            />
            {
            errors.emailError &&
              <Text style={styles.formError}>{errors.emailError}</Text>
          }
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Password</Text>
            <View style={{ position: 'relative' }}>
              <TextInput
                style={[styles.formInput, focus.passwordFocus ? styles.formInputOnFocus : undefined]}
                placeholder='********'
                secureTextEntry={hidePassword}
                autoCapitalize='none'
                maxLength={32}
                value={credentials.password}
                onChangeText={value => (
                  setCredentials(previus => (
                    {
                      ...previus,
                      password: value
                    }
                  ))
                )}
                onFocus={() => {
                  setFocus(previus => (
                    {
                      ...previus,
                      passwordFocus: true
                    }
                  ))
                }}
                onBlur={() => {
                  setFocus(previus => (
                    {
                      emailFocus: false,
                      passwordFocus: false
                    }
                  ))
                }}
              />
              {
                hidePassword
                  ? <View style={styles.eyeContainer}><Feather style={styles.eye} name='eye-off' size={24} color='black' onPress={() => setHidePassword(false)} /></View>
                  : <View style={styles.eyeContainer}><Feather style={styles.eye} name='eye' size={24} color='black' onPress={() => setHidePassword(true)} /></View>
              }
            </View>
            {
            errors.passwordError &&
              <Text style={styles.formError}>{errors.passwordError}</Text>
            }
            <Text style={styles.passwordReset}>Forgot password?</Text>
          </View>

          <View style={styles.formGroup}>
            <TouchableOpacity onPress={() => login()}>
              <Text style={[styles.btn, styles.login]}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account yet? <Text style={styles.footerLink} onPress={() => navigation.navigate('Signup')}>Register</Text></Text>
        </View>

      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    marginTop: StatusBar.currentHeight,
    paddingHorizontal: 16,
    flex: 1,
    backgroundColor: '#FBFDFF'
  },
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  header: {},
  headerImage: {},
  headerTitle: {
    textAlign: 'center',
    color: '#061A6E',
    fontSize: 32,
    textTransform: 'uppercase',
    fontStyle: 'italic',
    fontWeight: '900'
  },
  headerSubtitle: {
    textAlign: 'center',
    fontWeight: 'bold'
  },
  form: {
    gap: 16
  },
  formGroup: {
    gap: 8
  },
  formLabel: {
    color: '#061A6E',
    fontWeight: 'bold'
  },
  formInput: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    backgroundColor: 'rgba(240, 240,240,0.3)'
  },
  formInputOnFocus: {
    borderColor: '#061A6E',
    borderStyle: 'solid',
    borderWidth: 1
  },
  formError: {
    color: '#C70039'
  },
  eyeContainer: {
    position: 'absolute',
    right: 0,
    height: '100%',
    paddingHorizontal: 8,
    justifyContent: 'center'
  },
  eye: {
    color: '#061A6E'
  },
  passwordReset: {
    textAlign: 'right',
    color: '#061A6E',
    fontWeight: 'bold',
    fontStyle: 'italic'
  },
  btn: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
    borderRadius: 4,
    paddingVertical: 8,
    textTransform: 'uppercase'
  },
  login: {
    backgroundColor: '#061A6E'
  },
  footer: {
    marginTop: 32
  },
  footerText: {
    textAlign: 'center'
  },
  footerLink: {
    color: '#061A6E',
    fontWeight: 'bold',
    fontStyle: 'italic'
  }
})
