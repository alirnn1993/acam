import React, {useState} from "react";
import {
    Card,
    Container,
    FormControlLabel,
    InputLabel, MenuItem,
    Collapse,
    Typography, Snackbar
} from "@mui/material";
import styles from "../../assets/css/dashboard.module.scss";
import * as yup from "yup";
import {useFormik} from "formik";
import {SettingApi} from "../../utils/SettingApi";
import {useDataState} from "../../context/DataContext";
import {TextField} from "../../components/subComponents/TextField";
import IOSSwitch from "../../components/subComponents/IOSSwitch";
import LoadingButton1 from "../../components/subComponents/LoadingButton";
import Grid2 from "@mui/material/Unstable_Grid2";
import FormControl1 from "../../components/subComponents/FormControl";
import Select1 from "../../components/subComponents/Select";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {TimePicker} from "@mui/x-date-pickers/TimePicker";
import {IMask} from "react-imask";
import {floatMask} from "float-mask";
import dayjs from "dayjs";
import {Alert} from "@mui/lab";
import {DatePicker} from "@mui/x-date-pickers";
import {AdapterDateFnsJalali} from "@mui/x-date-pickers/AdapterDateFnsJalali";
import InputAdornment from "@mui/material/InputAdornment";

const LatFormat = '0.00000'
let IpMask = IMask.createPipe({
    mask: "IP.IP.IP.IP",
    blocks: {
        IP: {
            mask: IMask.MaskedRange,
            from: 0,
            to: 255
        }

    },
    overwrite: true
});
let ANGLE = IMask.createPipe({
    mask: "ANGLE",
    blocks: {
        ANGLE: {
            mask: IMask.MaskedRange,
            from: 1,
            to: 180
        }


    },
    overwrite: true
});


