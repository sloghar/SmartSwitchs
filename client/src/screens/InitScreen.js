import { useNavigation } from '@react-navigation/native'
import { useContext, useEffect } from 'react'
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native'
import { SessionContext } from '../context/sessionContext'

export default function InitScreen () {
  const navigation = useNavigation()

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          {/* <Image style={styles.headerImage} /> */}
          <Text style={styles.headerTitle}>smartswitchs</Text>
          <Text style={styles.headerSubtitle}>Lorem ipsum dolor sit amet</Text>
        </View>
        <View style={styles.buttons}>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={[styles.btn, styles.login]}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={[styles.btn, styles.signup]}>Signup</Text>
          </TouchableOpacity>
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
    justifyContent: 'center',
    gap: 32
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
  buttons: {
    gap: 12
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
  signup: {
    backgroundColor: 'rgba(230,230,230, 0.8)',
    color: '#061A6E'
  }
})
