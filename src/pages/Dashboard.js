import React, {useEffect, useRef, useState} from "react";
import {
    Box,
    Card,
    Chip,
    Collapse,
    Dialog,
    ToggleButton,
    ToggleButtonGroup,
    Tooltip,
    Avatar,
    Typography,
    Snackbar,
    InputLabel, MenuItem
} from "@mui/material";
import styles from "../assets/css/dashboard.module.scss";
import Grid2 from "@mui/material/Unstable_Grid2";
import Gauge from "../components/subComponents/Gauge";
import CustomTable from "../components/Table";
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import DataUsageRoundedIcon from '@mui/icons-material/DataUsageRounded';
import ThermostatRoundedIcon from '@mui/icons-material/ThermostatRounded';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import svg1 from "../assets/img/f/1.svg";
import svg2 from "../assets/img/f/2.svg";
import svg3 from "../assets/img/f/3.svg";
import svg4 from "../assets/img/f/4.svg";
import svg5 from "../assets/img/f/5.svg";
import sent from "../assets/img/f/sent.svg";
import buff from "../assets/img/f/buff.svg";
import {ReportApi} from "../utils/ReportApi";
import IranPlate from "../components/plates/IranPlate";
import MotorcyclePlate from "../components/plates/MotorcyclePlate";
import FTZPlate from "../components/plates/FTZPlate";
import BluePlate from "../components/plates/BluePlate";
import TransitPlate from "../components/plates/TransitPlate";
import configs from '../utils/config.json';
import {MonitorApi} from "../utils/MonitorApi";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SpeedIcon from '@mui/icons-material/Speed';
import light from '../assets/img/f/light.svg';
import heavy from '../assets/img/f/heavy.svg';
import ReactPlayer from "react-player";
import MonitorRoundedIcon from '@mui/icons-material/MonitorRounded';
import {LiveApi} from "../utils/LiveApi";
import AuthenticatedImg from "../components/subComponents/AuthenticatedImg";
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import ExpandLessRoundedIcon from '@mui/icons-material/ExpandLessRounded';
import {LogApi} from "../utils/LogApi";
import {Alert} from "@mui/lab";
import TableChartRoundedIcon from '@mui/icons-material/TableChartRounded';
import FormControl1 from "../components/subComponents/FormControl";
import Select1 from "../components/subComponents/Select";

function TabPanel(props) {
    const {children, value, index, ...other} = props;

    return (<div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        style={props.style ? props.style : {}}
        {...other}

    >
        {value === index && (<>
            {children}
        </>)}
    </div>);
}


