import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    root: {
        padding: 10, 
    },
    row: {
        marginVertical: 5, 

    },
    label: {
        fontWeight: 'bold'
    },
    input: {
        height: 45, 
        backgroundColor: 'white',
        padding: 5, 
        marginVertical: 5,
        borderWidth: 1, 
        borderColor: 'lightgrey',
        borderRadius: 3,
    },
    errorLabel: {
        color: 'red',
    }
})

export default styles;