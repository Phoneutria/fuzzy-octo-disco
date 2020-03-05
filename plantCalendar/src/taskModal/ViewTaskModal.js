import * as React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import { Icon }  from 'react-native-elements';

export default class ViewTaskModal extends React.Component {
    render() {
      // get the props of a task
      // this gets passed in when a Task Component navigates to ViewTaskModal
      const taskProps = this.props.route.params.taskProps;
      const taskStates = this.props.route.params.taskStates;
      return (
        <View style = {styles.container} >
          <View style = {styles.modal}>
            {/* Close Button */}
            <TouchableOpacity 
              style={styles.closeButton}
              onPress = {() => this.props.navigation.goBack()}>
              <Icon name='close'></Icon>
            </TouchableOpacity>
            {/* Edit Button to open the task editor modal */}
            <TouchableOpacity 
              style={styles.editButton}
              onPress = {() => this.props.navigation.navigate("EditTask")}>
              <Icon name='edit'></Icon>
            </TouchableOpacity>
            {/* Wrap a view around the Texts for easier styling */}
            <View style = {styles.taskText}>
              <Text>Task Name: {taskProps.name}</Text>
              {/* toLocalString gives us date format: 23/01/2019, 17:23:42*/}
              <Text>Due Date: {taskProps.dueDate.toLocaleString()}</Text>
              <Text>Priority: {taskProps.priority}</Text>
              <Text>Estimated Time to Complete: {taskProps.estTimeToComplete}</Text>
              <Text>Time Spent:{taskStates.timeSpent}</Text>
              <Text>Time Left: {taskStates.timeLeft}</Text>
            </View>
          </View>
        </View>
      );
  }
}

const styles = StyleSheet.create({
  container:{
      // control how the children align horizontally
      alignItems: 'center',
      flex: 1, 
      justifyContent: 'center',
  },
  modal:{
      height: '50%', 
      width: '80%', 
      backgroundColor: "#F2F2F2",
      // alignItems: 'center',
      justifyContent: 'center',
  },
  taskText: {
    marginLeft: 25,
  },
  closeButton: {
    position: 'absolute', 
    top: 5,
    left: 5,
  },
  editButton: {
    position: 'absolute', 
    top: 5,
    right: 5,
  },
});
   