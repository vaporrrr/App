import React, { useContext, useState } from 'react'
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  View,
  Text,
  BackHandler
} from 'react-native'
import { SchoolInfo, StudentInfo } from 'studentvue'
import { Colors } from '../colors/Colors'
import AppContext from '../contexts/AppContext'
import {
  FontAwesome,
  MaterialCommunityIcons,
  Feather,
  AntDesign
} from '@expo/vector-icons'
import { suffix } from '../gradebook/GradeUtil'
import useAsyncEffect from 'use-async-effect'
import { ScrollView } from 'react-native-gesture-handler'
import Constants from 'expo-constants'

const Profile = ({ navigation }) => {
  const { client } = useContext(AppContext)
  const [studentInfo, setStudentInfo] = useState(undefined as StudentInfo)
  const [schoolInfo, setSchoolInfo] = useState(undefined as SchoolInfo)

  useAsyncEffect(async () => {
    setStudentInfo(await client.studentInfo())
    setSchoolInfo(await client.schoolInfo())

    const backAction = () => {
      navigation.goBack()
      return true
    }

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    )

    return () => backHandler.remove()
  }, [])

  return (
    <View style={{ flex: 1 }}>
      {!studentInfo || !schoolInfo ? (
        <ActivityIndicator
          color={Colors.secondary}
          animating={true}
          size="large"
          style={{
            alignSelf: 'center',
            flex: 1,
            justifyContent: 'center'
          }}
        />
      ) : (
        <View style={{ flex: 1 }}>
          <View style={styles.header}></View>
          <Image
            style={styles.avatar}
            source={{
              uri: `data:image/png;base64,${studentInfo.photo}`
            }}
          />
          <Text style={styles.name}>{studentInfo.student.name}</Text>
          <View style={styles.description_container}>
            <Text style={styles.description_part_text}>
              {studentInfo.grade + suffix(parseInt(studentInfo.grade))}
            </Text>
            <Text style={styles.description_part_text}>
              {studentInfo.birthDate.toLocaleDateString()}
            </Text>
          </View>
          <ScrollView style={styles.property_view}>
            {studentInfo.id && (
              <View style={styles.property_container}>
                <AntDesign name="idcard" size={22} color={Colors.black} />
                <Text style={styles.property_text}>
                  {studentInfo.id ? studentInfo.id : ''}
                </Text>
              </View>
            )}
            {studentInfo.phone && (
              <View style={styles.property_container}>
                <Feather name="phone" size={22} color={Colors.black} />
                <Text style={styles.property_text}>{studentInfo.phone}</Text>
              </View>
            )}
            {studentInfo.address && (
              <View style={styles.property_container}>
                <Feather name="home" size={22} color={Colors.black} />
                <Text style={styles.property_text}>{studentInfo.address}</Text>
              </View>
            )}
            {studentInfo.email && (
              <View style={styles.property_container}>
                <Feather name="mail" size={22} color={Colors.black} />
                <Text style={styles.property_text}>{studentInfo.email}</Text>
              </View>
            )}
            {studentInfo.currentSchool && (
              <View style={styles.property_container}>
                <FontAwesome name="building-o" size={22} color={Colors.black} />
                <Text style={styles.property_text}>
                  {studentInfo.currentSchool}
                </Text>
              </View>
            )}
            {schoolInfo.school.address && (
              <View style={styles.property_container}>
                <Feather name="map-pin" size={22} color={Colors.black} />
                <Text style={styles.property_text}>
                  {schoolInfo.school.address}
                </Text>
              </View>
            )}
            {studentInfo.homeRoom && (
              <View style={styles.property_container}>
                <FontAwesome
                  name="pencil-square-o"
                  size={22}
                  color={Colors.black}
                />
                <Text style={styles.property_text}>
                  Homeroom: {studentInfo.homeRoom}
                </Text>
              </View>
            )}
            {studentInfo.counselor && (
              <View style={styles.property_container}>
                <Feather name="user" size={22} color={Colors.black} />
                <Text style={styles.property_text}>
                  Counselor: {studentInfo.counselor.email}
                </Text>
              </View>
            )}
            {schoolInfo.school.principal && (
              <View style={styles.property_container}>
                <MaterialCommunityIcons
                  name="crown-outline"
                  size={22}
                  color={Colors.black}
                />
                <Text style={styles.property_text}>
                  Principal: {schoolInfo.school.principal.email}
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    height: Constants.statusBarHeight + 90,
    backgroundColor: Colors.primary
  },
  name: {
    fontSize: 32,
    fontFamily: 'Montserrat_800ExtraBold',
    alignSelf: 'center',
    margin: 5
  },
  avatar: {
    width: 125,
    height: 125,
    borderRadius: 125 / 2,
    borderWidth: 1,
    borderColor: Colors.black,
    alignSelf: 'center',
    marginTop: -125 / 2
  },
  description_container: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  description_part_text: {
    marginHorizontal: 10,
    marginBottom: 10,
    fontSize: 24,
    fontFamily: 'Montserrat_600SemiBold'
  },
  property_view: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.secondary,
    backgroundColor: Colors.off_white,
    padding: 10,
    paddingBottom: 10,
    marginHorizontal: 25,
    marginBottom: 7,
    flexGrow: 0
  },
  property_container: {
    flexDirection: 'row',
    padding: 12
  },
  property_text: {
    marginHorizontal: 8,
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: Colors.onyx_gray
  }
})

export default Profile
