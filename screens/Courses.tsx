import React, { useContext, useState, useEffect } from 'react'
import AppContext from '../contexts/AppContext'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  RefreshControl,
  BackHandler
} from 'react-native'
import Course from '../components/Course'
import { convertGradebook } from '../gradebook/GradeUtil'
import { SafeAreaView } from 'react-native-safe-area-context'
import { registerForPushNotificationsAsync } from '../util/Notification'
import { FadeInFlatList } from '@ja-ka/react-native-fade-in-flatlist'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Picker, onOpen } from 'react-native-actions-sheet-picker'
import { ReportingPeriod } from 'studentvue'
import { IconButton, useTheme } from 'react-native-paper'
import { Colors } from '../colors/Colors'

const Courses = ({ navigation }) => {
  const theme = useTheme()
  const { client, marks, setMarks } = useContext(AppContext)
  const [selected, setSelected] = useState(
    marks.reportingPeriod as ReportingPeriod
  )
  const endDate = selected.date.end
  useEffect(() => {
    onRefresh()
  }, [selected])

  useEffect(() => {
    registerForPushNotificationsAsync()

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

  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = async () => {
    setRefreshing(true)
    try {
      setMarks(convertGradebook(await client.gradebook(selected.index)))
    } catch (err) {}
    setRefreshing(false)
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme.colors.elevation.level1 }
      ]}
      edges={['top', 'left', 'right']}
    >
      <Picker
        id="mp"
        data={marks.reportingPeriods}
        searchable={false}
        label="Select Marking Period"
        setSelected={setSelected}
      />
      <View style={styles.marking_period_info_container}>
        <TouchableOpacity
          style={{
            backgroundColor: theme.colors.surfaceVariant,
            borderRadius: 30,
            paddingLeft: 30,
            paddingRight: 25,
            paddingVertical: 12,
            flexDirection: 'row',
            alignSelf: 'flex-start',
            alignItems: 'center'
          }}
          onPress={() => onOpen('mp')}
        >
          <Text
            style={{
              fontFamily: 'Inter_800ExtraBold',
              fontSize: 32,
              marginRight: 5
            }}
          >
            {selected.name}
          </Text>
          <MaterialCommunityIcons
            name="chevron-down"
            size={24}
            color={theme.colors.onSurfaceVariant}
          />
        </TouchableOpacity>
        <IconButton
          icon="refresh"
          size={40}
          onPress={onRefresh}
          mode={'contained'}
        />
      </View>
      <View style={styles.date_info_container}>
        {!isNaN(marks.gpa) && (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.gpa_text}>GPA</Text>
            <Text style={styles.gpa}>
              {' \u2022'} {marks.gpa.toFixed(2)}
            </Text>
          </View>
        )}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <MaterialCommunityIcons
            name="calendar-clock-outline"
            size={18}
            color={Colors.medium_gray}
          />
          <Text style={styles.date}>
            {' \u2022'} {endDate.toLocaleDateString()}
          </Text>
        </View>
      </View>
      <View
        style={{
          flex: 1,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          backgroundColor: theme.colors.surface,
          shadowColor: theme.colors.shadow,
          shadowOffset: {
            width: 0,
            height: 2
          },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 5
        }}
      >
        {marks && (
          <FadeInFlatList
            initialDelay={0}
            durationPerItem={300}
            parallelItems={5}
            itemsToFadeIn={10}
            data={[...marks.courses.entries()]}
            renderItem={({ item }) => (
              <Course
                name={item[0]}
                mark={item[1].value}
                period={item[1].period}
                teacher={item[1].teacher}
                onPress={() => {
                  navigation.navigate('Course Details', { title: item[0] })
                }}
              ></Course>
            )}
            keyExtractor={(item) => item[0]}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            contentContainerStyle={{
              paddingHorizontal: 10,
              paddingTop: 10
            }}
          />
        )}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  dropdown: {
    borderWidth: 0,
    backgroundColor: 'transparent',
    justifyContent: 'center'
  },
  dropdown_text: {
    fontFamily: 'Inter_800ExtraBold'
  },
  marking_period_container: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: 11
  },
  date: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 18
  },
  marking_period_info_container: {
    flexDirection: 'row',
    marginHorizontal: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginVertical: 10
  },
  date_info_container: {
    flexDirection: 'row',
    marginHorizontal: 15,
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'space-between'
  },
  gpa_text: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 18
  },
  gpa: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 18
  }
})

export default Courses
