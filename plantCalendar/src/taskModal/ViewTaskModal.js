import * as React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, TextInput} from 'react-native';
import { Icon }  from 'react-native-elements';


import FirestoreHandle from '../firebaseFirestore/FirestoreHandle';

export default class ViewTaskModal extends React.Component {
    state = {
      completeTaskAnimationTime: 300,
      inputTimeSpent: 0,
      // a class to handle most of the firestore interfaces (eg. update time in firestore)
      firestoreHandle: new FirestoreHandle(),
      displayTimeSpent: this.props.route.params.task.timeSpent,
      displayTimeLeft: this.props.route.params.task.timeLeft,
    }

    /**
     * \brief if the user clicks the complete button on the Task Viewer Modal
     */
    closeAndCompleteTask() {
      // close the modal
      this.props.navigation.goBack();

      // call the task's complete function
      // wait for a bit so the user can clear see 2 steps:
      //   1) close the modal
      //   2) delete the task
      setTimeout(()=>this.props.route.params.task.completedHandler(),
                     this.state.completeTaskAnimationTime);
    }

    /**
     * \brief if the user clicks the submit button to input time spent on a task
     */
    addTimeSpent() {
      // update the time spent and consequently the time left for a task
      // this.props.route.params.task.timeSpentHandler(this.state.inputTimeSpent);
      const task = this.props.route.params.task;
      let newTimeSpent = parseFloat(task.timeSpent) + parseFloat(this.state.inputTimeSpent);
      this.state.firestoreHandle.updateTimeSpentInFirebase(this.props.route.params.userEmail,task.id, 
          newTimeSpent);
      
      // clear the text input
      this.setState(() =>{ 
        let newTimeLeft = parseFloat(task.estTimeToComplete) - parseFloat(newTimeSpent);
          // if the time spent exceed estimated time, time left should just be 0
          if (newTimeLeft < 0) {
              newTimeLeft = 0;
          }
        return {displayTimeLeft: newTimeLeft, displayTimeSpent: newTimeSpent, inputTimeSpent: 0}
      });

      
    }

    render() {
      // get the props and states  of a task
      // this gets passed in when a Task Component navigates to ViewTaskModal
      const task = this.props.route.params.task;

      // only display "estimate time to complete" "time spent" "time left"
      // if there is an estimated time
      const dispTime = task.estTimeToComplete != null
      // const taskTimeSpent = "Time Spent (hours): " + taskStates.timeSpent;

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
            <View style = {styles.taskTextBlock}>
              <Text style = {{...styles.taskText, fontWeight: 'bold'}}>
                Task Name: {task.name}
              </Text>
              {/* toLocalString gives us date format: 23/01/2019, 17:23:42*/}
              <Text style = {styles.taskText}>
                Due Date: {task.dueDate.toLocaleString()}
              </Text>
              <Text style = {styles.taskText}>
                Priority: {task.priority}
              </Text>
              {/* all the time related info for a task will only show if the task has
                  estimate time to complete */}
              <Text style = {styles.taskText}>
                {dispTime? "Estimated Time to Complete (hours): " + task.estTimeToComplete : null}
              </Text>
              <Text style = {styles.taskText}>
                {dispTime? "Time Spent (hours): " + this.state.displayTimeSpent : null}
              </Text>
              <Text style = {styles.taskText}>
                {dispTime? "Time Left (hours): " + this.state.displayTimeLeft : null }
              </Text>
            </View>
            {/* Adding number of hours spent for the task */}
            {/* Only display when the task has estimated time to complete (hours) */}
            {dispTime? 
              <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    onChangeText={(time)=>{
                      this.setState({inputTimeSpent: time});
                    }}
                    value = {this.state.inputTimeSpent}
                    keyboardType = {'numeric'} 
                />
                <TouchableOpacity
                  style = {styles.submitButton}
                  onPress = {() => this.addTimeSpent()}
                >
                  <Text>SUBMIT</Text>
                </TouchableOpacity>
              </View> 
            : null}
            {/* button to complete the task (same functionality as the checkbox for each task */}
            <TouchableOpacity 
              style = {styles.completeButton}
              onPress = {() => this.closeAndCompleteTask()}>
              <Text>COMPLETE</Text>
            </TouchableOpacity>
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
  },
  taskTextBlock: {
    marginLeft: 25,
    top: 55,
  },
  taskText: {
    marginBottom: 10,
  },
  completeButton: {
    position: 'absolute', 
    backgroundColor: '#65CCB8',
    width: '90%',
    height: '10%',
    marginLeft: 15,
    marginRight: 15,
    bottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
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
  inputContainer: {
    position: 'absolute', 
    flexDirection: 'row',
    alignItems: 'center', 
    marginLeft: 10,
    marginRight: 10,
    bottom: 75,
  },
  input: {
    width: '70%',
    fontSize: 15,
    paddingLeft: 5,
    margin: 5,
    height: 50,
    borderColor: '#0E88E5',
    borderWidth: 4
  },
  submitButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0E88E5',
    height: 50, 
    paddingHorizontal: 10,
    margin: 5,
  },
});
   