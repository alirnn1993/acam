import React, {useState} from "react";
import styles from "../../assets/css/dashboard.module.scss";
import {Card, Container, InputLabel, MenuItem, Snackbar, Typography} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import * as yup from "yup";
import {useFormik} from "formik";
import {IMask} from "react-imask";
import {SettingApi} from "../../utils/SettingApi";
import {useDataState} from "../../context/DataContext";
import {TextField} from "../../components/subComponents/TextField";
import Select1 from "../../components/subComponents/Select";
import FormControl1 from "../../components/subComponents/FormControl";
import LoadingButton1 from "../../components/subComponents/LoadingButton";
import {Alert} from "@mui/lab";

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

let PortMask = IMask.createPipe({
    mask: "PORT",
    blocks: {
        PORT: {
            mask: IMask.MaskedRange,
            from: 0,
            to: 65535
        }
    },
    overwrite: true
})


const Network = () => {
    const data = useDataState();
    const [method, SetMethod] = useState(data.values.network["tcp/IP"].method);
    const [isSending1, setIsSending1] = useState(false);
    const [isSending2, setIsSending2] = useState(false);
    const [open, setOpen] = useState(false);
    const [message,setMessage]=useState('');
    const handleClose = (event) => {
        setOpen(false);
    };

    const showMessage=(message)=>{
        setMessage(message);
        setOpen(true);
    }
    const validationSchema = yup.object({
        ip: yup
            .string("")
            .required("IP address is required"),
        netmask: yup
            .string("")
            .required("Netmask is required"),
        gateway: yup
            .string(""),
        DNS1: yup
            .string(""),
        DNS2: yup
            .string(""),

    });


    const FTPValidationSchema = yup.object({
        ip: yup
            .string("")
            .required("IP address is required"),
        port: yup
            .string()
            .required("port is required"),
        username: yup
            .string()
            .required("username name is required"),
        password: yup
            .string()
            .required("password name is required"),
        path: yup
            .string()
            .required("Directory path on the server is required"),
        image: yup
            .string()
    });

    const formikFTP = useFormik({
        initialValues: {
            ip: data.values.network["ftp"].ipAddress,
            port: data.values.network["ftp"].port,
            username: data.values.network["ftp"].username,
            password: data.values.network["ftp"].password,
            path: data.values.network["ftp"].directoryPathOnTheServer,
            image: data.values.network["ftp"].imageFilenamePattern

        },
        validationSchema: FTPValidationSchema,
        onSubmit: async (values) => {
            setIsSending2(true);
            const response = (result) => {
                (async () => {
                    await data.refreshData();
                })();
                setIsSending2(false);
                showMessage("update was successful!");

                // formik.resetForm();
            }
            const error = (e) => {
                setIsSending2(false);

            }
            let fd = new FormData();
            fd.append("payload", JSON.stringify(values));
            await SettingApi.updateFTPServer(fd, response, error);
        },
    });

    const formik = useFormik({
        initialValues: {
            ip: data.values.network["tcp/IP"].manual.ipAddress,
            netmask: data.values.network["tcp/IP"].manual.netmask,
            gateway: data.values.network["tcp/IP"].manual.gateway?data.values.network["tcp/IP"].manual.gateway:'',
            DNS1: data.values.network["tcp/IP"].manual.dns1?data.values.network["tcp/IP"].manual.dns1:'',
            DNS2: data.values.network["tcp/IP"].manual.dns2?data.values.network["tcp/IP"].manual.dns2:''

        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            setIsSending1(true);
            const response = (result) => {
                (async () => {
                    await data.refreshData();
                })();
                setIsSending1(false);
                showMessage("update was successful!");

                // formik.resetForm();
            }
            const error = (e) => {
                setIsSending1(false);

            }
            let fd = new FormData();
            fd.append("payload", JSON.stringify({...values, method: method}));
            await SettingApi.updateTCPIPConfiguration(fd, response, error);
        },
    });
    const handleChangeMethod = (event) => {
        SetMethod(event.target.value);
    };
    return <div style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        paddingTop: 20
    }}>
        <Container maxWidth={"md"}>

            <Grid2 container spacing={3}>
                <Grid2 item xs={12} sm={6}>
                    <Card elevation={1} className={styles.card}>
                        <form onSubmit={formik.handleSubmit}>

                            <Typography variant={"h5"} component={"h5"} style={{color: '#9a9a9a', fontWeight: 100}}>
                                TCP/IP Configuration
                            </Typography>
                            <Grid2 container spacing={2}  style={{marginTop:5}}>
                                <Grid2 item xs={12} style={{display: "flex", alignItems: "center"}}>
                                    <FormControl1 fullWidth>
                                        <InputLabel id="demo-simple-select-label">Set time method</InputLabel>
                                        <Select1
                                            labelId="demo-simple-select-label"
                                            value={method}
                                            label="Set time method"
                                            onChange={handleChangeMethod}
                                        >
                                            <MenuItem value={'disable'}>Disable</MenuItem>
                                            <MenuItem value={'dhcp'}>DHCP</MenuItem>
                                            <MenuItem value={'manual'} >Manual</MenuItem>
                                        </Select1>
                                    </FormControl1>
                                </Grid2>

                                <Grid2 item xs={12}>

                                    <TextField
                                        disabled={method !== 'manual'}
                                        fullWidth
                                        id="ip"
                                        name="ip"
                                        label="IP address"
                                        type="text"
                                        value={formik.values.ip}
                                        // onChange={formik.handleChange}
                                        onChange={(e) => {
                                            formik.handleChange({
                                                target: {
                                                    id: "ip", value: IpMask(e.target.value)
                                                }
                                            });
                                        }}
                                        error={formik.touched.ip && Boolean(formik.errors.ip)}
                                        helperText={formik.touched.ip && formik.errors.ip}
                                        variant="outlined"

                                    />

                                </Grid2>
                                <Grid2 item xs={6}>

                                    <TextField
                                        disabled={method !=='manual'}
                                        fullWidth
                                        id="netmask"
                                        name="netmask"
                                        label="Netmask"
                                        type="text"
                                        value={formik.values.netmask}
                                        // onChange={formik.handleChange}
                                        onChange={(e) => {
                                            formik.handleChange({
                                                target: {
                                                    id: "netmask", value: IpMask(e.target.value)
                                                }
                                            });
                                        }}
                                        error={formik.touched.netmask && Boolean(formik.errors.netmask)}
                                        helperText={formik.touched.netmask && formik.errors.netmask}
                                        variant="outlined"

                                    />

                                </Grid2>
                                <Grid2 item xs={6}>

                                    <TextField
                                        disabled={method !== 'manual'}
                                        fullWidth
                                        id="gateway"
                                        name="gateway"
                                        label="Gateway"
                                        type="text"
                                        value={formik.values.gateway}
                                        // onChange={formik.handleChange}
                                        onChange={(e) => {
                                            formik.handleChange({
                                                target: {
                                                    id: "gateway", value: IpMask(e.target.value)
                                                }
                                            });
                                        }}
                                        error={formik.touched.gateway && Boolean(formik.errors.gateway)}
                                        helperText={formik.touched.gateway && formik.errors.gateway}
                                        variant="outlined"

                                    />

                                </Grid2>
                                <Grid2 item xs={6}>

                                    <TextField
                                        disabled={method !== 'manual'}
                                        fullWidth
                                        id="DNS1"
                                        name="DNS1"
                                        label="DNS1"
                                        type="text"
                                        value={formik.values.DNS1}
                                        // onChange={formik.handleChange}
                                        onChange={(e) => {
                                            formik.handleChange({
                                                target: {
                                                    id: "DNS1", value: IpMask(e.target.value)
                                                }
                                            });
                                        }}
                                        error={formik.touched.DNS1 && Boolean(formik.errors.DNS1)}
                                        helperText={formik.touched.DNS1 && formik.errors.DNS1}
                                        variant="outlined"

                                    />

                                </Grid2>
                                <Grid2 item xs={6}>

                                    <TextField
                                        disabled={method !== 'manual'}
                                        fullWidth
                                        id="DNS2"
                                        name="DNS2"
                                        label="DNS2"
                                        type="text"
                                        value={formik.values.DNS2}
                                        // onChange={formik.handleChange}
                                        onChange={(e) => {
                                            formik.handleChange({
                                                target: {
                                                    id: "DNS2", value: IpMask(e.target.value)
                                                }
                                            });
                                        }}
                                        error={formik.touched.DNS2 && Boolean(formik.errors.DNS2)}
                                        helperText={formik.touched.DNS2 && formik.errors.DNS2}
                                        variant="outlined"

                                    />

                                </Grid2>
                                <Grid2 item xs={12}>

                                    <div style={{display: "flex", flexDirection: "row-reverse"}}>

                                        <LoadingButton1
                                            type={"submit"}
                                            loading={isSending1}
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
                    <Card elevation={1} className={styles.card}>
                        <form onSubmit={formikFTP.handleSubmit}>


                            <Typography variant={"h5"} component={"h5"} style={{color: '#9a9a9a', fontWeight: 100}}>
                                FTP Server
                            </Typography>
                            <Grid2 container spacing={2}  style={{marginTop:5}}>
                                <Grid2 item xs={8}>

                                    <TextField
                                        fullWidth
                                        id="ip"
                                        name="ip"
                                        label="IP address"
                                        type="text"
                                        value={formikFTP.values.ip}
                                        // onChange={formik.handleChange}
                                        onChange={(e) => {
                                            formikFTP.handleChange({
                                                target: {
                                                    id: "ip", value: IpMask(e.target.value)
                                                }
                                            });
                                        }}
                                        error={formikFTP.touched.ip && Boolean(formikFTP.errors.ip)}
                                        helperText={formikFTP.touched.ip && formikFTP.errors.ip}
                                        variant="outlined"

                                    />

                                </Grid2>
                                <Grid2 item xs={4}>
                                    <TextField
                                        fullWidth
                                        id="port"
                                        name="port"
                                        label="Port"
                                        type="text"
                                        value={formikFTP.values.port}
                                        // onChange={formik.handleChange}
                                        onChange={(e) => {
                                            formikFTP.handleChange({
                                                target: {
                                                    id: "port", value: PortMask(e.target.value)
                                                }
                                            });
                                        }}
                                        error={formikFTP.touched.port && Boolean(formikFTP.errors.port)}
                                        helperText={formikFTP.touched.port && formikFTP.errors.port}
                                        variant="outlined"

                                    />

                                </Grid2>
                                <Grid2 item xs={12}>

                                    <TextField
                                        fullWidth
                                        id="username"
                                        name="username"
                                        label="Username"
                                        type="username"
                                        value={formikFTP.values.username}
                                        onChange={formikFTP.handleChange}
                                        error={formikFTP.touched.username && Boolean(formikFTP.errors.username)}
                                        helperText={formikFTP.touched.username && formikFTP.errors.username}
                                        variant="outlined"
                                    />

                                </Grid2>
                                <Grid2 item xs={12}>

                                    <TextField
                                        fullWidth
                                        id="password"
                                        name="password"
                                        label="Password"
                                        type="password"
                                        value={formikFTP.values.password}
                                        onChange={formikFTP.handleChange}
                                        error={formikFTP.touched.password && Boolean(formikFTP.errors.password)}
                                        helperText={formikFTP.touched.password && formikFTP.errors.password}
                                        variant="outlined"
                                    />

                                </Grid2>
                                <Grid2 item xs={6}>

                                    <TextField
                                        fullWidth
                                        id="path"
                                        name="path"
                                        label="Directory path on the server"
                                        type="text"
                                        value={formikFTP.values.path}
                                        onChange={formikFTP.handleChange}
                                        error={formikFTP.touched.path && Boolean(formikFTP.errors.path)}
                                        helperText={formikFTP.touched.path && formikFTP.errors.path}
                                        variant="outlined"
                                    />

                                </Grid2>
                                <Grid2 item xs={6}>

                                    <TextField
                                        fullWidth
                                        id="image"
                                        name="image"
                                        label="Image filename pattern"
                                        type="text"
                                        value={formikFTP.values.image}
                                        onChange={formikFTP.handleChange}
                                        error={formikFTP.touched.image && Boolean(formikFTP.errors.image)}
                                        helperText={formikFTP.touched.image && formikFTP.errors.image}
                                        variant="outlined"
                                    />

                                </Grid2>
                                <Grid2 item xs={12}>

                                    <div style={{display: "flex", flexDirection: "row-reverse"}}>

                                        <LoadingButton1
                                            type={"submit"}
                                            loading={isSending2}
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
            </Grid2>

        </Container>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="success" sx={{width: '100%'}}>
                {message}
            </Alert>
        </Snackbar>
    </div>;
};

export default Network;