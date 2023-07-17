import React, {useState} from "react";
import styles from "../../assets/css/dashboard.module.scss";
import {
    Card,
    Container, Divider,
    FormControlLabel, FormGroup,
    InputLabel,
    MenuItem,
    Select, Snackbar, Tooltip,
    Typography
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import {SettingApi} from "../../utils/SettingApi";
import {useDataState} from "../../context/DataContext";
import FormControl1 from "../../components/subComponents/FormControl";
import {TextField} from "../../components/subComponents/TextField";
import IOSSwitch from "../../components/subComponents/IOSSwitch";
import LoadingButton1 from "../../components/subComponents/LoadingButton";
import Slider1 from "../../components/subComponents/Slider";
import {floatMask} from "float-mask";
import {Alert} from "@mui/lab";
import InputAdornment from '@mui/material/InputAdornment';

const timeFormat = '00.0'

function valuetext(value) {
    return <>{value} &#8451;</>;
}

const marks2 = [
    {
        value: 0,
        label: <>0 &#8451;</>,
    },

    {
        value: 120,
        label: <>120 &#8451;</>,
    }
];

function blinkingValue(value) {
    return <>{value / 10} s</>;
}

const Environment = (props) => {
    const data = useDataState();
    const [isSending1, setIsSending1] = useState(false);
    const [isSending2, setIsSending2] = useState(false);
    const [state, setState] = useState({
        led: {
            set1: {
                type: data.values.environment.led.set1.type,
                brightness: data.values.environment.led.set1.brightnessPercentage,
                method: data.values.environment.led.set1.method,
                period: parseInt(data.values.environment.led.set1.period) / 10,

            },
            set2: {
                type: data.values.environment.led.set2.type,
                brightness: data.values.environment.led.set2.brightnessPercentage,
                method: data.values.environment.led.set2.method,
                period: parseInt(data.values.environment.led.set2.period) / 10
            },
            sunriseDelay: data.values.environment.led.sunriseDelay,
            sunsetDelay: data.values.environment.led.sunsetDelay
        },
        temperature: {
            fanEnable: data.values.environment.temperature.fanEnable,
            tec: data.values.environment.temperature.tec,
            environment: {
                active: data.values.environment.temperature.environment.active,
                highTemperature: data.values.environment.temperature.environment.highTemperatureLimit,
                lowTemperature: data.values.environment.temperature.environment.lowTemperatureLimit,
            },
            camera: {
                active: data.values.environment.temperature.camera.active,
                highTemperature: data.values.environment.temperature.camera.highTemperatureLimit,
                lowTemperature: data.values.environment.temperature.camera.lowTemperatureLimit,
            }
        }
    });
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
    const handleChange = (value) => {
        setState(value);
    }


    const updateLEDSetting = () => {
        setIsSending1(true);
        const response = (result) => {
            (async () => {
                await data.refreshData();
            })();
            setIsSending1(false);
            showMessage("update was successful!");
        }
        const error = (e) => {
            setIsSending1(false);

        }
        let fd = new FormData();
        fd.append("payload", JSON.stringify({
            ...state.led
        }));
        (async () => {
            await SettingApi.updateLEDSetting(fd, response, error);
        })();
    }

    const updateTemperatureSetting = () => {
        setIsSending2(true);
        const response = (result) => {
            (async () => {
                await data.refreshData();
            })();
            setIsSending2(false);
            showMessage("update was successful!");

        }
        const error = (e) => {
            setIsSending2(false);

        }

        (async () => {
            let fd = new FormData();
            fd.append("payload", JSON.stringify({
                ...state.temperature
            }));
            await SettingApi.updateTemperatureSetting(fd, response, error);
        })();
    }

    const marks = [
        {
            value: 0,
            label: '0%',
        },

        {
            value: 100,
            label: '100%',
        },
    ];
    const timeMarks = [
        {
            value: 0,
            label: '0s',
        },

        {
            value: 100,
            label: '10s',
        },
    ];


    console.log(state);
    return <div style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        paddingTop: 20
    }}>
        <Container maxWidth={"md"}>
            <Grid2 container spacing={2}>
                <Grid2 xs={12} sm={6}>

                    <Card elevation={1} className={styles.card}>

                        <Typography variant={"h5"} component={"h5"} style={{color: '#9a9a9a', fontWeight: 100}}>
                            LED
                        </Typography>

                        <Grid2 container spacing={2}>
                            <Grid2 item container xs={12}>
                                <Grid2 item xs={12} md={6} style={{paddingLeft: "2.5%"}}>
                                    <div className={styles.inputContainer}>
                                        <FormControl1 fullWidth>
                                            <InputLabel id="demo-simple-select-label">Set1 Type</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={state.led.set1.type}
                                                label="Set 1 Type"
                                                onChange={e => {
                                                    handleChange({
                                                        ...state,
                                                        led: {
                                                            ...state.led,
                                                            set1: {...state.led.set1, type: e.target.value}
                                                        }
                                                    })

                                                }}
                                            >
                                                <MenuItem value={'white'}>White</MenuItem>
                                                <MenuItem value={'ir'}>IR</MenuItem>
                                            </Select>
                                        </FormControl1>
                                    </div>

                                </Grid2>
                                <Grid2 item xs={12} md={6} style={{paddingLeft: "2.5%"}}>
                                    <div className={styles.inputContainer}>
                                        <FormControl1 fullWidth>
                                            <InputLabel id="demo-simple-select-label">Mode</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={state.led.set1.method}
                                                label="Mode"
                                                onChange={e => {
                                                    handleChange({
                                                        ...state,
                                                        led: {
                                                            ...state.led,
                                                            set1: {...state.led.set1, method: e.target.value}
                                                        }
                                                    })

                                                }}
                                            >
                                                <MenuItem value={'Automatic'}>Automatic</MenuItem>
                                                <MenuItem value={'Manual'}>Manual</MenuItem>
                                                <MenuItem value={'On'}>On</MenuItem>
                                                <MenuItem value={'Off'}>Off</MenuItem>
                                            </Select>
                                        </FormControl1>
                                    </div>

                                </Grid2>
                                <Grid2 item xs={6} style={{
                                    paddingRight: "2.5%",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center"
                                }}>
                                    <div className={styles.inputContainer}>
                                        <Typography variant={'body2'}>
                                            Blinking
                                        </Typography>
                                        <Tooltip title={'Blinking'}>

                                            <Slider1
                                                defaultValue={1}
                                                step={1}
                                                aria-label="Default"
                                                valueLabelDisplay="auto"
                                                min={0}
                                                max={100}
                                                value={(state.led.set1.period * 10)}
                                                onChange={(event, newValue) => {
                                                    handleChange({
                                                        ...state,
                                                        led: {
                                                            ...state.led,
                                                            set1: {...state.led.set1, period: newValue / 10}
                                                        }

                                                    })

                                                }}
                                                disabled={state.led.set1.method !== 'Manual' || state.led.set1.type === 'ir'}
                                                marks={timeMarks}
                                                getAriaValueText={blinkingValue}
                                                valueLabelFormat={blinkingValue}/>
                                        </Tooltip>


                                    </div>

                                </Grid2>
                                <Grid2 item xs={6} style={{
                                    paddingRight: "2.5%",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center"
                                }}>
                                    <div className={styles.inputContainer}>
                                        <Typography variant={'body2'}>
                                            Brightness
                                        </Typography>
                                        <Tooltip title={'Brightness'}>

                                            <Slider1 defaultValue={50} aria-label="Default" valueLabelDisplay="auto"
                                                     min={0}
                                                     max={100}
                                                     value={state.led.set1.brightness}
                                                     onChange={(event, newValue) => {
                                                         handleChange({
                                                             ...state,
                                                             led: {
                                                                 ...state.led,
                                                                 set1: {...state.led.set1, brightness: newValue}
                                                             }
                                                         })

                                                     }}
                                                     disabled={state.led.set1.method !== 'Manual'}
                                                     marks={marks}/>
                                        </Tooltip>
                                    </div>
                                </Grid2>
                            </Grid2>
                            <Divider style={{width: "100%"}}/>
                            <Grid2 item container xs={12}>

                                <Grid2 item xs={12} md={6} style={{paddingLeft: "2.5%"}}>
                                    <div className={styles.inputContainer}>
                                        <FormControl1 fullWidth>
                                            <InputLabel id="demo-simple-select-label">Set 2 Type</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={state.led.set2.type}
                                                label="Set 2 Type"
                                                onChange={e => {
                                                    handleChange({
                                                        ...state,
                                                        led: {
                                                            ...state.led,
                                                            set2: {...state.led.set2, type: e.target.value}
                                                        }
                                                    })
                                                }}
                                            >
                                                <MenuItem value={'white'}>White</MenuItem>
                                                <MenuItem value={'ir'}>IR</MenuItem>
                                            </Select>
                                        </FormControl1>
                                    </div>

                                </Grid2>
                                <Grid2 item xs={12} md={6} style={{paddingLeft: "2.5%"}}>
                                    <div className={styles.inputContainer}>
                                        <FormControl1 fullWidth>
                                            <InputLabel id="demo-simple-select-label">Mode</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={state.led.set2.method}
                                                label="Mode"
                                                onChange={e => {
                                                    handleChange({
                                                        ...state,
                                                        led: {
                                                            ...state.led,
                                                            set2: {...state.led.set2, method: e.target.value}
                                                        }
                                                    })
                                                }}
                                            >
                                                <MenuItem value={'Automatic'}>Automatic</MenuItem>
                                                <MenuItem value={'Manual'}>Manual</MenuItem>
                                                <MenuItem value={'On'}>On</MenuItem>
                                                <MenuItem value={'Off'}>Off</MenuItem>
                                            </Select>
                                        </FormControl1>
                                    </div>

                                </Grid2>
                                <Grid2 item xs={6} style={{
                                    paddingRight: "2.5%",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center"
                                }}>
                                    <div className={styles.inputContainer}>
                                        <Typography variant={'body2'}>
                                            Blinking
                                        </Typography>
                                        <Tooltip title={'Blinking'}>
                                            <Slider1
                                                defaultValue={1}
                                                step={1}
                                                aria-label="Default"
                                                valueLabelDisplay="auto"
                                                min={0}
                                                max={100}
                                                value={(state.led.set2.period * 10)}
                                                onChange={(event, newValue) => {
                                                    handleChange({
                                                        ...state,
                                                        led: {
                                                            ...state.led,
                                                            set2: {...state.led.set2, period: newValue / 10}
                                                        }

                                                    })

                                                }}
                                                disabled={state.led.set2.method !== 'Manual' || state.led.set2.type === 'ir'}
                                                marks={timeMarks}
                                                getAriaValueText={blinkingValue}
                                                valueLabelFormat={blinkingValue}/>
                                        </Tooltip>


                                    </div>

                                </Grid2>

                                <Grid2 item xs={6} style={{
                                    paddingRight: "2.5%",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center"
                                }}>
                                    <div className={styles.inputContainer}>
                                        <Typography variant={'body2'}>
                                            Brightness
                                        </Typography>
                                        <Tooltip title={'Brightness'}>
                                            <Slider1 defaultValue={50} aria-label="Default" valueLabelDisplay="auto"
                                                     min={0}
                                                     max={100}
                                                     value={state.led.set2.brightness}
                                                // color={"#e26024"}
                                                     onChange={(event, newValue) => {
                                                         handleChange({
                                                             ...state,
                                                             led: {
                                                                 ...state.led,
                                                                 set2: {...state.led.set2, brightness: newValue}
                                                             }
                                                         })

                                                     }}
                                                     disabled={state.led.set2.method !== 'Manual'}
                                                     marks={marks}/>
                                        </Tooltip>
                                    </div>
                                </Grid2>


                            </Grid2>
                            <Divider style={{width: "100%"}}/>

                            <Grid2 item xs={12} md={6}>
                                <div className={styles.inputContainer}>

                                    <TextField
                                        fullWidth
                                        label="Sunrise Delay"
                                        type="text"
                                        value={state.led.sunriseDelay}
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">s</InputAdornment>,
                                        }}
                                        onChange={(e) => {
                                            let output = floatMask(e.target.value, timeFormat);

                                            handleChange({
                                                ...state,
                                                led: {
                                                    ...state.led,
                                                    sunriseDelay: output
                                                }
                                            })

                                        }}
                                        variant="outlined"

                                    />
                                </div>

                            </Grid2>
                            <Grid2 item xs={12} md={6}>
                                <div className={styles.inputContainer}>

                                    <TextField
                                        fullWidth
                                        label="Sunset Delay"
                                        type="text"
                                        value={state.led.sunsetDelay}
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">s</InputAdornment>,
                                        }}
                                        onChange={(e) => {
                                            let output = floatMask(e.target.value, timeFormat);

                                            handleChange({
                                                ...state,
                                                led: {
                                                    ...state.led,
                                                    sunsetDelay: output
                                                }
                                            })

                                        }}
                                        variant="outlined"

                                    />
                                </div>
                            </Grid2>
                            <Grid2 xs={12}>
                                <div style={{display: "flex", flexDirection: "row-reverse", margin: 10}}>

                                    <LoadingButton1
                                        type={"button"}
                                        loading={isSending1}
                                        onClick={updateLEDSetting}
                                    >
                                        Submit
                                    </LoadingButton1>

                                    {/*<Button color={"error"}>Cancel</Button>*/}
                                </div>
                            </Grid2>
                        </Grid2>
                    </Card>
                </Grid2>
                <Grid2 xs={12} sm={6}>
                    <Card elevation={1} className={styles.card}>


                        <Typography variant={"h5"} component={"h5"} style={{color: '#9a9a9a', fontWeight: 100}}>
                            Fan
                        </Typography>
                        <Grid2 container spacing={2}>
                            <Grid2 item xs={12} style={{paddingLeft: "2.5%"}}>
                                <div className={styles.inputContainer}>
                                    <FormControl1 fullWidth>
                                        <InputLabel id="demo-simple-select-label">Mode</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={state.temperature.fanEnable}
                                            label="Mode"
                                            onChange={e => {
                                                handleChange({
                                                    ...state,
                                                    temperature: {
                                                        ...state.temperature,
                                                        fanEnable: e.target.value
                                                    }
                                                })
                                            }}
                                        >
                                            <MenuItem value={'Automatic'}>Automatic</MenuItem>
                                            <MenuItem value={'On'}>On</MenuItem>
                                        </Select>
                                    </FormControl1>
                                </div>

                            </Grid2>
                            <Divider style={{width: "100%"}}/>

                            <Grid2 item xs={12}>
                                <div>
                                    <Grid2 container spacing={2}>
                                        <Grid2 item xs={12} md={4}>
                                            <div className={styles.inputContainer}>
                                                <Typography variant={"h6"} component={"h6"}>
                                                    Environment
                                                </Typography>
                                            </div>
                                        </Grid2>


                                        <Grid2 item xs={12} md={8}>
                                            <div className={styles.inputContainer}>
                                                <FormGroup>
                                                    <FormControlLabel control={<IOSSwitch
                                                        disabled={state.temperature.fanEnable==="On"}
                                                        checked={state.temperature.environment.active}
                                                        onChange={() => handleChange({
                                                            ...state,
                                                            temperature: {
                                                                ...state.temperature,
                                                                environment: {
                                                                    ...state.temperature.environment,
                                                                    active: !state.temperature.environment.active
                                                                }
                                                            }
                                                        })}
                                                    />}
                                                                      label={`${state.temperature.environment.active ? 'On' : 'Off'}`}/>
                                                </FormGroup>
                                            </div>
                                        </Grid2>
                                        <Grid2 item xs={12}>
                                            <div className={styles.inputContainer}>
                                                <Typography variant={'body2'}>
                                                    Temperature
                                                </Typography>
                                                <Slider1
                                                    value={[state.temperature.environment.lowTemperature, state.temperature.environment.highTemperature]}
                                                    min={0}
                                                    step={1}
                                                    max={120}
                                                    onChange={(e) => handleChange({
                                                        ...state,
                                                        temperature: {
                                                            ...state.temperature,
                                                            environment: {
                                                                ...state.temperature.environment,
                                                                lowTemperature: e.target.value[0],
                                                                highTemperature: e.target.value[1]
                                                            }
                                                        }
                                                    })}

                                                    valueLabelDisplay="auto"
                                                    getAriaValueText={valuetext}
                                                    valueLabelFormat={valuetext}
                                                    marks={marks2}
                                                    disabled={!state.temperature.environment.active||state.temperature.fanEnable==="On"}
                                                />
                                            </div>
                                        </Grid2>

                                    </Grid2>
                                </div>

                            </Grid2>
                            <Divider style={{width: "100%"}}/>

                            <Grid2 item xs={12}>
                                <div>
                                    <Grid2 container spacing={2}>
                                        <Grid2 xs={12} md={4}>

                                            <div className={styles.inputContainer}>
                                                <Typography variant={"h6"} component={"h6"}>
                                                    Camera
                                                </Typography>
                                            </div>
                                        </Grid2>
                                        <Grid2 xs={12} md={8}>
                                            <div className={styles.inputContainer}>
                                                <FormGroup>
                                                    <FormControlLabel control={<IOSSwitch
                                                        disabled={state.temperature.fanEnable==="On"}
                                                        checked={state.temperature.camera.active}
                                                        onChange={() => handleChange({
                                                            ...state,
                                                            temperature: {
                                                                ...state.temperature,
                                                                camera: {
                                                                    ...state.temperature.camera,
                                                                    active: !state.temperature.camera.active
                                                                }
                                                            }
                                                        })}
                                                    />} label={state.temperature.camera.active ? `On` : 'Off'}/>
                                                </FormGroup>
                                            </div>
                                        </Grid2>
                                        <Grid2 item xs={12}>
                                            <div className={styles.inputContainer}>
                                                <Typography variant={'body2'}>
                                                    Temperature
                                                </Typography>
                                                <Slider1
                                                    value={[state.temperature.camera.lowTemperature, state.temperature.camera.highTemperature]}
                                                    min={0}
                                                    step={1}
                                                    max={120}
                                                    onChange={(e) => handleChange({
                                                        ...state,
                                                        temperature: {
                                                            ...state.temperature,
                                                            camera: {
                                                                ...state.temperature.camera,
                                                                lowTemperature: e.target.value[0],
                                                                highTemperature: e.target.value[1]
                                                            }
                                                        }
                                                    })}
                                                    valueLabelDisplay="auto"
                                                    getAriaValueText={valuetext}
                                                    valueLabelFormat={valuetext}
                                                    marks={marks2}
                                                    disabled={!state.temperature.camera.active||state.temperature.fanEnable==="On"}
                                                />
                                            </div>
                                        </Grid2>
                                    </Grid2>

                                </div>

                            </Grid2>
                            <Grid2 xs={12}>
                                <div style={{display: "flex", flexDirection: "row-reverse", margin: 10}}>

                                    <LoadingButton1
                                        type={"button"}
                                        loading={isSending2}
                                        onClick={updateTemperatureSetting}
                                    >
                                        Submit
                                    </LoadingButton1>

                                    {/*<Button color={"error"}>Cancel</Button>*/}
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

export default Environment;