const System = () => {
    const data = useDataState();
    const [isSending, setIsSending] = useState(false);
    const [value, setValue] = useState({
        enable: data.values.system.cameraStatus,
        isSpeed: data.values.system.cameraType,
        reverseDetection: data.values.system.reverseDirectionDetection
    });
    const [value1, setValue1] = useState(dayjs(`${data.values.time.date}T${data.values.time.time}`).add(3, "h").add(30, "m").toDate());
    const [method, SetMethod] = useState(data.values.time.method);
    const [ntpSetting, setNtpSetting] = useState({ip: '', string: ''})

    const [isSending1, setIsSending1] = useState(false);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const showMessage = (message) => {
        setMessage(message);
        setOpen(true);
    }
    const handleChange = (newValue) => {
        setValue(newValue);
    }
    const handleChangeMethod = (event) => {
        SetMethod(event.target.value);
    };
    const handleChange1 = (newValue) => {
        setValue1(dayjs(newValue.$d).add(3, "h").add(30, "m").toDate());
    };

    const handleSubmit = () => {
        setIsSending1(true);
        const response = (result) => {
            (async () => {
                await data.refreshData();
            })();
            setIsSending1(false);
            showMessage("Settings changed successfully");

        }
        const error = (e) => {
            setIsSending1(false);

        }
        (async () => {
            let fd = new FormData();
            fd.append("payload", JSON.stringify({
                dateTime: value1, method: method
            }));
            await SettingApi.updateTime(fd, response, error);
        })();
    }


    // return focus to the button when we transitioned from !open -> open


    const validationSchema = yup.object({

        name: yup
            .string("")
            .required("Name is required"),
        locationName: yup
            .string()
            .required("Location name is required"),
        lat: yup
            .string()
            .required("Latitude name is required"),
        lng: yup
            .string()
            .required("Longitude name is required"),
        policeCode: yup
            .string()
            .required("Police code name is required"),

        // rotationAngle: yup
        //     .string()
        //     .required("Rotation angle code name is required"),


    });

    const formik = useFormik({
        initialValues: {
            locationName: data.values.system.locationName,
            lat: data.values.system.locationGeometry.lat,
            name: data.values.system.name,
            lng: data.values.system.locationGeometry.lng,
            policeCode: data.values.system.policeCode,
            rotationAngle: data.values.system.rotationAngle

        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            setIsSending(true);

            const response = (result) => {
                // formik.resetForm();
                setIsSending(false);
                (async () => {
                    await data.refreshData();
                })();
                showMessage("Settings changed successfully!");

            }
            const error = (e) => {
                setIsSending(false);
            }
            let fd = new FormData();
            fd.append("payload", JSON.stringify({
                ...values,
                cameraEnable: value.enable,
                isSpeed: value.isSpeed,
                reverseDetection: value.reverseDetection
            }));
            await SettingApi.updateSystem(fd, response, error);
        },
    });
    return <div style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100%"
    }}>
        <Container maxWidth={"md"}>

            <Grid2 container spacing={2}>

                <Grid2 item xs={12} sm={6}>
                    <Card elevation={1} className={styles.card}>

                        <Typography variant={"h5"} component={"h5"} style={{color: '#9a9a9a', fontWeight: 100}}>
                            General Settings
                        </Typography>
                        <form onSubmit={formik.handleSubmit}>

                            <Grid2 container spacing={2}  style={{marginTop:5}}>
                                <Grid2 item xs={12} md={12}>
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

                                </Grid2>
                                <Grid2 item xs={12} md={12}>

                                    <TextField
                                        fullWidth
                                        id="locationName"
                                        name="locationName"
                                        label="Location Name"
                                        type="text"
                                        value={formik.values.locationName}
                                        onChange={formik.handleChange}
                                        error={formik.touched.locationName && Boolean(formik.errors.locationName)}
                                        helperText={formik.touched.locationName && formik.errors.locationName}
                                        variant="outlined"
                                    />
                                </Grid2>
                                <Grid2 item xs={12}>

                                    <TextField
                                        fullWidth
                                        id="policeCode"
                                        name="policeCode"
                                        label="Police Code"
                                        type="text"
                                        value={formik.values.policeCode}
                                        onChange={formik.handleChange}
                                        error={formik.touched.policeCode && Boolean(formik.errors.policeCode)}
                                        helperText={formik.touched.policeCode && formik.errors.policeCode}
                                        variant="outlined"
                                    />

                                </Grid2>
                                <Grid2 item xs={6}>

                                    <TextField
                                        fullWidth
                                        id="lat"
                                        name="lat"
                                        label="Latitude"
                                        type="text"
                                        value={formik.values.lat}
                                        onChange={e => {


                                            let output = parseFloat(floatMask(e.target.value, LatFormat));

                                            if (output <= 90 && output >= -90)
                                                formik.handleChange({
                                                    target: {
                                                        name: e.target.name,
                                                        value: (output)
                                                    }
                                                })

                                        }}
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">&deg;</InputAdornment>,
                                        }}
                                        error={formik.touched.lat && Boolean(formik.errors.lat)}
                                        helperText={formik.touched.lat && formik.errors.lat}
                                        variant="outlined"
                                    />

                                </Grid2>
                                <Grid2 item xs={6}>

                                    <TextField
                                        fullWidth
                                        id="lng"
                                        name="lng"
                                        label="Longitude"
                                        type="text"
                                        value={formik.values.lng}
                                        onChange={e => {
                                            let output = parseFloat(floatMask(e.target.value, LatFormat));

                                            if (output <= 180 && output >= -180)
                                                formik.handleChange({
                                                    target: {
                                                        name: e.target.name,
                                                        value: (output)
                                                    }
                                                })
                                        }}
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">&deg;</InputAdornment>,
                                        }}
                                        error={formik.touched.lng && Boolean(formik.errors.lng)}
                                        helperText={formik.touched.lng && formik.errors.lng}
                                        variant="outlined"
                                    />
                                </Grid2>


                                <Grid2 item xs={12}>
                                    <div style={{display: "flex", flexDirection: "row-reverse",marginTop:19}}>

                                        <LoadingButton1
                                            type={"submit"}
                                            loading={isSending}
                                        >
                                            Submit
                                        </LoadingButton1>

                                        {/*<Button color={"error"}>Cancel</Button>*/}
                                    </div>
                                </Grid2>
                            </Grid2>


                        </form>
                    </Card>
                </Grid2>
                <Grid2 item xs={12} sm={6}>
                    <Card elevation={1} className={styles.card} style={{marginBottom: 8}}>

                        <Typography variant={"h5"} component={"h5"} style={{color: '#9a9a9a', fontWeight: 100}}>
                            Camera
                        </Typography>
                        <Grid2 container spacing={2}>
                            <Grid2 item xs={6}>
                                <FormControlLabel control={<IOSSwitch
                                    checked={value.enable}
                                    onChange={() => handleChange({
                                        ...value,
                                        enable: !value.enable
                                    })}/>} label="Enable"/>

                            </Grid2>

                            <Grid2 item xs={6}>
                                <FormControlLabel control={<IOSSwitch
                                    checked={value.reverseDetection}
                                    onChange={() => {
                                        handleChange({...value, reverseDetection: !value.reverseDetection})
                                    }}/>} label="Reverse Direction"/>

                            </Grid2>
                            <Grid2 item xs={12}>
                                <div style={{display: "flex", flexDirection: "row-reverse"}}>

                                    <LoadingButton1
                                        onClick={formik.handleSubmit}
                                        loading={isSending}
                                    >
                                        Submit
                                    </LoadingButton1>

                                    {/*<Button color={"error"}>Cancel</Button>*/}
                                </div>
                            </Grid2>
                        </Grid2>
                    </Card>
                    <Card elevation={1} className={styles.card}>

                        <Typography variant={"h5"} component={"h5"} style={{color: '#9a9a9a', fontWeight: 100}}>
                            Time & Date
                        </Typography>
                        <Grid2 container spacing={2} style={{marginTop:5}}>
                            <Grid2 item xs={12}>
                                <FormControl1 fullWidth>
                                    <InputLabel id="demo-simple-select-label">Time Method</InputLabel>
                                    <Select1
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={method}
                                        label="Time Method"
                                        onChange={handleChangeMethod}
                                    >
                                        <MenuItem value={1}>Internet</MenuItem>
                                        <MenuItem value={2}>NTP Server</MenuItem>
                                        <MenuItem value={3}>Manual</MenuItem>
                                    </Select1>
                                </FormControl1>
                            </Grid2>
                            <Grid2 item xs={12}>
                                <Collapse in={method === 1} style={{width: "100%"}}>
                                    <Grid2 container>
                                        <Grid2 item xs={12}>
                                            <br/>
                                            <Typography variant={"h6"}
                                                        style={{width: "100%", textAlign: "center", color: "#fff"}}>
                                                Nothing to set
                                            </Typography>
                                        </Grid2>
                                    </Grid2>

                                </Collapse>
                                <Collapse in={method === 2} style={{width: "100%"}}>
                                    <Grid2 container>
                                        <Grid2 item xs={6} md={6}>

                                            <TextField
                                                fullWidth
                                                name="name"
                                                label="NTP Server IP"
                                                type="text"
                                                value={ntpSetting.ip}
                                                onChange={(e) => {
                                                    setNtpSetting({...ntpSetting, ip: IpMask(e.target.value)})
                                                }}
                                                disabled={method !== 2}
                                                variant="outlined"
                                            />

                                        </Grid2>
                                        <Grid2 item xs={6} md={6}>

                                            <TextField
                                                fullWidth
                                                name="name"
                                                label="NTP String"
                                                type="text"
                                                value={ntpSetting.string}
                                                onChange={(e) => {
                                                    setNtpSetting({...ntpSetting, string: (e.target.value)})
                                                }}
                                                disabled={method !== 2}

                                                variant="outlined"
                                            />

                                        </Grid2>
                                    </Grid2>
                                </Collapse>
                                <Collapse in={method === 3} style={{width: "100%", display: "flex"}}>

                                    <Grid2 container spacing={2}>
                                        <Grid2 item xs={6}>
                                            <LocalizationProvider dateAdapter={AdapterDateFnsJalali}>
                                                <DatePicker
                                                    label="Date"
                                                    value={value1 ? dayjs(value1).add(-3, "h").add(-30, "m").toDate() : null}
                                                    disabled={method !== 3}
                                                    onChange={handleChange1}
                                                    renderInput={(params) => <TextField {...params} />}
                                                />
                                            </LocalizationProvider>
                                        </Grid2>
                                        <Grid2 item xs={6}>
                                            <LocalizationProvider dateAdapter={AdapterDateFnsJalali}>
                                                <TimePicker
                                                    label="Time"
                                                    value={value1 ? dayjs(value1).add(-3, "h").add(-30, "m").toDate() : null}
                                                    onChange={handleChange1}
                                                    disabled={method !== 3}

                                                    renderInput={(params) => <TextField {...params} />}
                                                />
                                            </LocalizationProvider>
                                        </Grid2>
                                    </Grid2>
                                </Collapse>
                            </Grid2>

                            <Grid2 item xs={12}>
                                <div style={{display: "flex", flexDirection: "row-reverse"}}>

                                    <LoadingButton1
                                        type={"button"}
                                        onClick={handleSubmit}
                                        loading={isSending1}
                                    >
                                        Submit
                                    </LoadingButton1>

                                </div>
                            </Grid2>
                        </Grid2>


                    </Card>

                </Grid2>
            </Grid2>


        </Container>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="success" sx={{width: '100%'}}>
                {message}
            </Alert>
        </Snackbar>
    </div>
};

export default System;


