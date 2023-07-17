import React from "react";
import * as yup from "yup";
import {useFormik} from "formik";
import {UserApi} from "../../utils/UserApi";
import {
    Container, Typography
} from "@mui/material";
import styles from "../../assets/css/dashboard.module.scss";
import Card from "@mui/material/Card";
import {useAuthState} from "../../context/AuthContext";
import {TextField} from "../../components/subComponents/TextField";
import LoadingButton1 from "../../components/subComponents/LoadingButton";

const UserSetting = (props) => {
    const auth = useAuthState();
    const validationSchema = yup.object({
        password: yup
            .string("رمز عبور جدید را وارد کنید.")
            .min(8, "Minimum length of password is 8 character."),
        passwordConfirmation: yup
            .string("رمز عبور را تکرار کنید.")
            .oneOf([yup.ref('password'), null], 'Confirm password is not match'),
        name: yup
            .string("")
            .required("Name is required"),
        username: yup
            .string()
            .required("Username is required")

    });

    const formik = useFormik({
        initialValues: {
            password: '', passwordConfirmation: '', name: auth.user.name, username: auth.user.username

        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {

            const response = (result) => {

            }
            const error = (e) => {

            }
            let fd = new FormData();
            fd.append("payload", JSON.stringify(values));
            await UserApi.updateMyself(fd, response, error);
        },
    });

    return <div
        style={{width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center"}}>
        <Container maxWidth={"sm"}>
            <Card elevation={1} className={styles.card}>


                <Typography variant={"h5"} component={"h5"} style={{color:'#9a9a9a',fontWeight:100}}>
                    User Setting
                </Typography>
                <form onSubmit={formik.handleSubmit}>

                    <div className={styles.inputContainer}>

                        <TextField
                            fullWidth
                            id="name"
                            name="name"
                            label="Name"
                            type="text"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            error={formik.touched.name && Boolean(formik.errors.name)}
                            helperText={formik.touched.name && formik.errors.name}
                            variant="outlined"
                        />
                    </div>

                    <div className={styles.inputContainer}>

                        <TextField
                            fullWidth
                            id="username"
                            name="username"
                            label="Username"
                            type="username"
                            value={formik.values.username}
                            onChange={formik.handleChange}
                            error={formik.touched.username && Boolean(formik.errors.username)}
                            helperText={formik.touched.username && formik.errors.username}
                            variant="outlined"
                        />
                    </div>

                    <div className={styles.inputContainer}>

                        <TextField
                            fullWidth
                            id="password"
                            name="password"
                            label="Password"
                            type="password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            error={formik.touched.password && Boolean(formik.errors.password)}
                            helperText={formik.touched.password && formik.errors.password}
                            variant="outlined"
                        />
                    </div>

                    <div className={styles.inputContainer}>

                        <TextField
                            fullWidth
                            id="passwordConfirmation"
                            name="passwordConfirmation"
                            label="Confirm password"
                            type="password"
                            value={formik.values.passwordConfirmation}
                            onChange={formik.handleChange}
                            error={formik.touched.passwordConfirmation && Boolean(formik.errors.passwordConfirmation)}
                            helperText={formik.touched.passwordConfirmation && formik.errors.passwordConfirmation}
                            variant="outlined"
                        />
                    </div>
                    <div style={{display: "flex", flexDirection: "row-reverse", margin: 10}}>

                        <LoadingButton1
                            type={"submit"}
                        >
                            Submit
                        </LoadingButton1>

                    </div>
                </form>
            </Card>


        </Container>
    </div>;
};
export default UserSetting;