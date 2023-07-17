import React, {useEffect, useState} from "react";
import {useFormik} from "formik";
import * as yup from 'yup';
import {useAuthState} from "../context/AuthContext";
import logo from '../assets/img/1.png';
import Card from '@mui/material/Card';
import LinearProgress, {linearProgressClasses} from '@mui/material/LinearProgress';
import {styled} from '@mui/material/styles';
import {Converts} from "../utils/Converts";
import {Alert,  Grid,  Snackbar, Tooltip} from "@mui/material";
import styles from '../assets/css/login.module.scss';
import {CaptchaApi} from "../utils/CaptchaApi";
import RefreshIcon from '@mui/icons-material/Refresh';
import {TextField} from "../components/subComponents/TextField";
import Button1 from "../components/subComponents/Button1";
import Button4 from "../components/subComponents/Button4";

const BorderLinearProgress = styled(LinearProgress)(({theme}) => ({
    height: 10, borderRadius: 5, [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
    }, [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 5, backgroundColor: theme.palette.mode === 'light' ? '#fb8500' : '#fb8500',
    },
}));
const Login = props => {
    const [openSnackBar1, setOpenSnackBar1] = useState(false);
    const [message, setMessage] = useState('');
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState('info');
    const [duration,setDuration]=useState(3000);
    const [captcha, setCaptcha] = useState({
        "sensitive": false,
        "key": "", img: null,
    });
    let user = useAuthState();
    const loginError = (error) => {
        if (error.response) {
            if(error.response.status===402){
                handleClickSnackBar1('Captcha is incorrect.','error');

            }else if(error.response.status===401){
                handleClickSnackBar1('Username or password is incorrect.','error');

            }

        }
        (async () => {
            await getCaptcha();
        })();
    }
    const validationSchema = yup.object({
        username: yup
            .string('پست الکترونیکی خود را وارد کنید')
            .required('username is required'),
        password: yup
            .string('رمز عبور خود را وارد کنید.')
            // .min(8, 'Password should be of minimum 8 characters length')
            .required('password is required'),
        captcha: yup.number('captcha is not in correct format').required('captcha is required').positive('captcha is not in correct format').integer('captcha is not in correct format').max(100, 'captcha is not in correct format').min(0, 'captcha is not in correct format'),
    });
    const handleCloseSnackBar1 = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnackBar1(false);
    };
    const handleClickSnackBar1 = (text, status) => {
        setOpenSnackBar1(true);
        setMessage(text);
        setStatus(status);
        setDuration(3000);
    };
    const showMessage = async () => {
        handleClickSnackBar1('you are logged in successfully!', 'info');


        setInterval(() => {
            setProgress((oldProgress) => {
                if (oldProgress === 100) {
                    return 0;
                }
                const diff = 10;
                return oldProgress + diff;
            });
        }, 200);
        await Converts.sleep(2000);
    }


    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            captcha: ''
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            user.login({...values, key: captcha.key}, loginError, showMessage);
        },
    });

    const getCaptcha = async () => {
        await CaptchaApi.get((response) => {
            setCaptcha(response.data);
        }, (error) => {



        })
    }
    useEffect(() => {
        (async () => {
            await getCaptcha();
        })();
    }, []);
    return <>
        <Grid container className={styles.container}>
            <Grid item xs={5} className={styles.bannerContainer}>
                <img src={logo} alt={""}/>
            </Grid>
            <Grid item md={7} xs={12} className={styles.formContainer}>
                <div>
                    <Card className={styles.card} elevation={3}>
                        {(user.isPending && !openSnackBar1) && <BorderLinearProgress/>}
                        <form onSubmit={formik.handleSubmit} className={styles.form}>
                            <TextField
                                fullWidth
                                id="username"
                                name="username"
                                label="Username"
                                value={formik.values.username}
                                onChange={formik.handleChange}
                                error={formik.touched.username && Boolean(formik.errors.username)}
                                helperText={formik.touched.username && formik.errors.username}
                                variant="outlined"
                                className={styles.textField}
                            />
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
                                className={styles.textField}
                            />
                            <div className={styles.captchaContainer}>
                                <img src={captcha.img} alt={""} className={styles.captchaImg}/>
                                <Tooltip title="بارگذاری مجدد" onClick={getCaptcha}>
                                    <Button4 color="primary" className={styles.refreshBtn}>
                                        <RefreshIcon/>
                                    </Button4>
                                </Tooltip>
                                <TextField
                                    fullWidth
                                    id="captcha"
                                    name="captcha"
                                    label="Captcha"
                                    type="captcha"
                                    value={formik.values.captcha}
                                    onChange={formik.handleChange}
                                    error={formik.touched.captcha && Boolean(formik.errors.captcha)}
                                    helperText={formik.touched.captcha && formik.errors.captcha}
                                    variant="outlined"
                                    className={styles.captchaInput}
                                />
                            </div>


                            <Button1 color="primary" variant="contained" fullWidth type="submit"
                                    className={styles.btn}
                                    disabled={user.isPending}>
                                Login
                            </Button1>


                        </form>
                    </Card>
                </div>
            </Grid>

        </Grid>
        <Snackbar open={openSnackBar1} autoHideDuration={duration}
                  onClose={handleCloseSnackBar1}
                  className={styles.snackBar}
                  anchorOrigin={{vertical: 'top', horizontal: 'left'}}
                  sx={{width: '50%'}}

        >
            <div className={styles.snackBarContainer}>
                <Alert
                    sx={{width: '100%', height: '100%'}}
                    className={styles.txt}
                    severity={status}
                >
                    {message}
                </Alert>
                <BorderLinearProgress variant="determinate" value={progress}/>

            </div>

        </Snackbar>
    </>;
}

export default Login;