const Dashboard = (props) => {

    const intervalTime = 1000;
    const [camera,setCamera]=useState(0);
    const [value, setValue] = useState(1);
    const [open, setOpen] = useState(false);
    const [dialogURL, setDialogURL] = useState('');
    const [lastLog, setLastLog] = useState([]);
    const [openLastLogs, setOpenLastLogs] = useState(false);
    const [openDetails, setOpenDetails] = useState({
        usage: false, temperature: false, light: false, board: false, live: false, log: false
    });
    const [rows, setRows] = useState([]);
    const [monitor, setMonitor] = useState({
        cpuUsage: 0,
        ramUsage: 0,
        storageUsage: 0,
        temperature: {environment: 0, camera: 0, cpu: 0},
        light: {inside: 0, outside: 0},
        parameter: {
            p3: {
                v: 0, c: 0
            }, p12: {
                v: 0, c: 0
            }, p7: {
                v: 0, c: 0
            }, ptec: {
                v: 0, c: 0
            }
        }
    });
    const [values, setValues] = useState({
        today: {
            unknown: 0, light: 0, heavy: 0, total: 0, buff: 0, sent: 0

        }, yesterday: {
            unknown: 0, light: 0, heavy: 0, total: 0, buff: 0, sent: 0

        }, week: {
            unknown: 0, light: 0, heavy: 0, total: 0, buff: 0, sent: 0

        }, month: {
            unknown: 0, light: 0, heavy: 0, total: 0, buff: 0, sent: 0
        },

        last: []
    });

    const [info, setInfo] = useState({
        version: "1.0.1", uptime: "00d:00h:00m", lastUpdate: "05/13/2023"
    });
    const ref = useRef();
    const handleChangeOpenDetail = (name) => {
        setOpenDetails({...openDetails, [name]: !openDetails[name]})
    }


    const getLastLogs = async () => {

        const response = ({data}) => {
            setLastLog(data);
            setOpenLastLogs(true);
        }

        const error = (e) => {

        }

        await LogApi.getLast(response, error);
    }


    const handleCloseLastLogsDialog = (event) => {


        setOpenLastLogs(false);
    };

    const levelLog = (level) => {
        switch (level) {
            case 'Info':
                return "success";

            case "Warning":
                return "info"


            case "Error":
                return "warning"


            case "Fatal":
                return "error"

        }
    }
    const handleClickOpen = (url) => {
        setDialogURL(url);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const fetchMonitorData = async () => {
        const response = (result) => {

            setMonitor({
                ...monitor,
                cpuUsage: parseInt(result.data.cpuUsage),
                ramUsage: parseInt(result.data.ramUsage),
                storageUsage: parseInt(result.data.storageUsage),
                temperature: {
                    environment: parseInt(result.data.temperature.environment.original),
                    camera: parseInt(result.data.temperature.camera.original),
                    cpu: parseInt(result.data.temperature.cpu)
                },
                light: {
                    inside: parseInt(result.data.light.inside.original),
                    outside: parseInt(result.data.light.outsideLight.original)
                },
                parameter: {
                    p3: {
                        v: parseFloat(result.data.elec[0].voltage["v3.3"].original),
                        c: parseFloat(result.data.elec[0].current["c3.3"].original)

                    }, p12: {
                        v: parseFloat(result.data.elec[0].voltage.v12.original),
                        c: parseFloat(result.data.elec[0].current.c12.original)
                    }, p7: {
                        v: parseFloat(result.data.elec[0].voltage.v7.original),
                        c: parseFloat(result.data.elec[0].current.c7.original)
                    }, ptec: {
                        v: parseFloat(result.data.elec[0].voltage.vTec.original),
                        c: parseFloat(result.data.elec[0].current.cTec.original)
                    }
                }

            });
        }
        const error = (e) => {
        }
        await MonitorApi.getMonitor(response, error);

    }
    const unmount = () => {
        if (window.interval1) {
            clearInterval(window.interval1);
        }
        if (window.interval3) clearInterval(window.interval3);
    }
    const updateTime = async () => {
        const response = (result) => {
            setInfo({
                ...info, uptime: `${parseInt(result.data.day)}d:${parseInt(result.data.h)}h:${parseInt(result.data.m)}m`
            })
        }

        const error = (e) => {

        }

        await MonitorApi.getUptime(response, error);
    }
    const unmount2 = () => {
        if (window.interval2) clearInterval(window.interval2);
    }

    useEffect(() => {
        (async () => {
            await updateTime();
        })();
        if (!window.interval2) window.interval2 = setInterval(function () {
            (async () => {
                // await CameraApi.getData(response, error);
                await updateTime();

            })();
        }, 60000); else {
            clearInterval(window.interval2);
            window.interval2 = setInterval(function () {
                (async () => {
                    // await CameraApi.getData(response, error);
                    await updateTime();
                })();
            }, 60000);
        }
        return unmount2;
    }, []);

    useEffect(()=>{
        if(openDetails.live){
            (async ()=>{
                ref.current.innerHTML = "3:00"
                await LiveApi.enableCamera(camera,() => {
                    //
                    window.liveURL = `${protocol}//${host}/playlist.m3u8?timestamp=${new Date().getTime()}`;
                }, () => {
                });
            })();
        }
    },[camera])

    useEffect(() => {
        (async () => {
            await update();
        })();
        if (!window.interval1) window.interval1 = setInterval(function () {
            update();
            (async () => {
                // await CameraApi.getData(response, error);
                await fetchMonitorData();
            })();
        }, intervalTime); else {
            clearInterval(window.interval1);
            window.interval1 = setInterval(function () {
                update();
                (async () => {
                    // await CameraApi.getData(response, error);
                    await fetchMonitorData();
                })();
            }, intervalTime);
        }
        return unmount;
    }, []);

    useEffect(() => {
        console.log(monitor);
    }, [monitor]);


    const startVideoTimer = () => {
        window.interval3 = setInterval(function () {
            if (ref.current.innerHTML) {
                let m = parseInt(ref.current.innerHTML.split(":")[0]);
                let s = parseInt(ref.current.innerHTML.split(":")[1]);
                if (s > 0) s--;
                if (s === 0 && m !== 0) {
                    s = 60;
                    s--;
                    m--;
                } else if ((s === 0 && m === 0)) {
                    clearInterval(window.interval3);
                }
                ref.current.innerHTML = `${m}:${s < 10 ? `0${s}` : s}`
            } else {
                let m = 3;
                let s = 0;
                ref.current.innerHTML = `${m}:${s < 10 ? `0${s}` : s}`
            }

        }, 1000);
    }

    const update = () => {

        const response = (result) => {
            setRows(result.data.last);
            setValues(result.data);
        }

        const error = (e) => {

        }

        (async () => {
            // await CameraApi.getData(response, error);
            // await fetchMonitorData();

            await ReportApi.getRoutineReport(response, error);
        })();
    }
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };


    const children = [<ToggleButton value={1} key={1} style={{fontSize: "0.6rem", fontWeight: "bold"}}>
        Today
    </ToggleButton>, <ToggleButton value={2} key={2} style={{fontSize: "0.6rem", fontWeight: "bold"}}>
        Yesterday
    </ToggleButton>, <ToggleButton value={3} key={3} style={{fontSize: "0.6rem", fontWeight: "bold"}}>
        Last Week
    </ToggleButton>, <ToggleButton value={4} key={4} style={{fontSize: "0.6rem", fontWeight: "bold"}}>
        Last Month
    </ToggleButton>,];

    const control = {
        value: value, onChange: handleChange, exclusive: true,
    };

    const {
        host, hostname, href, origin, pathname, port, protocol
    } = window.location;


    return <div style={{position: "relative", height: "100%"}}>
        <Dialog onClose={handleClose} open={open} maxWidth={'sm'} fullWidth>
            <img src={dialogURL} alt={""} style={{width: "100%"}}/>
        </Dialog>
        <Grid2 container spacing={2} style={{minHeight: "100%"}}>

            <Grid2 item container spacing={2} xs={12} md={9}
                   style={{display: "flex", flexDirection: "column", justifyContent: "start"}}>
                <Grid2 item xs={12}>
                    <Card elevation={3} className={styles.card}>
                        <div style={{display: "flex", alignItems: "center", cursor: "pointer"}} >
                            {/*<img src={voltageLogo} alt={""} style={{width: 30}}/>*/}
                            <Tooltip title={"LiveStream"}>
                                <MonitorRoundedIcon style={{color: "#5a5a5a", margin: 10}} onClick={e => {
                                    handleChangeOpenDetail("live")
                                }}/>
                            </Tooltip>
                            <div style={{display: "flex", width: "calc(100% - 120px)"}}>
                                <Typography variant={"caption"} onClick={e => {
                                    handleChangeOpenDetail("live")
                                }}
                                            style={{fontSize: "0.68rem", flexGrow: 5, alignSelf: "center"}}>
                                    Live Stream
                                </Typography>

                                {openDetails.live &&<div style={{display:"flex",flexDirection:"row"}}>
                                    <Typography variant={"caption"} style={{flexGrow: 1, alignSelf: "center"}}
                                                ref={ref}>
                                        3:00
                                    </Typography>

                                    <div style={{width: 120,marginLeft:10,marginRight:10}}>
                                        <FormControl1 className={'trs'}>
                                            <InputLabel id="demo-simple-select-label"></InputLabel>
                                            <Select1
                                                labelId="demo-simple-select-label"
                                                id="trs"
                                                value={camera}
                                                label=""
                                                onChange={(event) => {
                                                    setCamera(event.target.value);

                                                }}

                                            >
                                                <MenuItem value={0}>Camera 1</MenuItem>
                                                <MenuItem value={1}>Camera 2</MenuItem>
                                            </Select1>
                                        </FormControl1>
                                    </div>


                                </div>


                                }
                                <div>
                                    {openDetails.live ? <ExpandLessRoundedIcon/> : <ExpandMoreRoundedIcon/>}
                                </div>
                            </div>
                        </div>
                        <Collapse in={openDetails.live} mountOnEnter unmountOnExit onEnter={() => {
                            (async () => {
                                ref.current.innerHTML = "3:00"
                                await LiveApi.enableCamera(camera,() => {
                                    //
                                    window.liveURL = `${protocol}//${host}/playlist.m3u8?timestamp=${new Date().getTime()}`;
                                }, () => {
                                });
                            })();
                        }} onExit={() => {
                            if (window.interval3) clearInterval(window.interval3);
                        }}>
                            <div style={{display: "flex", justifyContent: "center"}}>
                                <ReactPlayer url={window.liveURL} width={"100%"} height={400}
                                             controls onPlay={() => {
                                }} onPause={() => {
                                    clearInterval(window.interval3);
                                }}
                                             onStart={() => {
                                                 startVideoTimer();

                                             }}
                                             style={{maxWidth: 750}}/>

                            </div>
                        </Collapse>
                    </Card>

                </Grid2>
                <Grid2 item xs={12}>
                    <Card elevation={3} className={styles.card} style={{minHeight: 500}}>
                        <div style={{display: "flex", alignItems: "center", cursor: "pointer"}}>
                            {/*<img src={voltageLogo} alt={""} style={{width: 30}}/>*/}
                            <Tooltip title={"Last Records"}>
                                <TableChartRoundedIcon style={{color: "#5a5a5a", margin: 10}}/>
                            </Tooltip>
                            <div style={{display: "flex", width: "calc(100% - 44px)"}}>
                                <Typography variant={"caption"}
                                            style={{fontSize: "0.68rem", flexGrow: 5, alignSelf: "center"}}>
                                    Last Records
                                </Typography>

                            </div>
                        </div>

                        <Report rows={rows} click={handleClickOpen}/>
                    </Card>
                </Grid2>

            </Grid2>
            <Grid2 item xs={12} md={3}>
                <div>
                    <Grid2 container xs={12} spacing={2}>
                        <Grid2 item xs={12}>
                            <div style={{display: "flex", justifyContent: "center"}}>
                                <ToggleButtonGroup size="small" {...control} aria-label="Small sizes"
                                                   style={{height: 30}}>
                                    {children}
                                </ToggleButtonGroup>
                            </div>
                            <div>
                                <Grid2 container>
                                    <Grid2 item xs={6} style={{position: "relative", padding: 0}}>
                                        <Typography variant={"body2"} component={"p"} style={{
                                            color: "#fff",
                                            position: "absolute",
                                            top: "15%",
                                            left: "8%",
                                            fontWeight: "bold"
                                        }}>
                                            Total
                                        </Typography>
                                        <div style={{position: "absolute", top: "40%", left: "20%"}}>
                                            <TabPanel value={value} index={1}>
                                                <Typography variant={"h6"} component={"h6"} style={{color: "#fff"}}>
                                                    {values.today.total}
                                                </Typography>
                                            </TabPanel>
                                            <TabPanel value={value} index={2}>
                                                <Typography variant={"h6"} component={"h6"} style={{color: "#fff"}}>
                                                    {values.yesterday.total}

                                                </Typography>
                                            </TabPanel>
                                            <TabPanel value={value} index={3}>
                                                <Typography variant={"h6"} component={"h6"} style={{color: "#fff"}}>
                                                    {values.week.total}

                                                </Typography>
                                            </TabPanel>

                                            <TabPanel value={value} index={4}>
                                                <Typography variant={"h6"} component={"h6"} style={{color: "#fff"}}>
                                                    {values.month.total}
                                                </Typography>
                                            </TabPanel>
                                        </div>
                                        <img src={svg3} alt={""} style={{width: "100%"}}/>
                                    </Grid2>

                                    <Grid2 item xs={6} style={{position: "relative", padding: 0}}>
                                        <Typography variant={"body2"} component={"p"} style={{
                                            color: "#fff",
                                            position: "absolute",
                                            top: "15%",
                                            left: "8%",
                                            fontWeight: "bold"
                                        }}>
                                            Heavy
                                        </Typography>

                                        <div style={{position: "absolute", top: "40%", left: "20%"}}>
                                            <TabPanel value={value} index={1}>
                                                <Typography variant={"h6"} component={"h6"} style={{color: "#fff"}}>
                                                    {values.today.heavy}
                                                </Typography>
                                            </TabPanel>
                                            <TabPanel value={value} index={2}>
                                                <Typography variant={"h6"} component={"h6"} style={{color: "#fff"}}>
                                                    {values.yesterday.heavy}
                                                </Typography>
                                            </TabPanel>
                                            <TabPanel value={value} index={3}>
                                                <Typography variant={"h6"} component={"h6"} style={{color: "#fff"}}>
                                                    {values.week.heavy}
                                                </Typography>
                                            </TabPanel>

                                            <TabPanel value={value} index={4}>
                                                <Typography variant={"h6"} component={"h6"} style={{color: "#fff"}}>
                                                    {values.month.heavy}
                                                </Typography>
                                            </TabPanel>
                                        </div>
                                        <img src={svg2} alt={""} style={{width: "100%"}}/>
                                    </Grid2>

                                    <Grid2 item xs={6} style={{position: "relative", padding: 0}}>
                                        <Typography variant={"body2"} component={"p"} style={{
                                            color: "#fff",
                                            position: "absolute",
                                            top: "15%",
                                            left: "8%",
                                            fontWeight: "bold"
                                        }}>
                                            Light
                                        </Typography>

                                        <div style={{position: "absolute", top: "40%", left: "20%"}}>
                                            <TabPanel value={value} index={1}>
                                                <Typography variant={"h6"} component={"h6"} style={{color: "#fff"}}>
                                                    {values.today.light}
                                                </Typography>
                                            </TabPanel>
                                            <TabPanel value={value} index={2}>
                                                <Typography variant={"h6"} component={"h6"} style={{color: "#fff"}}>
                                                    {values.yesterday.light}
                                                </Typography>
                                            </TabPanel>
                                            <TabPanel value={value} index={3}>
                                                <Typography variant={"h6"} component={"h6"} style={{color: "#fff"}}>
                                                    {values.week.light}
                                                </Typography>
                                            </TabPanel>

                                            <TabPanel value={value} index={4}>
                                                <Typography variant={"h6"} component={"h6"} style={{color: "#fff"}}>
                                                    {values.month.light}
                                                </Typography>
                                            </TabPanel>
                                        </div>
                                        <img src={svg4} alt={""} style={{width: "100%"}}/>
                                    </Grid2>

                                    <Grid2 item xs={6} style={{position: "relative", padding: 0}}>
                                        <Typography variant={"body2"} component={"p"} style={{
                                            color: "#fff",
                                            position: "absolute",
                                            top: "15%",
                                            left: "8%",
                                            fontWeight: "bold"
                                        }}>
                                            Unknown
                                        </Typography>

                                        <div style={{position: "absolute", top: "40%", left: "20%"}}>
                                            <TabPanel value={value} index={1}>
                                                <Typography variant={"h6"} component={"h6"} style={{color: "#fff"}}>
                                                    {values.today.unknown}
                                                </Typography>
                                            </TabPanel>
                                            <TabPanel value={value} index={2}>
                                                <Typography variant={"h6"} component={"h6"} style={{color: "#fff"}}>
                                                    {values.yesterday.unknown}
                                                </Typography>
                                            </TabPanel>
                                            <TabPanel value={value} index={3}>
                                                <Typography variant={"h6"} component={"h6"} style={{color: "#fff"}}>
                                                    {values.week.unknown}
                                                </Typography>
                                            </TabPanel>

                                            <TabPanel value={value} index={4}>
                                                <Typography variant={"h6"} component={"h6"} style={{color: "#fff"}}>
                                                    {values.month.unknown}
                                                </Typography>
                                            </TabPanel>
                                        </div>
                                        <img src={svg1} alt={""} style={{width: "100%"}}/>
                                    </Grid2>
                                    <Grid2 item xs={6} style={{position: "relative", padding: 0}}>
                                        <Typography variant={"body2"} component={"p"} style={{
                                            color: "#fff",
                                            position: "absolute",
                                            top: "15%",
                                            left: "8%",
                                            fontWeight: "bold"
                                        }}>
                                            Sent
                                        </Typography>

                                        <div style={{position: "absolute", top: "40%", left: "20%"}}>
                                            <TabPanel value={value} index={1}>
                                                <Typography variant={"h6"} component={"h6"} style={{color: "#fff"}}>
                                                    {values.today.sent}
                                                </Typography>
                                            </TabPanel>
                                            <TabPanel value={value} index={2}>
                                                <Typography variant={"h6"} component={"h6"} style={{color: "#fff"}}>
                                                    {values.yesterday.sent}
                                                </Typography>
                                            </TabPanel>
                                            <TabPanel value={value} index={3}>
                                                <Typography variant={"h6"} component={"h6"} style={{color: "#fff"}}>
                                                    {values.week.sent}
                                                </Typography>
                                            </TabPanel>

                                            <TabPanel value={value} index={4}>
                                                <Typography variant={"h6"} component={"h6"} style={{color: "#fff"}}>
                                                    {values.month.sent}
                                                </Typography>
                                            </TabPanel>
                                        </div>
                                        <img src={sent} alt={""} style={{width: "100%"}}/>
                                    </Grid2>
                                    <Grid2 item xs={6} style={{position: "relative", padding: 0}}>
                                        <Typography variant={"body2"} component={"p"} style={{
                                            color: "#fff",
                                            position: "absolute",
                                            top: "15%",
                                            left: "8%",
                                            fontWeight: "bold"
                                        }}>
                                            Unsent
                                        </Typography>

                                        <div style={{position: "absolute", top: "40%", left: "20%"}}>
                                            <TabPanel value={value} index={1}>
                                                <Typography variant={"h6"} component={"h6"} style={{color: "#fff"}}>
                                                    {values.today.buff}
                                                </Typography>
                                            </TabPanel>
                                            <TabPanel value={value} index={2}>
                                                <Typography variant={"h6"} component={"h6"} style={{color: "#fff"}}>
                                                    {values.yesterday.buff}
                                                </Typography>
                                            </TabPanel>
                                            <TabPanel value={value} index={3}>
                                                <Typography variant={"h6"} component={"h6"} style={{color: "#fff"}}>
                                                    {values.week.buff}
                                                </Typography>
                                            </TabPanel>

                                            <TabPanel value={value} index={4}>
                                                <Typography variant={"h6"} component={"h6"} style={{color: "#fff"}}>
                                                    {values.month.buff}
                                                </Typography>
                                            </TabPanel>
                                        </div>
                                        <img src={buff} alt={""} style={{width: "100%"}}/>
                                    </Grid2>

                                </Grid2>

                            </div>
                        </Grid2>
                        <Grid2 item xs={12}>
                            <Card elevation={3} className={styles.card}>
                                <div style={{display: "flex", alignItems: "center", cursor: "pointer"}} onClick={e => {
                                    handleChangeOpenDetail("usage")
                                }}>
                                    {/*<img src={usageLogo} alt={""} style={{width: 30}}/>*/}
                                    <Tooltip title={"Usage"}>
                                        <DataUsageRoundedIcon style={{color: "#5a5a5a", margin: 10}}/>
                                    </Tooltip>
                                    {!openDetails.usage ? <div style={{display: "flex"}}>
                                        <Typography variant={"caption"} style={{fontSize: "0.68rem"}}>
                                            <span style={{fontWeight: "bold"}}>CPU</span>: {monitor.cpuUsage}%
                                            , <span style={{fontWeight: "bold"}}>RAM</span>: {monitor.ramUsage}%
                                            , <span style={{fontWeight: "bold"}}>SSD</span>: {monitor.storageUsage}%
                                        </Typography>
                                    </div> : <Typography variant={"caption"}
                                                         style={{fontSize: "0.68rem"}}>Usage</Typography>}
                                </div>
                                <Collapse in={openDetails.usage}>

                                    <Grid2 container>

                                        <Grid2 item xs={12} md={4}>
                                            <Gauge value={monitor.cpuUsage} unit={"%"} minValue={0} maxValue={100}
                                                   title={"CPU"}/>

                                        </Grid2>
                                        <Grid2 item xs={12} md={4}>
                                            <Gauge value={monitor.ramUsage} unit={"%"} minValue={0} maxValue={100}
                                                   title={"RAM"}/>
                                        </Grid2>
                                        <Grid2 item xs={12} md={4}>
                                            <Gauge value={monitor.storageUsage} unit={"%"} minValue={0} maxValue={100}
                                                   title={"SSD"}/>
                                        </Grid2>

                                    </Grid2>
                                </Collapse>
                            </Card>
                        </Grid2>
                        <Grid2 item xs={12}>
                            <Card elevation={3} className={styles.card}>
                                <div style={{display: "flex", alignItems: "center", cursor: "pointer"}} onClick={e => {
                                    handleChangeOpenDetail("temperature")
                                }}>
                                    {/*<img src={temperature} alt={""} style={{width: 30}}/>*/}


                                    <Tooltip title={"Temperature"}>
                                        <ThermostatRoundedIcon style={{color: "#5a5a5a", margin: 10}}/>
                                    </Tooltip>
                                    {!openDetails.temperature ? <div style={{display: "flex"}}>
                                        <Typography variant={"caption"} style={{fontSize: "0.68rem"}}>
                                        <span
                                            style={{fontWeight: "bold"}}>CPU</span>: {monitor.temperature.cpu}<>&#8451;</>
                                            , <span
                                            style={{fontWeight: "bold"}}>Camera</span>: {monitor.temperature.camera}<>&#8451;</>
                                            , <span
                                            style={{fontWeight: "bold"}}>Environment</span>: {monitor.temperature.environment}<>&#8451;</>
                                        </Typography>
                                    </div> : <Typography variant={"caption"}
                                                         style={{fontSize: "0.68rem"}}>Temperature</Typography>}


                                </div>

                                <Collapse in={openDetails.temperature}>
                                    <Grid2 container>
                                        <Grid2 item xs={12} md={4}>
                                            <Gauge value={monitor.temperature.cpu} unit={<>&#8451;</>} minValue={0}
                                                   maxValue={100}
                                                   title={"CPU"}/>

                                        </Grid2>
                                        <Grid2 item xs={12} md={4}>
                                            <Gauge value={monitor.temperature.camera} unit={<>&#8451;</>} minValue={0}
                                                   maxValue={100}
                                                   title={"Camera"}/>
                                        </Grid2>
                                        <Grid2 item xs={12} md={4}>
                                            <Gauge value={monitor.temperature.environment} unit={<>&#8451;</>}
                                                   minValue={0}
                                                   maxValue={100}
                                                   title={"Environment"}/>
                                        </Grid2>
                                    </Grid2>


                                </Collapse>


                            </Card>
                        </Grid2>
                        <Grid2 item xs={12}>
                            <Card elevation={3} className={styles.card}>
                                <div style={{display: "flex", alignItems: "center", cursor: "pointer"}} onClick={e => {
                                    handleChangeOpenDetail("light")
                                }}>
                                    {/*<img src={lightLogo} alt={""} style={{width: 30}}/>*/}
                                    <Tooltip title={"Light"}>
                                        <LightModeRoundedIcon style={{color: "#5a5a5a", margin: 10}}/>
                                    </Tooltip>
                                    {!openDetails.light ? <div style={{display: "flex"}}>
                                        <Typography variant={"caption"} style={{fontSize: "0.68rem"}}>
                                        <span
                                            style={{fontWeight: "bold"}}>Environment</span>: {monitor.light.outside ? monitor.light.outside : 0}
                                            , <span
                                            style={{fontWeight: "bold"}}>Inside</span>:{monitor.light.inside ? monitor.light.inside : 0}
                                        </Typography>
                                    </div> : <Typography variant={"caption"}
                                                         style={{fontSize: "0.68rem"}}>Light</Typography>}
                                </div>
                                <Collapse in={openDetails.light}>
                                    <Grid2 container>
                                        <Grid2 item xs={6} style={{position: "relative", padding: 0}}>
                                            <div style={{
                                                position: "absolute",
                                                top: 0,
                                                bottom: 0,
                                                left: 0,
                                                right: 0,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                margin: 5
                                            }}>
                                                <Typography variant={"caption"} component={"p"}
                                                            style={{
                                                                color: "#fff", fontWeight: "bold", fontSize: "0.55rem"
                                                            }}>
                                                    Environment:
                                                </Typography>

                                                <Typography variant={"body2"} component={"p"}
                                                            style={{
                                                                color: "#fff",
                                                                fontWeight: "bold",
                                                                marginLeft: 5,
                                                                fontSize: "0.6rem"
                                                            }}>
                                                    {monitor.light.outside ? monitor.light.outside : 0}
                                                </Typography>
                                            </div>
                                            <img src={svg5} alt={""} style={{width: "100%"}}/>
                                        </Grid2>
                                        <Grid2 item xs={6} style={{position: "relative", padding: 0}}>
                                            <div style={{
                                                position: "absolute",
                                                top: 0,
                                                bottom: 0,
                                                left: 0,
                                                right: 0,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                margin: 5
                                            }}>
                                                <Typography variant={"caption"} component={"p"}
                                                            style={{
                                                                color: "#fff", fontWeight: "bold", fontSize: "0.55rem"
                                                            }}>
                                                    Inside:
                                                </Typography>

                                                <Typography variant={"body2"} component={"p"}
                                                            style={{
                                                                color: "#fff",
                                                                fontWeight: "bold",
                                                                marginLeft: 5,
                                                                fontSize: "0.6rem"
                                                            }}>
                                                    {monitor.light.inside ? monitor.light.inside : 0}
                                                </Typography>
                                            </div>
                                            <img src={svg5} alt={""} style={{width: "100%"}}/>
                                        </Grid2>


                                    </Grid2>
                                </Collapse>
                            </Card>
                        </Grid2>
                        <Grid2 item xs={12}>
                            <Card elevation={3} className={styles.card}>
                                <div style={{display: "flex", alignItems: "center", cursor: "pointer"}} onClick={e => {
                                    handleChangeOpenDetail("board")
                                }}>
                                    {/*<img src={voltageLogo} alt={""} style={{width: 30}}/>*/}
                                    <Tooltip title={"Board"}>
                                        <BoltRoundedIcon style={{color: "#5a5a5a", margin: 10}}/>
                                    </Tooltip>
                                    {!openDetails.board ? <div style={{display: "flex"}}>
                                        <Typography variant={"caption"} style={{fontSize: "0.68rem"}}>
                                            <span style={{fontWeight: "bold"}}>v(3.3)</span>: {monitor.parameter.p7.v}
                                            ,<span style={{fontWeight: "bold"}}> v(7.0)</span>: {monitor.parameter.p3.v}
                                            , <span
                                            style={{fontWeight: "bold"}}>v(12.0)</span>:{monitor.parameter.p12.v}
                                        </Typography>
                                    </div> : <Typography variant={"caption"} style={{fontSize: "0.68rem"}}>Control
                                        Board</Typography>}
                                </div>
                                <Collapse in={openDetails.board}>
                                    <Grid2 container style={{justifyContent: "center"}}>
                                        <Grid2 item xs={6} style={{position: "relative", padding: 0}}>
                                            <div style={{
                                                position: "absolute",
                                                top: 0,
                                                bottom: 0,
                                                left: 0,
                                                right: 0,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                margin: 5
                                            }}>
                                                <Typography variant={"caption"} component={"p"}
                                                            style={{
                                                                color: "#fff", fontWeight: "bold", fontSize: "0.55rem"
                                                            }}>
                                                    V(3.3):
                                                </Typography>

                                                <Typography variant={"subtitle2"} component={"p"}
                                                            style={{
                                                                color: "#fff",
                                                                fontWeight: "bold",
                                                                marginLeft: 5,
                                                                fontSize: "0.6rem"
                                                            }}>
                                                    {monitor.parameter.p7.v} (V)-{monitor.parameter.p7.c} (A)

                                                </Typography>
                                            </div>
                                            <img src={svg5} alt={""} style={{width: "100%"}}/>
                                        </Grid2>

                                        <Grid2 item xs={6} style={{position: "relative", padding: 0}}>
                                            <div style={{
                                                position: "absolute",
                                                top: 0,
                                                bottom: 0,
                                                left: 0,
                                                right: 0,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                margin: 5
                                            }}>
                                                <Typography variant={"caption"} component={"p"}
                                                            style={{
                                                                color: "#fff", fontWeight: "bold", fontSize: "0.55rem"
                                                            }}>
                                                    V(12.0):
                                                </Typography>

                                                <Typography variant={"body2"} component={"p"}
                                                            style={{
                                                                color: "#fff",
                                                                fontWeight: "bold",
                                                                marginLeft: 5,
                                                                fontSize: "0.6rem"
                                                            }}>
                                                    {monitor.parameter.p12.v} (V)-{monitor.parameter.p12.c} (A)
                                                </Typography>
                                            </div>
                                            <img src={svg5} alt={""} style={{width: "100%"}}/>
                                        </Grid2>

                                        <Grid2 item xs={6} style={{position: "relative", padding: 0}}>
                                            <div style={{
                                                position: "absolute",
                                                top: 0,
                                                bottom: 0,
                                                left: 0,
                                                right: 0,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                margin: 5
                                            }}>
                                                <Typography variant={"caption"} component={"p"}
                                                            style={{
                                                                color: "#fff", fontWeight: "bold", fontSize: "0.55rem"
                                                            }}>
                                                    V(7.0):
                                                </Typography>

                                                <Typography variant={"body2"} component={"p"}
                                                            style={{
                                                                color: "#fff",
                                                                fontWeight: "bold",
                                                                marginLeft: 5,
                                                                fontSize: "0.6rem"
                                                            }}>
                                                    {monitor.parameter.p3.v} (V)-{monitor.parameter.p3.c} (A)

                                                </Typography>
                                            </div>
                                            <img src={svg5} alt={""} style={{width: "100%"}}/>
                                        </Grid2>
                                        <Grid2 item xs={6} style={{position: "relative", padding: 0}}>
                                            <div style={{
                                                position: "absolute",
                                                top: 0,
                                                bottom: 0,
                                                left: 0,
                                                right: 0,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                margin: 5
                                            }}>
                                                <Typography variant={"caption"} component={"p"}
                                                            style={{
                                                                color: "#fff", fontWeight: "bold", fontSize: "0.55rem"
                                                            }}>
                                                    V/C(MB):
                                                </Typography>

                                                <Typography variant={"body2"} component={"p"}
                                                            style={{
                                                                color: "#fff",
                                                                fontWeight: "bold",
                                                                marginLeft: 5,
                                                                fontSize: "0.6rem"
                                                            }}>
                                                    {monitor.parameter.ptec.v} (V)-{monitor.parameter.ptec.c} (A)

                                                </Typography>
                                            </div>
                                            <img src={svg5} alt={""} style={{width: "100%"}}/>
                                        </Grid2>
                                    </Grid2>
                                </Collapse>
                            </Card>

                        </Grid2>

                    </Grid2>

                </div>
            </Grid2>


        </Grid2>

        <footer style={{bottom: 0, width: "100%", marginTop: 20}}>
            <div style={{maxWidth: 1000, width: "100%", display: "flex", justifyContent: "center"}}>
                <Typography variant={"caption"}
                            style={{textAlign: "center", marginRight: 15, color: "#000"}}>
                    Software Version {info.version}
                </Typography>
                <Typography variant={"caption"}
                            style={{textAlign: "center", marginRight: 15, color: "#000"}}>
                    Last Update {info.lastUpdate}
                </Typography>
                <Typography variant={"caption"} style={{textAlign: "center", color: "#000"}}>
                    Up Time {info.uptime}
                </Typography>
            </div>
        </footer>

        <Snackbar open={false} autoHideDuration={6000} onClose={handleCloseLastLogsDialog}>
            {lastLog.map(item => <Alert onClose={handleCloseLastLogsDialog} severity={levelLog(item.level)}
                                        sx={{width: '100%'}}>
                {item.msg}
            </Alert>)}

        </Snackbar>
    </div>
};
export default Dashboard;

const Report = (props) => {

    useEffect(() => {

        let a = document.getElementsByClassName('category-chip');
        let d = document.getElementsByClassName('direction-chip');
        let t = document.getElementsByClassName('time-chip');
        // console.log(a);

        for (let i = 0; i < a.length; i++) {
            if (a[i].parentElement.childNodes.length > 1) {
                a[i].parentElement.childNodes[1].remove();
            }
            a[i].style.marginLeft = 0;
            a[i].style.marginRight = 0;
            a[i].style.padding = "5px";
        }
        for (let i = 0; i < d.length; i++) {
            if (d[i].childNodes.length > 1) {
                d[i].childNodes[1].remove();
            }
            d[i].childNodes[0].style.marginLeft = 0;
            d[i].childNodes[0].style.marginRight = 0;
        }
        for (let i = 0; i < t.length; i++) {
            if (t[i].childNodes.length > 1) {
                t[i].childNodes[1].style.width = "calc(100% - 28px)";
            }
            t[i].style.justifyContent = 'start';
        }


    }, [props])

    const headers = [{
        field: 'title',
        title: 'Info',
        width: 120,
        renderCell: (row) => (<div style={{display: "block", width: "100%", textAlign: "center"}}>

            <div style={{display: "flex", justifyContent: "center"}}>
                <div style={{margin: 2, width: "100%"}}>
                    <Tooltip title={"Time"}>
                        <Chip icon={<AccessTimeIcon/>} label={<pre>{row.captureTime.replace(" ", "    ")}</pre>}
                              variant="outlined" style={{width: "100%"}} className={'time-chip'}/>
                    </Tooltip>
                </div>

            </div>
            <div style={{display: "flex", justifyContent: "center"}}>
                <div style={{margin: 2, flexGrow: 1}}>
                    <Tooltip title={"Speed"}>
                        <Chip icon={<SpeedIcon/>} label={`${row.vehicleSpeed} Km/H`} variant="outlined"/>
                    </Tooltip>
                </div>
                <div style={{margin: 2, flexGrow: 1}}>
                    <Tooltip title={"Lane"}>
                        <Chip label={`${row.vehicleLane}`} variant="outlined"/>
                    </Tooltip>
                </div>
                <div style={{margin: 2, flexGrow: 1}}>
                    <Tooltip title={"Category"}>

                        <Chip avatar={<Avatar alt="" src={row.vehicleCategory === 'light' ? light : heavy}
                                              className={'category-chip'}/>}
                              label={``} variant="outlined"/>
                    </Tooltip>
                </div>
                <div style={{margin: 2, flexGrow: 1}}>
                    <Tooltip title={"Direction"}>

                        <Chip icon={row.vehicleDirection === "up" ? <ArrowUpwardIcon/> : <ArrowDownwardIcon/>}
                              className={'direction-chip'}
                              label={``} variant="outlined"/>
                    </Tooltip>
                </div>
            </div>
        </div>)
    }, {
        field: 'title', title: 'Plate', width: 245, renderCell: (row) => (<div style={{
            width: "100%", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center"
        }}>


            <AuthenticatedImg url={`${configs.server.Api}/${configs.getImages}/${row.plateImage}`}
                              style={{width: 188, height: 50, cursor: "pointer", maxWidth: 245}}
                              onClick={props.click}/>

            {row.plateType === "iran" ? (row.vehicleClass === "motorcycle" ? <MotorcyclePlate disabled value={{
                no1: row.plateNumber.substring(0, 1),
                no2: row.plateNumber.substring(1, 2),
                no3: row.plateNumber.substring(2, 3),
                no4: row.plateNumber.substring(3, 4),
                no5: row.plateNumber.substring(4, 5),
                no6: row.plateNumber.substring(5, 6),
                no7: row.plateNumber.substring(6, 7),
                no8: row.plateNumber.substring(7)
            }}/> : <IranPlate value={{
                no1: row.plateNumber.substring(0, 1),
                no2: row.plateNumber.substring(1, 2),
                letter: row.plateNumber.substring(2, 4),
                no3: row.plateNumber.substring(4, 5),
                no4: row.plateNumber.substring(5, 6),
                no5: row.plateNumber.substring(6, 7),
                no6: row.plateNumber.substring(7, 8),
                no7: row.plateNumber.substring(8)
            }} handleChange={() => {
            }} disabled/>) : row.plateType === "ftz" ? <FTZPlate disabled value={{
                no1: row.plateNumber.substring(0, 1),
                no2: row.plateNumber.substring(1, 2),
                no3: row.plateNumber.substring(2, 3),
                no4: row.plateNumber.substring(3, 4),
                no5: row.plateNumber.substring(4, 5),
                no6: row.plateNumber.substring(5, 6),
                no7: row.plateNumber.substring(6)
            }}/> : (row.plateType === "blue" ?

                <BluePlate value={{
                    no1: row.plateNumber.substring(0, 1),
                    no2: row.plateNumber.substring(1, 2),
                    letter: row.plateNumber.substring(2, 4),
                    no3: row.plateNumber.substring(4, 5),
                    no4: row.plateNumber.substring(5, 6),
                    no5: row.plateNumber.substring(6, 7),
                    no6: row.plateNumber.substring(7, 8),
                    no7: row.plateNumber.substring(8)
                }} disabled/> : <TransitPlate value={{
                    no1: row.plateNumber.substring(0, 1),
                    no2: row.plateNumber.substring(1, 2),
                    letter: row.plateNumber.substring(2, 4),
                    no3: row.plateNumber.substring(4, 5),
                    no4: row.plateNumber.substring(5, 6),
                    no5: row.plateNumber.substring(6, 7),
                    no6: row.plateNumber.substring(7, 8),
                    no7: row.plateNumber.substring(8)
                }} disabled/>)}
        </div>),
    }, {
        field: 'title',
        title: 'Car Image',
        width: 180,
        renderCell: (row) => (<div style={{display: "block", width: "100%", textAlign: "center"}}>
            <AuthenticatedImg url={`${configs.server.Api}/${configs.getImages}/${row.vehicleImage}`}
                              style={{width: 188, height: 85, cursor: "pointer", maxWidth: 245}}
                              onClick={props.click}/>
        </div>),
    },

    ];


    return <>
        <Box sx={{flexGrow: 1, bgcolor: 'background.paper', display: 'flex'}} style={{width: "100%"}}>
            <CustomTable headers={headers} rows={props.rows} loading={false} bottom={0} overflowY={"auto"} fullWidth
                         hasTitle containerStyle={{display: "flex", justifyContent: "center"}}/>
        </Box>
    </>

}