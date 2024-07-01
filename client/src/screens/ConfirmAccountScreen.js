import { SafeAreaView, StatusBar, Text, TouchableOpacity, StyleSheet, View, TextInput } from 'react-native'

export default function ConfirmAccountScreen () {
  return (
    <SafeAreaView style={styles.safeArea}>

      <View style={styles.container}>
        <View style={styles.header}>
          {/* <Image style={styles.headerImage} /> */}
          <Text style={styles.headerTitle}>smartswitchs</Text>
          <Text style={styles.headerSubtitle}>Lorem ipsum dolor sit amet</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.confirmContainer}>
            <Text style={styles.confirmTitle}>Confirm your account!</Text>
            <Text style={styles.confirmText}>We've sent to your email, <Text style={styles.confirmEmail}>example@mail.com</Text>, a six-digit confirmation code. Please, enter it below to confirm your email address</Text>
            <TextInput
              style={styles.confirmInput}
              keyboardType='number-pad'
              maxLength={6}
            />
          </View>

          <TouchableOpacity>
            <Text style={[styles.btn, styles.confirm]}>Confirm</Text>
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
    gap: 54
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
  confirmContainer: {
    gap: 8,
    marginBottom: 40
  },
  confirmTitle: {
    fontSize: 24,
    textAlign: 'center',
    color: '#061A6E',
    fontWeight: 'bold'
  },
  confirmText: {
    fontSize: 16
  },
  confirmEmail: {
    color: '#061A6E',
    fontWeight: 'bold',
    fontStyle: 'italic'
  },
  confirmInput: {
    borderBottomColor: '#061A6E',
    borderBottomStyle: 'solid',
    borderBottomWidth: 1,
    width: '60%',
    alignSelf: 'center',
    textAlign: 'center',
    color: '#061A6E',
    fontSize: 18,
    marginTop: 16
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
  confirm: {
    backgroundColor: '#061A6E'
  }
})
