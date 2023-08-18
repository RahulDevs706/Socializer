import * as Yup from "yup"
import moment from "moment"

const today = moment().format('YYYY-MM-DD')

export const signupSchema = Yup.object({
    fName: Yup.string().required("First name is required").max(10, "First name cannot exceed 10 characters").min(3, "First Name should of atlest 3 characters").matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed"),
    lName: Yup.string().required("Last name is required").max(10, "Last name cannot exceed 10 characters").min(3, "Last Name should of atlest 3 characters").matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed"),
    email: Yup.string().email("Please enter a valid email id").required("Email id is required"),
    password: Yup.string().required("Password is required").min(8, "Password should be more than 8 characters").max(16, "Password cannot exceed 16 characters").matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, "Password should contain atleast 1 Uppercase, 1 Lowercase and a special character"),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Password & confirm password must match').required("Confirm password is required"),
    dob: Yup.string().required("Date of birth is reuired"),
    gender: Yup.string().required("Gender is required")
})