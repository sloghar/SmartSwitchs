import { useContext, useEffect, useState } from 'react'
import { SafeAreaView, View, Text, TouchableOpacity, ActivityIndicator, StatusBar, StyleSheet, FlatList, Switch, Alert } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { SessionContext } from '../context/sessionContext'
import Entypo from '@expo/vector-icons/Entypo'

/* const data = [
  {
    id: 1,
    mode: 1,
    state: true,
    lastCommunication: new Date().toISOString(),
    alias: 'Bathroom'
  },
  {
    id: 2,
    mode: 2,
    state: true,
    lastCommunication: new Date().toISOString(),
    schedules: [
      {
        days: 8,
        startAt: 3600,
        endAt: 8000
      },
      {
        days: 8,
        startAt: 3600,
        endAt: 8000
      },
      {
        days: 8,
        startAt: 3600,
        endAt: 8000
      },
      {
        days: 8,
        startAt: 3600,
        endAt: 8000
      }
    ],
    alias: 'Bathroom'
  },
  {
    id: 3,
    mode: 1,
    state: true,
    lastCommunication: new Date().toISOString(),
    alias: 'Bathroom'
  },
  {
    id: 4,
    mode: 1,
    state: true,
    lastCommunication: new Date().toISOString(),
    alias: 'Bathroom'
  },
  {
    id: 5,
    mode: 2,
    state: true,
    lastCommunication: new Date().toISOString(),
    schedules: [
      {
        days: 8,
        startAt: 3600,
        endAt: 8000
      },
      {
        days: 8,
        startAt: 3600,
        endAt: 8000
      },
      {
        days: 8,
        startAt: 3600,
        endAt: 8000
      },
      {
        days: 8,
        startAt: 3600,
        endAt: 8000
      }
    ],
    alias: 'Bathroom'
  }
] */

function ModeSwitchs ({ id, alias, lastCommunication, state }) {
  const { userData, setUserData } = useContext(SessionContext)
  const [onOff, setOnOff] = useState(state)
  const [displayOptions, setDisplayOptions] = useState(false)

  function changeState () {
    fetch(`http://192.168.31.228:8080/api/v1/user/${userData.id}/switchs/${id}/state/${onOff ? 0 : 1}`, {
      method: 'POST'
    })
      .then(res => {
        if (res.ok) {
          return res.json()
        }
        throw new Error('Error de la petición')
      })
      .then(json => {
        const data = json.data[0]
        setOnOff(data.state)
      })
      .catch(error => {
        console.error(error)
        setOnOff(previus => !previus)
      })
  }

  function changeMode () {
    fetch(`http://192.168.31.228:8080/api/v1/user/${userData.id}/switchs/${id}/mode/2`, { method: 'POST' })
      .then(res => {
        if (res.ok) {
          return res.json()
        }
        throw new Error('error en la petición')
      })
      .then(json => {

      })
      .catch(error => {
        console.log(error)
      })
  }

  function deleteSwitch () {
    fetch(`http://192.168.31.228:8080/api/v1/user/${userData.id}/switchs/${id}`, { method: 'DELETE' })
      .then(res => {
        if (res.ok) {
          return res.json()
        }
        throw new Error('error en la petición')
      })
      .then(json => {

      })
      .catch(error => {
        console.log(error)
      })
  }

  return (
    <View style={styles.switch}>
      <Text style={styles.switchLastCommunication}>{lastCommunication}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={styles.switchTitle}>{alias}</Text>
        <Switch
          value={onOff} onValueChange={value => setOnOff(value)} onChange={() => changeState()}
        />
        <Entypo name='dots-three-vertical' size={24} color='black' onPress={() => setDisplayOptions(previus => !previus)} />
      </View>
      {
        displayOptions && <View>
          <Text onPress={() => changeMode()}>Change to schedule mode</Text>
          <Text onPress={() => deleteSwitch()}>Delete</Text>
        </View>
      }

    </View>
  )
}

function ModeSchedules ({ alias, lastCommunication, state }) {
  const [displayOptions, setDisplayOptions] = useState(false)
  return (
    <View style={styles.switch}>
      <Text style={styles.switchLastCommunication}>{lastCommunication}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={styles.switchTitle}>{alias}</Text>
        <Switch value={state} disable />
        <Entypo name='dots-three-vertical' size={24} color='black' onPress={() => setDisplayOptions(previus => !previus)} />
      </View>
      {
        displayOptions && <View>
          <Text>Add a schedule</Text>
          <Text>Change to switch mode</Text>
          <Text>Delete</Text>
        </View>
      }

    </View>
  )
}

function Dashboard ({ data }) {
  const { userData, setUserData } = useContext(SessionContext)

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>smartswitchs</Text>
      </View>

      <View>
        <Text>Welcome {userData.firstName} 👋​</Text>
      </View>

      <View style={styles.switchs}>
        <Text style={styles.title}>Device in mode switch</Text>
        <FlatList
          data={data.filter(item => item.mode === 1)}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ModeSwitchs {...item} />}
          ListEmptyComponent={<Text>Don't have devices in switch mode</Text>}
        />
      </View>

      <View style={styles.schedules}>
        <Text style={styles.title}>Device in mode schedule</Text>
        <FlatList
          data={data.filter(item => item.mode === 2)}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ModeSchedules {...item} />}
          ListEmptyComponent={<Text>Don't have devices in schedule mode</Text>}
        />
      </View>

      <TouchableOpacity style={styles.addBtn}>
        <FontAwesome style={styles.icon} name='plus' size={24} color='#FFF' />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btn} onPress={async () => {
          try {
            await AsyncStorage.removeItem('@userData')
            setUserData(false)
          } catch (error) {

          }
        }}
      >
        <Text>Logout</Text>
      </TouchableOpacity>
    </View>
  )
}

export default function DashboardScreen () {
  const { userData, setUserData } = useContext(SessionContext)
  const [load, setLoad] = useState(true)
  const [data, setData] = useState([])

  useEffect(() => {
    async function searchSwitchs () {
      fetch(`http://192.168.31.228:8080/api/v1/user/${userData.id}/switchs`)
        .then(res => {
          if (res.ok) {
            return res.json()
          }

          throw new Error('something went wrong')
        })
        .then(json => {
          const switchs = json.data
          setData(switchs)
          setLoad(false)
          console.log(switchs)
        })
        .catch(error => {
          console.log(error)
        })
    }

    searchSwitchs()
  }, [])

  return (
    <SafeAreaView style={styles.safeArea}>
      {
        load
          ? <ActivityIndicator style={styles.load} size='large' color='#061A6E' />
          : <Dashboard data={data} />
    }
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
    textAlign: 'left',
    color: '#061A6E',
    fontSize: 24,
    textTransform: 'uppercase',
    fontStyle: 'italic',
    fontWeight: '900'
  },
  addBtn: {
    backgroundColor: '#061A6E',
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'centers',
    position: 'absolute',
    right: 0,
    bottom: 0
  },
  icon: {
    alignSelf: 'center'
  },
  load: {
    flex: 1
  }
})
