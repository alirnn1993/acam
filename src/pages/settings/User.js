import React, {useEffect, useState} from "react";
import * as yup from "yup";
import {useFormik} from "formik";
import {UserApi} from "../../utils/UserApi";
import {
    Container, InputLabel, MenuItem, Select, Snackbar, Tooltip,
    Typography
} from "@mui/material";
import styles from "../../assets/css/dashboard.module.scss";
import Card from "@mui/material/Card";
import {useNavigate, useParams} from "react-router-dom";
import {TextField} from "../../components/subComponents/TextField";
import FormControl1 from "../../components/subComponents/FormControl";
import LoadingButton1 from "../../components/subComponents/LoadingButton";
import Button2 from "../../components/subComponents/Button2";
import {Alert} from "@mui/lab";


const User = (props) => {
    const navigate = useNavigate();
    const params = useParams();
    const [role, setRole] = useState('');
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const showMessage = (message) => {
        setMessage(message);
        setOpen(true);
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };


    const handleChangeRole = (event) => {
        setRole(event.target.value);
    };
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
    const validationSchema2 = yup.object({
        password: yup
            .string("رمز عبور جدید را وارد کنید.")
            .min(8, "Minimum length of password is 8 character.")
            .required("Password is required"),
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
            password: '', passwordConfirmation: '', name: "", username: ""

        },
        validationSchema: params.id ? validationSchema : validationSchema2,
        onSubmit: async (values) => {
            if (params.id) {

                const response = (result) => {
                    navigate(-1);
                }
                const error = (e) => {
                }
                let fd = new FormData();
                fd.append("payload", JSON.stringify({...values, role: role}));
                await UserApi.updateUser(fd, params.id, response, error);
            } else {
                const response = (result) => {
                    navigate(-1);
                }
                const error = (e) => {
                    showMessage("Username must be unique!");

                }
                let fd = new FormData();
                fd.append("payload", JSON.stringify({...values, role: role}));
                await UserApi.insertNewUser(fd, response, error);
            }
        },
    });

    const getUser = async (id) => {
        const response = (result) => {
            setRole(result.data.role);
            formik.setValues({...formik.values, name: result.data.name, username: result.data.username});
        }
        const error = (e) => {

        }
        await UserApi.getUserById(id, response, error);
    }

    useEffect(() => {
        if (params.id) {
            (async () => {
                await getUser(params.id);
            })();
        }
    }, []);

    return <div
        style={{width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center"}}>
        <Container maxWidth={"sm"} style={{position: "relative"}}>
            <div style={{position: "absolute", top: -20, left: -20}}>

            </div>
            <Card elevation={1} className={styles.card}>

                <Typography variant={"h5"} component={"h5"} style={{color: '#9a9a9a', fontWeight: 100}}>
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
                            disabled={params.id}
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
                            disabled={params.id}
                        />
                    </div>
                    <div className={styles.inputContainer}>
                        <FormControl1 fullWidth>
                            <InputLabel id="demo-simple-select-label">User Role</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={role}
                                label="User Role"
                                onChange={handleChangeRole}
                            >
                                <MenuItem value={'administrator'}>Administrator</MenuItem>
                                <MenuItem value={'super'}>Super</MenuItem>
                                <MenuItem value={'normal'}>Normal</MenuItem>
                            </Select>
                        </FormControl1>
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
                            label="Confirm Password"
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
                        <Tooltip title={"go back"}>
                            <Button2 color="primary" onClick={() => {
                                navigate(-1);
                            }}>
                                Cancel
                            </Button2>
                        </Tooltip>

                    </div>
                </form>
            </Card>

            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{width: '100%'}}>
                    {message}
                </Alert>
            </Snackbar>
        </Container>
    </div>;
};
export default User;