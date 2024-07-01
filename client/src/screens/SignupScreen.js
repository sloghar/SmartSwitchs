import { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView, StyleSheet, View, Text, TextInput, TouchableOpacity, StatusBar, ScrollView, Alert } from 'react-native'
import Feather from '@expo/vector-icons/Feather'

import { validateEmail } from './../helpers/validateEmail.js'
import { validatePassword } from './../helpers/validatePassword.js'

export default function SignupScreen () {
  const navigation = useNavigation()

  const [credentials, setCredentials] = useState({
    email: undefined,
    password: undefined,
    confirmPassword: undefined,
    firstName: undefined,
    lastName: undefined
  })
  const [errors, setErrors] = useState({
    emailError: undefined,
    passwordError: undefined,
    confirmPasswordError: undefined,
    firstNameError: undefined,
    lastNameError: undefined
  })
  const [focus, setFocus] = useState({
    emailFocus: false,
    passwordFocus: false,
    confirmPasswordFocus: false,
    firstNameFocus: false,
    lastNameFocus: false
  })
  const [eye, setEye] = useState({
    password: false,
    confirmPassword: false
  })

  function signup () {
    let firstNameError = ''
    let lastNameError = ''
    let emailError = ''
    let passwordError = ''
    let confirmPasswordError = ''

    if (!credentials.firstName) {
      firstNameError += 'Firstnameis required.'
    } else {
      if (!(credentials.firstName.length >= 3 && credentials.firstName.length <= 20)) {
        firstNameError += 'First name length must be between 3 and 20 character.'
      }
    }

    if (!credentials.lastName) {
      lastNameError += 'Last name is required.'
    } else {
      if (!(credentials.lastName.length >= 3 && credentials.lastName.length <= 20)) {
        lastNameError += 'Las name length must be between 3 and 20 character.'
      }
    }

    if (!credentials.email) {
      emailError += 'Email is required'
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
        } else {
          if (credentials.password !== credentials.confirmPassword) {
            confirmPasswordError += 'Password confirmation do not match'
          }
        }
      }
    }

    if (!firstNameError && !lastNameError && !passwordError && !confirmPasswordError) {
      fetch('http://192.168.31.228:8080/api/v1/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstName: credentials.firstName,
          lastName: credentials.lastName,
          email: credentials.email,
          password: credentials.password
        })
      })
        .then(res => {
          if (res.ok) {
            return res.json()
          }

          throw new Error('Error al hacer la peticion')
        })
        .then(json => {
          Alert.alert('Success', 'User created succesfully', [
            {
              text: 'Ok',
              onPress: () => {
                navigation.navigate('Login')
              }
            }
          ])
        })
        .catch(error => {
          console.log(error)
          Alert.alert('Incorrect signup', 'Please try again', [
            {
              text: 'Ok',
              onPress: () => {
                setCredentials({
                  email: undefined,
                  password: undefined,
                  confirmPassword: undefined,
                  firstName: undefined,
                  lastName: undefined
                })
                setErrors({
                  emailError: undefined,
                  passwordError: undefined,
                  confirmPasswordError: undefined,
                  firstNameError: undefined,
                  lastNameError: undefined
                })
                setFocus({
                  emailFocus: false,
                  passwordFocus: false,
                  confirmPasswordFocus: false,
                  firstNameFocus: false,
                  lastNameFocus: false
                })
                setEye({
                  password: false,
                  confirmPassword: false
                })
              }
            }
          ])
        })
    } else {
      setErrors({
        firstNameError: firstNameError === '' ? undefined : firstNameError,
        lastNameError: lastNameError === '' ? undefined : lastNameError,
        emailError: emailError === '' ? undefined : emailError,
        passwordError: passwordError === '' ? undefined : passwordError,
        confirmPasswordError: confirmPasswordError === '' ? undefined : confirmPasswordError
      })
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>

        <View style={styles.header}>
          {/* <Image style={styles.headerImage} /> */}
          <Text style={styles.headerTitle}>smartswitchs</Text>
          <Text style={styles.headerSubtitle}>Lorem ipsum dolor sit amet</Text>
        </View>

        <View style={styles.form}>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Fist Name</Text>
            <TextInput
              style={[styles.formInput, focus.firstNameFocus ? styles.formInputOnFocus : undefined]}
              placeholder='John'
              onChangeText={value => (
                setCredentials(previus => (
                  {
                    ...previus,
                    firstName: value
                  }
                ))
              )}
              onFocus={() => setFocus(previus => (
                {
                  ...previus,
                  firstNameFocus: true
                }
              ))}
              onBlur={() => {
                setFocus(previus => (
                  {
                    ...previus,
                    firstNameFocus: false
                  }
                ))
              }}
            />
            {
            errors.firstNameError &&
              <Text style={styles.formError}>{errors.firstNameError}</Text>
          }
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Last Name</Text>
            <TextInput
              style={[styles.formInput, focus.lastNameFocus ? styles.formInputOnFocus : undefined]}
              placeholder='Doe'
              onChangeText={value => (
                setCredentials(previus => (
                  {
                    ...previus,
                    lastName: value
                  }
                ))
              )}
              onFocus={() => setFocus(previus => (
                {
                  ...previus,
                  lastNameFocus: true
                }
              ))}
              onBlur={() => {
                setFocus(previus => (
                  {
                    ...previus,
                    lastNameFocus: false
                  }
                ))
              }}
            />
            {
            errors.lastNameError &&
              <Text style={styles.formError}>{errors.lastNameError}</Text>
          }
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Email</Text>
            <TextInput
              style={[styles.formInput, focus.emailFocus ? styles.formInputOnFocus : undefined]}
              placeholder='example@mail.com'
              autoCapitalize='none'
              keyboardType='email-address'
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
                secureTextEntry={!eye.password}
                autoCapitalize='none'
                maxLength={32}
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
                eye.password
                  ? <View style={styles.eyeContainer}>
                    <Feather
                      style={styles.eye} name='eye' size={24} color='black' onPress={() => {
                        setEye(previus => (
                          {
                            ...previus,
                            password: !previus.password
                          }
                        ))
                      }}
                    />
                    </View>
                  : <View style={styles.eyeContainer}>
                    <Feather
                      style={styles.eye} name='eye-off' size={24} color='black' onPress={() => {
                        setEye(previus => (
                          {
                            ...previus,
                            password: !previus.password
                          }
                        ))
                      }}
                    />
                    </View>
              }
            </View>
            {
            errors.passwordError &&
              <Text style={styles.formError}>{errors.passwordError}</Text>
            }
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Confirm Password</Text>
            <View style={{ position: 'relative' }}>
              <TextInput
                style={[styles.formInput, focus.confirmPasswordFocus ? styles.formInputOnFocus : undefined]}
                placeholder='********'
                secureTextEntry={!eye.confirmPassword}
                autoCapitalize='none'
                maxLength={32}
                onChangeText={value => (
                  setCredentials(previus => (
                    {
                      ...previus,
                      confirmPassword: value
                    }
                  ))
                )}
                onFocus={() => {
                  setFocus(previus => (
                    {
                      ...previus,
                      confirmPasswordFocus: true
                    }
                  ))
                }}
                onBlur={() => {
                  setFocus(previus => (
                    {
                      emailFocus: false,
                      confirmPasswordFocus: false
                    }
                  ))
                }}
              />
              {
                eye.confirmPassword
                  ? <View style={styles.eyeContainer}>
                    <Feather
                      style={styles.eye} name='eye' size={24} color='black' onPress={() => {
                        setEye(previus => (
                          {
                            ...previus,
                            confirmPassword: !previus.confirmPassword
                          }
                        ))
                      }}
                    />
                    </View>
                  : <View style={styles.eyeContainer}>
                    <Feather
                      style={styles.eye} name='eye-off' size={24} color='black' onPress={() => {
                        setEye(previus => (
                          {
                            ...previus,
                            confirmPassword: !previus.confirmPassword
                          }
                        ))
                      }}
                    />
                    </View>
              }
            </View>
            {
            errors.confirmPasswordError &&
              <Text style={styles.formError}>{errors.confirmPasswordError}</Text>
            }
          </View>

          <View style={styles.formGroup}>
            <TouchableOpacity onPress={() => signup()}>
              <Text style={[styles.btn, styles.signup]}>Signup</Text>
            </TouchableOpacity>
          </View>

        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Alredy have an account? <Text style={styles.footerLink} onPress={() => navigation.navigate('Login')}>Login</Text></Text>
        </View>

      </ScrollView>
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
    flex: 1
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
  btn: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
    borderRadius: 4,
    paddingVertical: 8,
    textTransform: 'uppercase'
  },
  signup: {
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
