import React, {useEffect, useState} from "react";
import {
    Avatar,
    Box,
    Card, Chip, Collapse,
    Container, Dialog, DialogActions, DialogContent, DialogTitle,
    FormControlLabel, FormGroup, FormLabel, IconButton, InputLabel, MenuItem,
    Snackbar, Tooltip,
    Typography
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import {Alert} from "@mui/lab";
import FormControl1 from "../components/subComponents/FormControl";
import LoadingButton1 from "../components/subComponents/LoadingButton";
import Slider1 from "../components/subComponents/Slider";
import CheckBox1 from "../components/subComponents/CheckBox";
import {AutoComplete1} from "../components/subComponents/AutoComplete";
import {ReportApi} from "../utils/ReportApi";
import CustomTable from "../components/Table";
import {TextField} from "../components/subComponents/TextField";
import {DatePicker, DateField, TimeField} from "@mui/x-date-pickers";
import {CameraApi} from "../utils/CameraApi";
import configs from '../utils/config.json';
import IranPlate from "../components/plates/IranPlate";
import MotorcyclePlate from "../components/plates/MotorcyclePlate";
import TransitPlate from "../components/plates/TransitPlate";
import FTZPlate from "../components/plates/FTZPlate";
import BluePlate from "../components/plates/BluePlate";
import Pagination from "../components/subComponents/Pagination";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import SaveIcon from '@mui/icons-material/Save';
import {ProvinceApi} from "../utils/ProvinceApi";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SpeedIcon from "@mui/icons-material/Speed";
import light from "../assets/img/f/light.svg";
import heavy from "../assets/img/f/heavy.svg";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import AuthenticatedImg from "../components/subComponents/AuthenticatedImg";
import Select1 from "../components/subComponents/Select";
import ViewKanbanRoundedIcon from '@mui/icons-material/ViewKanbanRounded';
import {AdapterDateFnsJalali} from '@mui/x-date-pickers/AdapterDateFnsJalali';
import Button2 from "../components/subComponents/Button2";
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import Button4 from "../components/subComponents/Button4";
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded';
import {SendApi} from "../utils/SendApi";

const persianLetters = ["none", "الف", "ب", "پ", "ت", "ث", "ج", "چ", "ح", "خ", "د", "ذ", "ر", "ز", "ژ", "س", "ش", "ص", "ض", "ط", "ظ", "ع", "غ", "ف", "ق", "ک", "گ", "ل", "م", "ن", "و", "ه", "ی"];
const englishLetters = ["none", 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'W', 'X', 'Y', 'Z'];

const TrafficReport = (props) => {
    const [isGetting, setIsGetting] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [open, setOpen] = useState(false);
    const [rows, setRows] = useState([]);
    const [count, setCount] = useState(0);
    const [cameras, setCameras] = useState([]);
    const [page, setPage] = useState(1);
    const [provinces, setProvinces] = useState([]);
    const [openBar, setOpenBar] = useState({
        time: false,
        province: false,
        plate: false,
        export: false,
        lane: false,
        vehicleType: false,
        direction: false,
        aggregate: false,
        speed: false,
        accuracy: false,
        purification: false
    })
    const initialValue = {
        startDate: null,
        endDate: null,
        direction: null,
        purificationNo: 0,
        purificationTime: 0,
        lane: {
            lane1: false,
            lane2: false,
            lane3: false,
            lane4: false,
            lane5: false,
            lane6: false,
            lane7: false,
            lane8: false
        },
        cameras: [],
        province: [],
        province1: [],
        startSpeed: 0,
        endSpeed: 300,
        type: null,
        plateLowAccuracy: 0,
        plateHighAccuracy: 100,
        plateStatus: false,
        offset: null,
        count: null,
        export: {
            csv: false,
            html: false,
            pdf: false
        },
        columns: {
            plateImage: true,
            vehicleImage: true,
            plateNumber: true,
            vehicleSpeed: true,
            vehicleLane: true,
            cameraId: true,
            direction: true,
            vehicleCategory: true,
            vehicleClass: true,
            // plateAccuracy: false,
            captureTime: true,
            transferTime: true,
            speed: true,

        },
        plate: {
            no1: null,
            no2: null,
            no3: null,
            no4: null,
            no5: null,
            no6: null,
            no7: null,
            letter: null,
            select: false
        },
        ftzPlate: {
            no1: null,
            no2: null,
            no3: null,
            no4: null,
            no5: null,
            no6: null,
            no7: null,
            select: false
        },
        transitPlate: {
            no1: null,
            no2: null,
            no3: null,
            no4: null,
            no5: null,
            no6: null,
            no7: null,
            letter: null,
            select: false
        },
        bluePlate: {
            no1: null,
            no2: null,
            no3: null,
            no4: null,
            no5: null,
            no6: null,
            no7: null,
            letter: null,
            select: false
        },
        motorcyclePlate: {
            no1: null,
            no2: null,
            no3: null,
            no4: null,
            no5: null,
            no6: null,
            no7: null,
            no8: null,
            select: false
        }
    };
    const [value, setValue] = useState(initialValue);
    const [message, setMessage] = useState('');
    const [rowCount, setRowCount] = useState(10);
    const [imageDialog, setImageDialog] = useState({open: false, url: ''});
    const handleClickOpen = (url) => {
        setImageDialog({open: true, url: url});
    };
    const handleRowCountSelectChange = (event) => {
        setRowCount(event.target.value);

    }
    const resetForm = () => {
        setValue(initialValue);
    }
    const handleChangePage = (event, value) => {
        setPage(value);

    };
    const getCameras = async () => {
        const response = (result) => {
            setCameras(result.data);
        }
        const error = (e) => {
            setCameras([]);
        }
        await CameraApi.getAll(response, error);

    }
    useEffect(() => {
        (async () => {
            await getReport(page);
        })();
    }, [page, rowCount]);
    const handleCloseImageDialog = () => {
        setImageDialog({url: "", open: false})
    }
    const headers = [
        {
            field: 'title', title: 'Index', width: 120, renderCell: (row, index) => (
                <div style={{display: "block", width: "100%", textAlign: "center"}}>
                    {index}
                </div>
            )
        },
        {
            field: 'title', title: 'Info', width: 120, renderCell: (row, index) => (
                <div style={{display: "block", width: "100%", textAlign: "center"}}>

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

                </div>
            )
        },
        {
            field: 'title', title: 'Plate ', width: 245, renderCell: (row, index) => (
                <div style={{
                    width: "100%",
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center"
                }}>


                    <AuthenticatedImg url={`${configs.server.Api}/${configs.getImages}/${row.plateImage}`}
                                      style={{width: 188, height: 50, cursor: "pointer", maxWidth: 245}}
                                      onClick={handleClickOpen}/>

                    {row.plateType === "iran" ?
                        (row.vehicleClass === "motorcycle" ?
                            <MotorcyclePlate disabled value={{
                                no1: row.plateNumber.substring(0, 1),
                                no2: row.plateNumber.substring(1, 2),
                                no3: row.plateNumber.substring(2, 3),
                                no4: row.plateNumber.substring(3, 4),
                                no5: row.plateNumber.substring(4, 5),
                                no6: row.plateNumber.substring(5, 6),
                                no7: row.plateNumber.substring(6, 7),
                                no8: row.plateNumber.substring(7)
                            }}/> :
                            <IranPlate value={{
                                no1: row.plateNumber.substring(0, 1),
                                no2: row.plateNumber.substring(1, 2),
                                letter: row.plateNumber.substring(2, 4),
                                no3: row.plateNumber.substring(4, 5),
                                no4: row.plateNumber.substring(5, 6),
                                no5: row.plateNumber.substring(6, 7),
                                no6: row.plateNumber.substring(7, 8),
                                no7: row.plateNumber.substring(8)
                            }} handleChange={() => {
                            }} disabled/>) :
                        row.plateType === "ftz" ? <FTZPlate disabled value={{
                                no1: row.plateNumber.substring(0, 1),
                                no2: row.plateNumber.substring(1, 2),
                                no3: row.plateNumber.substring(2, 3),
                                no4: row.plateNumber.substring(3, 4),
                                no5: row.plateNumber.substring(4, 5),
                                no6: row.plateNumber.substring(5, 6),
                                no7: row.plateNumber.substring(6)
                            }}/> :
                            (row.plateType === "blue" ?

                                <BluePlate value={{
                                    no1: row.plateNumber.substring(0, 1),
                                    no2: row.plateNumber.substring(1, 2),
                                    letter: row.plateNumber.substring(2, 4),
                                    no3: row.plateNumber.substring(4, 5),
                                    no4: row.plateNumber.substring(5, 6),
                                    no5: row.plateNumber.substring(6, 7),
                                    no6: row.plateNumber.substring(7, 8),
                                    no7: row.plateNumber.substring(8)
                                }} disabled/> :
                                <TransitPlate value={{
                                    no1: row.plateNumber.substring(0, 1),
                                    no2: row.plateNumber.substring(1, 2),
                                    letter: row.plateNumber.substring(2, 4),
                                    no3: row.plateNumber.substring(4, 5),
                                    no4: row.plateNumber.substring(5, 6),
                                    no5: row.plateNumber.substring(6, 7),
                                    no6: row.plateNumber.substring(7, 8),
                                    no7: row.plateNumber.substring(8)
                                }} disabled/>)}
                </div>
            ),
        }, {
            field: 'title', title: 'Car Image', width: 180, renderCell: (row, index) => (
                <div style={{display: "block", width: "100%", textAlign: "center"}}>
                    <AuthenticatedImg url={`${configs.server.Api}/${configs.getImages}/${row.vehicleImage}`}
                                      style={{width: 188, height: 85, cursor: "pointer", maxWidth: 245}}
                                      onClick={handleClickOpen}/>
                </div>
            ),
        },
        {
            field: 'title', title: 'Send info', width: 180, renderCell: (row, index) => (
                <div style={{display: "block", width: "100%", textAlign: "center"}}>
                    <div style={{display: "flex", justifyContent: "center"}}>
                        <Tooltip title={"Send Status"}>
                            <Chip icon={<SendRoundedIcon/>} label={`${row.transferTime ? 'Sent' : "Unsent"}`}
                                  variant="outlined"/>
                        </Tooltip>
                    </div>
                    <div>
                        <Tooltip title={"Send"}>

                            <Button4 onClick={() => {
                                (async () => {
                                    await send(row.vehicleID)
                                })();
                            }}>
                                <ReplayRoundedIcon/>
                            </Button4>
                        </Tooltip>
                    </div>
                </div>
            ),
        },

    ];


    const getProvinces = async () => {

        const response = (result) => {
            setProvinces(result.data);
        }

        const error = (e) => {
            setProvinces([]);
        }

        await ProvinceApi.getAll(response, error);
    }

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

    const count2 = count ? (count % rowCount === 0 ? (count / rowCount) : (Math.floor(count / rowCount) + 1)) : 0;
    const getReport = async (innerPage) => {
        const response = (result) => {
            setIsGetting(false);
            if (result.data) {
                setRows(result.data.rows);

                setCount(result.data.count);
                if (result.data.count === 0) {
                    showMessage('No record matched!')
                }
                // setCount(result.data.count);
            }
        }

        const error = () => {
            setIsGetting(false);
            setRows([]);
            setCount(0);
        }
        setIsGetting(true);

        await ReportApi.getReport({
            payload: {
                ...value,
                count: rowCount,
                offset: ((innerPage - 1) * rowCount)
            }
        }, response, error);
    }

    const getExport = async () => {
        const response = (result) => {
            setIsExporting(false);
            if (result.data) {
                const {
                    host, hostname, href, origin, pathname, port, protocol
                } = window.location;
                console.log(`${configs.isDemo ? '' : `${protocol}//`}${configs.isDemo ? configs.server.Api : hostname}${configs.hasPort ? `:${configs.port}` : ''}/report/${result.data}`);
                window.location.href = `${configs.isDemo ? '' : `${protocol}//`}${configs.isDemo ? configs.server.Api : hostname}${configs.hasPort ? `:${configs.port}` : ''}/report/${result.data}`;
                // window.open(`${configs.server.Api}${result.data}`);
            }
        }

        const error = (e) => {
            setIsExporting(false);

        }
        setIsExporting(true);

        await ReportApi.exportReport({payload: value}, response, error);
    }

    const send = async (id) => {

        const response = ({data}) => {
            showMessage('The record was sent!')
        }
        const error = (e) => {
            showMessage('An error occurred during sending!')

        }
        await SendApi.send({id: id}, response, error);
    }
    const handleChange = (newValue) => {
        setValue(newValue);
    };

    function valuetext(value) {
        return `${value} Km`;
    }

    function valuetext2(value) {
        return `${value} %`;
    }

    function valuetext3(value) {
        return `${value}`;
    }

    function valuetext4(value) {
        return `${value}s`;
    }

    const marks = [
        {
            value: 0,
            label: '0%',
        },
        {
            value: 50,
            label: '50%',
        },
        {
            value: 100,
            label: '100%',
        }
    ];

    const marks3 = [
        {
            value: 0,
            label: '0',
        },
        {
            value: 8,
            label: '8',
        }
    ];


    const marks4 = [
        {
            value: 0,
            label: '0s',
        },
        {
            value: 60,
            label: '60s',
        }
    ];

    const marks2 = [
        {
            value: 0,
            label: '0Km',
        },
        {
            value: 100,
            label: '100Km',
        },
        {
            value: 200,
            label: "200Km"
        },
        {
            value: 300,
            label: '300Km',
        }
    ];

    const toggleOpenBar = (barName) => {
        setOpenBar({...openBar, [barName]: !openBar[barName]});
    }

    useEffect(() => {

        (async () => {
            await getProvinces();
            await getCameras();
        })();
    }, []);

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


    }, [rows])

    return <div style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        paddingTop: 0,
        paddingBottom: 20
    }}>
        <Dialog open={openBar.export} onClose={() => {
            toggleOpenBar("export");
        }} maxWidth={"sm"} fullWidth>
            <DialogTitle>Export Options</DialogTitle>
            <DialogContent>
                <Grid2 container spacing={2}>
                    <Grid2 item xs={6}>
                        <FormControl1 component="fieldset">
                            <FormLabel component="legend">Columns</FormLabel>
                            <FormGroup aria-label="position">
                                <FormControlLabel
                                    value="1"
                                    control={<CheckBox1
                                        checked={value.columns.plateImage}
                                        onChange={(event) => {
                                            handleChange({
                                                ...value,
                                                columns: {
                                                    ...value.columns,
                                                    plateImage: event.target.checked
                                                }
                                            })
                                        }}/>}
                                    label="Plate Image"
                                />
                                <FormControlLabel
                                    value="1"
                                    control={<CheckBox1
                                        checked={value.columns.vehicleImage}
                                        onChange={(event) => {
                                            handleChange({
                                                ...value,
                                                columns: {
                                                    ...value.columns,
                                                    vehicleImage: event.target.checked
                                                }
                                            })
                                        }}/>}
                                    label="Vehicle Image"
                                />
                                <FormControlLabel
                                    value="1"
                                    control={<CheckBox1
                                        checked={value.columns.plateNumber}
                                        onChange={(event) => {
                                            handleChange({
                                                ...value,
                                                columns: {
                                                    ...value.columns,
                                                    plateNumber: event.target.checked
                                                }
                                            })
                                        }}/>}
                                    label="Plate Number"
                                />

                                <FormControlLabel
                                    value="1"
                                    control={<CheckBox1
                                        checked={value.columns.vehicleLane}
                                        onChange={(event) => {
                                            handleChange({
                                                ...value,
                                                columns: {
                                                    ...value.columns,
                                                    vehicleLane: event.target.checked
                                                }
                                            })
                                        }}/>}
                                    label="Lane"
                                />
                                <FormControlLabel
                                    value="1"
                                    control={<CheckBox1
                                        checked={value.columns.cameraId}
                                        onChange={(event) => {
                                            handleChange({
                                                ...value,
                                                columns: {
                                                    ...value.columns,
                                                    cameraId: event.target.checked
                                                }
                                            })
                                        }}/>}
                                    label="Camera"
                                />

                                <FormControlLabel
                                    value="1"
                                    control={<CheckBox1
                                        checked={value.columns.vehicleCategory}
                                        onChange={(event) => {
                                            handleChange({
                                                ...value,
                                                columns: {
                                                    ...value.columns,
                                                    vehicleCategory: event.target.checked
                                                }
                                            })
                                        }}/>}
                                    label="Category"
                                />


                                <FormControlLabel
                                    value="1"
                                    control={<CheckBox1
                                        checked={value.columns.captureTime}
                                        onChange={(event) => {
                                            handleChange({
                                                ...value,
                                                columns: {
                                                    ...value.columns,
                                                    captureTime: event.target.checked
                                                }
                                            })
                                        }}/>}
                                    label="Time"
                                />

                                <FormControlLabel
                                    value="1"
                                    control={<CheckBox1
                                        checked={value.columns.speed}
                                        onChange={(event) => {
                                            handleChange({
                                                ...value,
                                                columns: {
                                                    ...value.columns,
                                                    speed: event.target.checked
                                                }
                                            })
                                        }}/>}
                                    label="Speed"
                                />

                                <FormControlLabel
                                    value="1"
                                    control={<CheckBox1
                                        checked={value.columns.direction}
                                        onChange={(event) => {
                                            handleChange({
                                                ...value,
                                                columns: {
                                                    ...value.columns,
                                                    direction: event.target.checked
                                                }
                                            })
                                        }}/>}
                                    label="Direction"
                                />


                            </FormGroup>
                        </FormControl1>
                    </Grid2>
                    <Grid2 item xs={6}>
                        <FormControl1 component="fieldset">
                            <FormLabel component="legend">Export Types</FormLabel>
                            <FormGroup aria-label="position">
                                <FormControlLabel
                                    value="1"
                                    control={<CheckBox1
                                        checked={value.export.csv}
                                        onChange={(event) => {
                                            handleChange({
                                                ...value,
                                                export: {
                                                    ...value.export,
                                                    csv: event.target.checked
                                                }
                                            })
                                        }}/>}
                                    label="CSV"
                                />
                                <FormControlLabel
                                    value="1"
                                    control={<CheckBox1
                                        checked={value.export.html}
                                        onChange={(event) => {
                                            handleChange({
                                                ...value,
                                                export: {
                                                    ...value.export,
                                                    html: event.target.checked
                                                }
                                            })
                                        }}/>}
                                    label="HTML"
                                />
                                <FormControlLabel
                                    value="1"
                                    control={<CheckBox1
                                        checked={value.export.pdf}
                                        onChange={(event) => {
                                            handleChange({
                                                ...value,
                                                export: {
                                                    ...value.export,
                                                    pdf: event.target.checked
                                                }
                                            })
                                        }}/>}
                                    label="PDF"
                                />


                            </FormGroup>
                        </FormControl1>
                        <div style={{marginTop: 10, marginBottom: 10, maxWidth: 80}}>
                            <TextField
                                fullWidth
                                label="Offset"
                                type="text"
                                value={value.offset}
                                variant="outlined"
                                onChange={(event) => {
                                    handleChange({
                                        ...value,
                                        offset: event.target.value

                                    })
                                }}
                            />
                        </div>
                        <div style={{marginTop: 10, marginBottom: 10, maxWidth: 80}}>

                            <TextField
                                fullWidth
                                label="Count"
                                type="text"
                                value={value.count}
                                variant="outlined"
                                onChange={(event) => {
                                    handleChange({
                                        ...value,
                                        count: event.target.value

                                    })
                                }}
                            />
                        </div>
                    </Grid2>

                </Grid2>
            </DialogContent>
            <DialogActions>
                <Button2 onClick={() => {
                    toggleOpenBar("export");
                }}>
                    Cancel
                </Button2>
                <LoadingButton1
                    type={"button"}
                    loading={isExporting}
                    onClick={(e) => {
                        getExport();
                    }}
                >
                    Export
                </LoadingButton1>
            </DialogActions>
        </Dialog>

        <Dialog onClose={handleCloseImageDialog} open={imageDialog.open} maxWidth={'sm'} fullWidth>
            <img src={imageDialog.url} alt={""} style={{width: "100%"}}/>
        </Dialog>
        <Container maxWidth={"xl"}>
            <Grid2 container spacing={2}>
                <Grid2 item xs={3}>
                    <div>
                        <Grid2 container spacing={2}>


                            {/*time*/}
                            <Grid2 item xs={12} style={{
                                cursor: "pointer",
                                borderBottomStyle: "solid",
                                borderBottomWidth: 1,
                                borderBottomColor: '#80808061'
                            }}>

                                <div style={{display: "flex"}} onClick={e => {
                                    toggleOpenBar("time")
                                }}>
                                    <div style={{width: "95%", display: "flex"}}>
                                        <Typography varant={"body2"}>
                                            Date/Time
                                        </Typography>
                                        <div style={{
                                            textOverflow: "ellipsis",
                                            overflow: "hidden",
                                            whiteSpace: "nowrap",
                                            height: "1.6em",
                                            marginLeft: 5
                                        }}>

                                            {!openBar.time && <>
                                                {(value.startDate || value.endDate) && <Chip
                                                    label={`${value.startDate ? `${(new Date(value.startDate)).toISOString().split('T')[0]}` : ''}${value.endDate ? `//${(new Date(value.endDate)).toISOString().split('T')[0]}` : ''}`}
                                                    size="small" variant="outlined"/>}

                                            </>}
                                        </div>
                                    </div>


                                    {openBar.time ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}

                                </div>


                            </Grid2>
                            <Collapse in={openBar.time}>
                                <>
                                    <Grid2 item xs={12}>
                                        <LocalizationProvider dateAdapter={AdapterDateFnsJalali}>
                                            {/*<DatePicker*/}
                                            {/*    label="Start Date"*/}
                                            {/*    value={value.startDate ? dayjs(value.startDate).add(-3, "h").add(-30, "m").toDate() : null}*/}
                                            {/*    onChange={e => {*/}
                                            {/*        if (e && e.$d)*/}
                                            {/*            handleChange({*/}
                                            {/*                ...value,*/}
                                            {/*                startDate: dayjs(e.$d).add(3, "h").add(30, "m").toDate()*/}
                                            {/*            })*/}
                                            {/*    }}*/}

                                            {/*    renderInput={(params) => <TextField {...params} fullWidth/>}*/}
                                            {/*/>*/}
                                            <DateField
                                                fullWidth
                                                label="Start Date"
                                                value={value.startDate ? dayjs(value.startDate).add(-3, "h").add(-30, "m").toDate() : null}
                                                onChange={e => {
                                                    if (e && e.$d)
                                                        handleChange({
                                                            ...value,
                                                            startDate: dayjs(e.$d).add(3, "h").add(30, "m").toDate()
                                                        })
                                                }}

                                                renderInput={(params) => <TextField {...params} fullWidth/>}
                                            />

                                        </LocalizationProvider>
                                    </Grid2>
                                    <Grid2 item xs={12}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <TimeField
                                                label="Start Time"
                                                fullWidth
                                                value={value.startDate ? dayjs(value.startDate).add(-3, "h").add(-30, "m").toDate() : null}
                                                onChange={e => {

                                                    if (e && e.$d) {
                                                        let isValidDate = Date.parse(e.$d);
                                                        if (!isNaN(isValidDate)) {
                                                            handleChange({
                                                                ...value,
                                                                startDate: dayjs(e.$d).add(3, "h").add(30, "m").toDate()
                                                            })

                                                        } else {
                                                            showMessage('incorrect time format')
                                                            handleChange({
                                                                ...value,
                                                                startDate: null
                                                            })
                                                        }
                                                    }
                                                }}

                                                textField={(params) => <TextField {...params} fullWidth/>}

                                                format="HH:mm"
                                            />
                                            {/*<TimePicker*/}
                                            {/*    label="Start Time"*/}
                                            {/*    value={value.startDate ? dayjs(value.startDate).add(-3, "h").add(-30, "m").toDate() : null}*/}
                                            {/*    onChange={e => {*/}

                                            {/*        if (e && e.$d) {*/}
                                            {/*            let isValidDate = Date.parse(e.$d);*/}
                                            {/*            if (!isNaN(isValidDate)) {*/}
                                            {/*                handleChange({*/}
                                            {/*                    ...value,*/}
                                            {/*                    startDate: dayjs(e.$d).add(3, "h").add(30, "m").toDate()*/}
                                            {/*                })*/}

                                            {/*            } else {*/}
                                            {/*                showMessage('incorrect time format')*/}

                                            {/*            }*/}
                                            {/*        }*/}
                                            {/*    }}*/}

                                            {/*    renderInput={(params) => <TextField {...params} fullWidth/>}*/}
                                            {/*/>*/}
                                        </LocalizationProvider>
                                    </Grid2>
                                    <Grid2 item xs={12}>
                                        <LocalizationProvider dateAdapter={AdapterDateFnsJalali}>
                                            <DateField
                                                label="End Date"
                                                value={value.endDate ? dayjs(value.endDate).add(-3, "h").add(-30, "m").toDate() : null}
                                                onChange={e => {
                                                    if (e && e.$d)
                                                        handleChange({
                                                            ...value,
                                                            endDate: dayjs(e.$d).add(3, "h").add(30, "m").toDate()
                                                        })
                                                }}
                                                renderInput={(params) => <TextField {...params} fullWidth/>}
                                                format="HH:mm"

                                            />
                                            {/*<DatePicker*/}
                                            {/*    label="End Date"*/}
                                            {/*    value={value.endDate ? dayjs(value.endDate).add(-3, "h").add(-30, "m").toDate() : null}*/}
                                            {/*    onChange={e => {*/}
                                            {/*        if (e && e.$d)*/}
                                            {/*            handleChange({*/}
                                            {/*                ...value,*/}
                                            {/*                endDate: dayjs(e.$d).add(3, "h").add(30, "m").toDate()*/}
                                            {/*            })*/}
                                            {/*    }}*/}
                                            {/*    renderInput={(params) => <TextField {...params} fullWidth/>}*/}
                                            {/*/>*/}
                                        </LocalizationProvider>
                                    </Grid2>
                                    <Grid2 item xs={12}>

                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <TimeField
                                                label="End Time"
                                                value={value.endDate ? dayjs(value.endDate).add(-3, "h").add(-30, "m").toDate() : null}
                                                onChange={e => {
                                                    if (e && e.$d) {
                                                        let isValidDate = Date.parse(e.$d);
                                                        if (!isNaN(isValidDate)) {
                                                            handleChange({
                                                                ...value,
                                                                endDate: dayjs(e.$d).add(3, "h").add(30, "m").toDate()
                                                            })

                                                        } else {
                                                            showMessage('incorrect time format')
                                                            handleChange({
                                                                ...value,
                                                                endDate: null
                                                            })
                                                        }
                                                    }

                                                }}
                                                format="HH:mm"

                                                renderInput={(params) => <TextField {...params} fullWidth/>}
                                            />
                                            {/*<TimePicker*/}
                                            {/*    label="End Time"*/}
                                            {/*    value={value.endDate ? dayjs(value.endDate).add(-3, "h").add(-30, "m").toDate() : null}*/}
                                            {/*    onChange={e => {*/}
                                            {/*        if (e && e.$d) {*/}
                                            {/*            let isValidDate = Date.parse(e.$d);*/}
                                            {/*            if (!isNaN(isValidDate)) {*/}
                                            {/*                handleChange({*/}
                                            {/*                    ...value,*/}
                                            {/*                    endDate: dayjs(e.$d).add(3, "h").add(30, "m").toDate()*/}
                                            {/*                })*/}

                                            {/*            } else {*/}
                                            {/*                showMessage('incorrect time format')*/}

                                            {/*            }*/}
                                            {/*        }*/}

                                            {/*    }}*/}
                                            {/*    renderInput={(params) => <TextField {...params} fullWidth/>}*/}
                                            {/*/>*/}
                                        </LocalizationProvider>


                                    </Grid2>
                                </>
                            </Collapse>


                            {/*plate*/}
                            <Grid2 item xs={12} style={{
                                cursor: "pointer",
                                borderBottomStyle: "solid",
                                borderBottomWidth: 1,
                                borderBottomColor: '#80808061'
                            }}>

                                <div style={{display: "flex"}} onClick={e => {
                                    toggleOpenBar("plate")
                                }}>
                                    <div style={{width: "95%", display: "flex", overflow: "hidden"}}>
                                        <Typography varant={"body2"}>
                                            Plate
                                        </Typography>
                                        <div style={{
                                            textOverflow: "ellipsis",
                                            overflow: "hidden",
                                            whiteSpace: "nowrap",
                                            height: "1.6em",
                                            marginLeft: 5
                                        }}>
                                            {(!openBar.plate && (value.plate.select || value.bluePlate.select || value.transitPlate.select || value.ftzPlate.select || value.motorcyclePlate.select)) && <>
                                                <Chip
                                                    label={`
                                                    ${value.plate.select ? `Standard:${value.plate.no1 ? value.plate.no1 : '*'}${value.plate.no2 ? value.plate.no2 : '*'}${value.plate.letter ? persianLetters[value.plate.letter] : '*'}${value.plate.no3 ? value.plate.no3 : '*'}${value.plate.no4 ? value.plate.no4 : '*'}${value.plate.no5 ? value.plate.no5 : '*'}${value.plate.no6 ? value.plate.no6 : '*'}${value.plate.no7 ? value.plate.no7 : '*'}-` : ''}
                                                    ${value.transitPlate.select ? `Transit: ${value.transitPlate.no1 ? value.transitPlate.no1 : '*'}${value.transitPlate.no2 ? value.transitPlate.no2 : '*'}${value.transitPlate.letter ? englishLetters[value.transitPlate.letter] : '*'}${value.transitPlate.no3 ? value.transitPlate.no3 : '*'}${value.transitPlate.no4 ? value.transitPlate.no4 : '*'}${value.transitPlate.no5 ? value.transitPlate.no5 : '*'}${value.transitPlate.no6 ? value.transitPlate.no6 : '*'}${value.transitPlate.no7 ? value.transitPlate.no7 : '*'}-` : ''}
                                                    ${value.bluePlate.select ? `Diplomat:${value.bluePlate.no1 ? value.bluePlate.no1 : '*'}${value.bluePlate.no2 ? value.bluePlate.no2 : '*'}${value.bluePlate.letter ? englishLetters[value.bluePlate.letter] : '*'}${value.bluePlate.no3 ? value.bluePlate.no3 : '*'}${value.bluePlate.no4 ? value.bluePlate.no4 : '*'}${value.bluePlate.no5 ? value.bluePlate.no5 : '*'}${value.bluePlate.no6 ? value.bluePlate.no6 : '*'}${value.bluePlate.no7 ? value.bluePlate.no7 : '*'}-` : ''}
                                                    ${value.motorcyclePlate.select ? `Motorcycle:${value.motorcyclePlate.no1 ? value.motorcyclePlate.no1 : '*'}${value.motorcyclePlate.no2 ? value.motorcyclePlate.no2 : '*'}${value.motorcyclePlate.no3 ? value.motorcyclePlate.no3 : '*'}${value.motorcyclePlate.no4 ? value.motorcyclePlate.no4 : '*'}${value.motorcyclePlate.no5 ? value.motorcyclePlate.no5 : '*'}${value.motorcyclePlate.no6 ? value.motorcyclePlate.no6 : '*'}${value.motorcyclePlate.no7 ? value.motorcyclePlate.no7 : '*'}${value.motorcyclePlate.no8 ? value.motorcyclePlate.no8 : '*'}-` : ''}
                                                    ${value.ftzPlate.select ? `FTZ:${value.ftzPlate.no1 ? value.ftzPlate.no1 : '*'}${value.ftzPlate.no2 ? value.ftzPlate.no2 : '*'}${value.ftzPlate.no3 ? value.ftzPlate.no3 : '*'}${value.ftzPlate.no4 ? value.ftzPlate.no4 : '*'}${value.ftzPlate.no5 ? value.ftzPlate.no5 : '*'}${value.ftzPlate.no6 ? value.ftzPlate.no6 : '*'}${value.ftzPlate.no7 ? value.ftzPlate.no7 : '*'}-` : ''}
                                                
                                                
                    
                                                
                                                
                                                `}
                                                    size="small" variant="outlined"/>

                                            </>}
                                        </div>
                                    </div>
                                    {openBar.plate ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}

                                </div>

                            </Grid2>
                            <Collapse in={openBar.plate}>
                                <>
                                    <Grid2 xs={12} style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        flexDirection: "column",
                                        alignItems: "start"
                                    }}>

                                        <FormControlLabel
                                            control={<CheckBox1 checked={value.plate.select} onChange={e => {
                                                handleChange({
                                                    ...value,
                                                    plate: {...value.plate, select: e.target.checked}
                                                })
                                            }}/>} label={

                                            <div style={{marginTop: 15, marginBottom: 15}}>
                                                <Tooltip title={"Standard Plate"} followCursor>
                                                    <IranPlate handleChange={e => {
                                                        handleChange({...value, plate: e})
                                                    }} value={value.plate}
                                                               disabled={!value.plate.select}/>
                                                </Tooltip>


                                            </div>
                                        }/>


                                        <FormControlLabel
                                            control={<CheckBox1 checked={value.transitPlate.select} onChange={e => {
                                                handleChange({
                                                    ...value,
                                                    transitPlate: {...value.transitPlate, select: e.target.checked}
                                                })
                                            }}/>} label={

                                            <div style={{marginTop: 15, marginBottom: 15}}>
                                                <Tooltip title={"Transit Plate"} followCursor>

                                                    <TransitPlate
                                                        handleChange={e => {
                                                            handleChange({...value, transitPlate: e})
                                                        }}
                                                        value={value.transitPlate}
                                                        disabled={!value.transitPlate.select}/>
                                                </Tooltip>

                                            </div>
                                        }/>


                                        <FormControlLabel
                                            control={<CheckBox1 checked={value.bluePlate.select} onChange={e => {
                                                handleChange({
                                                    ...value,
                                                    bluePlate: {...value.bluePlate, select: e.target.checked}
                                                })
                                            }}/>} label={

                                            <div style={{marginTop: 15, marginBottom: 15}}>
                                                <Tooltip title={"Diplomat Plate"} followCursor>

                                                    <BluePlate
                                                        handleChange={e => {
                                                            handleChange({...value, bluePlate: e})
                                                        }}
                                                        value={value.bluePlate}
                                                        disabled={!value.bluePlate.select}/>
                                                </Tooltip>


                                            </div>
                                        }/>


                                        <FormControlLabel
                                            control={<CheckBox1 checked={value.ftzPlate.select} onChange={e => {
                                                handleChange({
                                                    ...value,
                                                    ftzPlate: {...value.ftzPlate, select: e.target.checked}
                                                })
                                            }}/>} label={

                                            <div style={{marginTop: 15, marginBottom: 15}}>
                                                <Tooltip title={"FTZ Plate"} followCursor>
                                                    <FTZPlate
                                                        handleChange={e => {
                                                            handleChange({...value, ftzPlate: e})
                                                        }}
                                                        value={value.ftzPlate}
                                                        disabled={!value.ftzPlate.select}
                                                    />
                                                </Tooltip>

                                            </div>
                                        }/>
                                        <FormControlLabel
                                            control={<CheckBox1 checked={value.motorcyclePlate.select} onChange={e => {
                                                handleChange({
                                                    ...value,
                                                    motorcyclePlate: {
                                                        ...value.motorcyclePlate,
                                                        select: e.target.checked
                                                    }
                                                })
                                            }}/>} label={
                                            <div style={{marginTop: 15, marginBottom: 15}}>
                                                <Tooltip title={"Motorcycle Plate"} followCursor>
                                                    <MotorcyclePlate
                                                        handleChange={e => {
                                                            handleChange({...value, motorcyclePlate: e})
                                                        }} value={value.motorcyclePlate}
                                                        disabled={!value.motorcyclePlate.select}/>
                                                </Tooltip>
                                            </div>
                                        }/>
                                    </Grid2>
                                </>
                            </Collapse>


                            {/*speed*/}
                            <Grid2 item xs={12} style={{
                                cursor: "pointer",
                                borderBottomStyle: "solid",
                                borderBottomWidth: 1,
                                borderBottomColor: '#80808061'
                            }}>
                                <div style={{display: "flex"}} onClick={e => {
                                    toggleOpenBar("speed")
                                }}>
                                    <div style={{width: "95%", display: "flex"}}>

                                        <Typography varant={"body2"}>
                                            Speed
                                        </Typography>

                                        <Typography varant={"caption"} style={{
                                            textOverflow: "ellipsis",
                                            overflow: "hidden",
                                            whiteSpace: "nowrap",
                                            height: "1.6em",
                                            marginLeft: 2
                                        }}>
                                            {!openBar.speed && (value.startSpeed !== 0 || value.endSpeed !== 300) && <>
                                                <Chip
                                                    label={`${value.startSpeed}-${value.endSpeed}`}
                                                    size="small" variant="outlined"/>
                                            </>}
                                        </Typography>
                                    </div>
                                    {openBar.speed ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}

                                </div>


                            </Grid2>
                            <Collapse in={openBar.speed} style={{width: "100%"}}>
                                <Grid2 item xs={12}>
                                    <div style={{marginLeft: 10, marginRight: 10}}>
                                        <Slider1
                                            value={[value.startSpeed, value.endSpeed]}
                                            min={0}
                                            step={1}
                                            max={300}
                                            onChange={e => {
                                                handleChange({
                                                    ...value,
                                                    startSpeed: e.target.value[0],
                                                    endSpeed: e.target.value[1]
                                                })

                                            }}
                                            valueLabelDisplay="auto"
                                            getAriaValueText={valuetext}
                                            valueLabelFormat={valuetext}
                                            marks={marks2}
                                        />
                                    </div>

                                </Grid2>

                            </Collapse>


                            {/*type*/}
                            <Grid2 item xs={12} style={{
                                cursor: "pointer",
                                borderBottomStyle: "solid",
                                borderBottomWidth: 1,
                                borderBottomColor: '#80808061'
                            }}>

                                <div style={{display: "flex"}} onClick={e => {
                                    toggleOpenBar("vehicleType")
                                }}>
                                    <div style={{width: "95%", display: "flex"}}>

                                        <Typography varant={"body2"}>
                                            Vehicle Type
                                        </Typography>

                                        <Typography varant={"caption"} style={{
                                            textOverflow: "ellipsis",
                                            overflow: "hidden",
                                            whiteSpace: "nowrap",
                                            height: "1.6em",
                                            marginLeft: 5
                                        }}>

                                            {(!openBar.vehicleType && value.type) && <>
                                                <Chip
                                                    label={value.type === 'light' ? 'Light' : 'Heavy'}
                                                    size="small" variant="outlined"/>
                                            </>}
                                        </Typography>
                                    </div>
                                    {openBar.vehicleType ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}

                                </div>

                            </Grid2>
                            <Collapse in={openBar.vehicleType}>
                                <Grid2 item xs={12}>
                                    <FormControl1>
                                        <FormControlLabel
                                            value="1"
                                            control={<CheckBox1 checked={value.type === "light"}
                                                                onChange={(event) => {
                                                                    handleChange({
                                                                        ...value,
                                                                        type: event.target.checked ? "light" : ''

                                                                    })
                                                                }}/>}
                                            label="Light"
                                        />
                                        <FormControlLabel
                                            value="1"
                                            control={<CheckBox1 checked={value.type === "heavy"}
                                                                onChange={(event) => {
                                                                    handleChange({
                                                                        ...value,
                                                                        type: event.target.checked ? "heavy" : ''

                                                                    })
                                                                }}/>}
                                            label="Heavy"
                                        />


                                    </FormControl1>

                                </Grid2>

                            </Collapse>

                            {/*lane*/}
                            <Grid2 item xs={12} style={{
                                cursor: "pointer",
                                borderBottomStyle: "solid",
                                borderBottomWidth: 1,
                                borderBottomColor: '#80808061'
                            }}>

                                <div style={{display: "flex"}} onClick={e => {
                                    toggleOpenBar("lane")
                                }}>
                                    <div style={{width: "95%", display: "flex"}}>

                                        <Typography varant={"body2"}>
                                            Lane
                                        </Typography>

                                        <Typography varant={"caption"} style={{
                                            textOverflow: "ellipsis",
                                            overflow: "hidden",
                                            whiteSpace: "nowrap",
                                            height: "1.6em",
                                            marginLeft: 5
                                        }}>

                                            {(!openBar.lane && (value.lane.lane1 || value.lane.lane2 || value.lane.lane3 || value.lane.lane4 || value.lane.lane5 || value.lane.lane6 || value.lane.lane7 || value.lane.lane8)) && <>
                                                <Chip
                                                    label={`Lane:${value.lane.lane1 ? ' 1,' : ''}${value.lane.lane2 ? ' 2,' : ''}${value.lane.lane3 ? ' 3,' : ''}${value.lane.lane4 ? ' 4,' : ''}${value.lane.lane5 ? ' 5,' : ''}${value.lane.lane6 ? ' 6,' : ''}${value.lane.lane7 ? ' 7,' : ''}${value.lane.lane8 ? ' 8,' : ''}`}
                                                    size="small" variant="outlined"/>
                                            </>}

                                        </Typography>
                                    </div>
                                    {openBar.lane ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}

                                </div>
                            </Grid2>
                            <Collapse in={openBar.lane} style={{width: "100%"}}>
                                <Grid2 container specing={1}>
                                    <Grid2 item xs={12} md={6}>
                                        <FormControl1 component="fieldset">
                                            <FormGroup aria-label="position">
                                                <FormControlLabel
                                                    value="1"
                                                    control={<CheckBox1 value={value.lane.lane1}
                                                                        onChange={(event) => {
                                                                            handleChange({
                                                                                ...value,
                                                                                lane: {
                                                                                    ...value.lane,
                                                                                    lane1: event.target.checked
                                                                                }
                                                                            })
                                                                        }}/>}
                                                    label="Lane 1"
                                                />
                                                <FormControlLabel
                                                    value="2"
                                                    control={<CheckBox1 value={value.lane.lane2}
                                                                        onChange={(event) => {
                                                                            handleChange({
                                                                                ...value,
                                                                                lane: {
                                                                                    ...value.lane,
                                                                                    lane2: event.target.checked
                                                                                }
                                                                            })
                                                                        }}/>} label="Lane 2"
                                                />
                                                <FormControlLabel
                                                    value="3"
                                                    control={<CheckBox1 value={value.lane.lane3}
                                                                        onChange={(event) => {
                                                                            handleChange({
                                                                                ...value,
                                                                                lane: {
                                                                                    ...value.lane,
                                                                                    lane3: event.target.checked
                                                                                }
                                                                            })
                                                                        }}/>} label="Lane 3"
                                                />
                                                <FormControlLabel
                                                    value="4"
                                                    control={<CheckBox1 value={value.lane.lane4}
                                                                        onChange={(event) => {
                                                                            handleChange({
                                                                                ...value,
                                                                                lane: {
                                                                                    ...value.lane,
                                                                                    lane4: event.target.checked
                                                                                }
                                                                            })
                                                                        }}/>} label="Lane 4"
                                                />
                                            </FormGroup>
                                        </FormControl1>

                                    </Grid2>
                                    <Grid2 item xs={12} md={6}>
                                        <FormControl1 component="fieldset">
                                            <FormGroup aria-label="position">
                                                <FormControlLabel
                                                    value="1"
                                                    control={<CheckBox1 value={value.lane.lane5}
                                                                        onChange={(event) => {
                                                                            handleChange({
                                                                                ...value,
                                                                                lane: {
                                                                                    ...value.lane,
                                                                                    lane5: event.target.checked
                                                                                }
                                                                            })
                                                                        }}/>}
                                                    label="Lane 5"
                                                />
                                                <FormControlLabel
                                                    value="2"
                                                    control={<CheckBox1 value={value.lane.lane6}
                                                                        onChange={(event) => {
                                                                            handleChange({
                                                                                ...value,
                                                                                lane: {
                                                                                    ...value.lane,
                                                                                    lane6: event.target.checked
                                                                                }
                                                                            })
                                                                        }}/>} label="Lane 6"
                                                />
                                                <FormControlLabel
                                                    value="3"
                                                    control={<CheckBox1 value={value.lane.lane7}
                                                                        onChange={(event) => {
                                                                            handleChange({
                                                                                ...value,
                                                                                lane: {
                                                                                    ...value.lane,
                                                                                    lane7: event.target.checked
                                                                                }
                                                                            })
                                                                        }}/>} label="Lane 7"
                                                />
                                                <FormControlLabel
                                                    value="4"
                                                    control={<CheckBox1 value={value.lane.lane8}
                                                                        onChange={(event) => {
                                                                            handleChange({
                                                                                ...value,
                                                                                lane: {
                                                                                    ...value.lane,
                                                                                    lane8: event.target.checked
                                                                                }
                                                                            })
                                                                        }}/>} label="Lane 8"
                                                />
                                            </FormGroup>
                                        </FormControl1>

                                    </Grid2>
                                </Grid2>


                            </Collapse>


                            {/*direction*/}
                            <Grid2 item xs={12} style={{
                                cursor: "pointer",
                                borderBottomStyle: "solid",
                                borderBottomWidth: 1,
                                borderBottomColor: '#80808061'
                            }}>


                                <div style={{display: "flex"}} onClick={e => {
                                    toggleOpenBar("direction")
                                }}>
                                    <div style={{width: "95%", display: "flex"}}>
                                        <Typography varant={"body2"}>
                                            Direction
                                        </Typography>

                                        <Typography varant={"caption"} style={{
                                            textOverflow: "ellipsis",
                                            overflow: "hidden",
                                            whiteSpace: "nowrap",
                                            height: "1.6em",
                                            marginLeft: 5
                                        }}>

                                            {(!openBar.direction && value.direction) && <>
                                                <Chip
                                                    label={value.direction === "up" ? 'Up' : 'Down'}
                                                    size="small" variant="outlined"/>

                                            </>}
                                        </Typography>
                                    </div>
                                    {openBar.direction ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}

                                </div>
                            </Grid2>
                            <Collapse in={openBar.direction}>
                                <Grid2 item xs={12}>
                                    <FormControl1>
                                        <FormControlLabel
                                            value="1"
                                            control={<CheckBox1 checked={value.direction === "up"}
                                                                onChange={(event) => {
                                                                    handleChange({
                                                                        ...value,
                                                                        direction: event.target.checked ? "up" : ''

                                                                    })
                                                                }}/>}
                                            label="Up"
                                        />

                                        <FormControlLabel
                                            value="1"
                                            control={<CheckBox1 checked={value.direction === "down"}
                                                                onChange={(event) => {
                                                                    handleChange({
                                                                        ...value,
                                                                        direction: event.target.checked ? "down" : ''

                                                                    })
                                                                }}/>}
                                            label="Down"
                                        />

                                    </FormControl1>
                                </Grid2>

                            </Collapse>

                            {/*accuracy*/}
                            <Grid2 item xs={12} style={{
                                cursor: "pointer",
                                borderBottomStyle: "solid",
                                borderBottomWidth: 1,
                                borderBottomColor: '#80808061'
                            }}>

                                <div style={{display: "flex"}} onClick={e => {
                                    toggleOpenBar("accuracy")
                                }}>
                                    <div style={{width: "95%", display: "flex"}}>

                                        <Typography varant={"body2"}>
                                            Accuracy
                                        </Typography>

                                        <Typography varant={"caption"} style={{
                                            textOverflow: "ellipsis",
                                            overflow: "hidden",
                                            whiteSpace: "nowrap",
                                            height: "1.6em",
                                            marginLeft: 5
                                        }}>

                                            {(!openBar.accuracy && (value.plateLowAccuracy !== 0 || value.plateHighAccuracy !== 100)) && <>
                                                <Chip
                                                    label={`${value.plateLowAccuracy}-${value.plateHighAccuracy}`}
                                                    size="small" variant="outlined"/>

                                            </>}
                                        </Typography>
                                    </div>
                                    {openBar.accuracy ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}

                                </div>

                            </Grid2>
                            <Collapse in={openBar.accuracy} style={{width: "100%"}}>
                                <>
                                    <Grid2 item xs={12}>

                                        <Slider1
                                            value={[value.plateLowAccuracy, value.plateHighAccuracy]}
                                            onChange={e => {
                                                handleChange({
                                                    ...value,
                                                    plateLowAccuracy: e.target.value[0],
                                                    plateHighAccuracy: e.target.value[1]
                                                })

                                            }}
                                            getAriaValueText={valuetext2}
                                            valueLabelFormat={valuetext2}
                                            valueLabelDisplay="auto"
                                            marks={marks}

                                        />

                                    </Grid2>


                                </>
                            </Collapse>

                            {/*purification*/}
                            <Grid2 item xs={12} style={{
                                cursor: "pointer",
                                borderBottomStyle: "solid",
                                borderBottomWidth: 1,
                                borderBottomColor: '#80808061'
                            }}>

                                <div style={{display: "flex"}} onClick={e => {
                                    toggleOpenBar("purification")
                                }}>
                                    <div style={{width: "95%", display: "flex"}}>
                                        <Typography varant={"body2"}>
                                            Data Cleansing
                                        </Typography>
                                        <div style={{
                                            textOverflow: "ellipsis",
                                            overflow: "hidden",
                                            whiteSpace: "nowrap",
                                            height: "1.6em",
                                            marginLeft: 5
                                        }}>

                                            {(!openBar.purification && value.purificationTime && value.purificationNo) ? <>
                                                <Chip
                                                    label={`${value.purificationTime}s on ${value.purificationNo}`}
                                                    size="small" variant="outlined"/>
                                            </> : <></>}


                                        </div>
                                    </div>


                                    {openBar.purification ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}

                                </div>


                            </Grid2>
                            <Collapse in={openBar.purification} style={{width: "100%"}}>
                                <>
                                    <Grid2 item xs={12}>
                                        <div style={{marginLeft: 10, marginRight: 10}}>
                                            <Typography variant={"body2"}>
                                                Character
                                            </Typography>
                                            <Slider1
                                                value={value.purificationNo}
                                                onChange={(event, newValue) => {
                                                    handleChange({
                                                        ...value,
                                                        purificationNo: newValue
                                                    })

                                                }}
                                                getAriaValueText={valuetext3}
                                                valueLabelFormat={valuetext3}
                                                valueLabelDisplay="auto"
                                                marks={marks3}
                                                step={1}
                                                min={0}
                                                max={8}
                                            />
                                        </div>
                                        <div style={{marginLeft: 10, marginRight: 10}}>
                                            <Typography variant={"body2"}>
                                                Time
                                            </Typography>
                                            <Slider1
                                                value={value.purificationTime}
                                                onChange={(event, newValue) => {
                                                    handleChange({
                                                        ...value,
                                                        purificationTime: newValue
                                                    })

                                                }}
                                                getAriaValueText={valuetext4}
                                                valueLabelFormat={valuetext4}
                                                valueLabelDisplay="auto"
                                                marks={marks4}
                                                step={1}
                                                min={0}
                                                max={60}
                                            />
                                        </div>
                                    </Grid2>
                                </>
                            </Collapse>

                            {/*province*/}
                            <Grid2 item xs={12} style={{
                                cursor: "pointer",
                                borderBottomStyle: "solid",
                                borderBottomWidth: 1,
                                borderBottomColor: '#80808061'
                            }}>

                                <div style={{display: "flex"}} onClick={e => {
                                    toggleOpenBar("province")
                                }}>
                                    <div style={{width: "95%", display: "flex"}}>
                                        <Typography varant={"body2"}>
                                            Plate Province
                                        </Typography>
                                        <Typography varant={"caption"} style={{
                                            textOverflow: "ellipsis",
                                            overflow: "hidden",
                                            whiteSpace: "nowrap",
                                            height: "1.6em",
                                            marginLeft: 5,
                                            maxWidth: "50%"
                                        }}>

                                            {!openBar.province && <>
                                                {(value.province1.length !== 0) && <Chip
                                                    label={value.province1.map(item => `${item.name},`)}
                                                    size="small" variant="outlined"/>}
                                            </>}
                                        </Typography>
                                    </div>
                                    {openBar.province ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}

                                </div>
                            </Grid2>
                            <Collapse in={openBar.province} style={{width: "100%"}}>
                                <Grid2 item xs={12}>
                                    <AutoComplete1
                                        fullWidth
                                        multiple
                                        disablePortal
                                        id="combo-box-demo"
                                        options={provinces}
                                        getOptionLabel={(option) => option.name}
                                        renderOption={(props, option) => (
                                            <Box component="li" sx={{'& > img': {mr: 2, flexShrink: 0}}} {...props}>
                                                {option.name} ({option.provinceID})
                                            </Box>

                                        )}
                                        value={value.province1}
                                        onChange={(event, newValue) => {

                                            let array = newValue.map(item => item.id);
                                            handleChange({...value, province1: newValue, province: array});


                                        }}
                                        renderInput={(params) => <TextField {...params} label="Province" fullWidth
                                                                            multiline
                                        />}/>
                                </Grid2>


                            </Collapse>


                            {/*Aggregation*/}
                            <Grid2 item xs={12} style={{
                                cursor: "pointer",
                                borderBottomStyle: "solid",
                                borderBottomWidth: 1,
                                borderBottomColor: '#80808061'
                            }}>
                                <div style={{display: "flex"}} onClick={e => {
                                    toggleOpenBar("aggregate")
                                }}>
                                    <Typography varant={"body2"} style={{width: "95%"}}>
                                        Aggregation
                                    </Typography>


                                    {openBar.aggregate ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}

                                </div>

                            </Grid2>
                            <Collapse in={openBar.aggregate}>
                                <Grid2 item xs={12}>
                                    <FormControl1 component="fieldset">
                                        <FormLabel component="legend">Camera</FormLabel>
                                        <FormGroup aria-label="position">

                                            {cameras.map((item, index) => <FormControlLabel
                                                value="1"
                                                control={<CheckBox1
                                                    onChange={(event) => {
                                                        let array = value.cameras;

                                                        if (event.target.checked)
                                                            array.push(item.id)
                                                        else {
                                                        let index=array.indexOf(item.id);
                                                            array.splice(index, 1);
                                                        }
                                                        handleChange({
                                                            ...value,
                                                            cameras: array
                                                        })
                                                    }}/>}
                                                label={`${item.name}`}
                                            />)}


                                        </FormGroup>
                                    </FormControl1>

                                </Grid2>

                            </Collapse>


                            <Grid2 item xs={12}>
                                <div style={{display: "flex", flexDirection: "row-reverse", margin: 10}}>


                                    <LoadingButton1
                                        type={"button"}
                                        loading={isGetting}
                                        onClick={(e) => {
                                            if (page === 1)
                                                (async () => {
                                                    await getReport(1);
                                                })();
                                            else
                                                setPage(1);
                                        }}
                                    >
                                        Show
                                    </LoadingButton1>

                                    <Button2
                                        onClick={resetForm}
                                        size="small"
                                        edge="start">
                                        Reset
                                    </Button2>

                                </div>
                            </Grid2>

                        </Grid2>
                    </div>
                </Grid2>
                <Grid2 item xs={9}>
                    <Card elevation={3} style={{
                        minHeight: 'calc(100vh - 180px)',
                        position: "relative",
                        overflow: "auto",
                        maxHeight: 'calc(100vh - 180px)'
                    }}>
                        <div style={{position: 'absolute', top: 10, right: 10, display: "flex", alignItems: "center"}}>
                            <div style={{margin: 2}}>
                                <Tooltip title={'Records'}>
                                    <Chip icon={<ViewKanbanRoundedIcon/>} label={`${count}`} variant="outlined"/>

                                </Tooltip>
                            </div>


                            <Tooltip title={"Export Report"}>
                                <IconButton
                                    size="small"
                                    edge="start"
                                    color="inherit"
                                    onClick={() => {
                                        toggleOpenBar("export");
                                    }}>
                                    <SaveIcon style={{color: "#58595b"}}/>
                                </IconButton>
                            </Tooltip>


                        </div>
                        {rows.length ?
                            <CustomTable headers={headers} rows={rows} loading={isGetting} bottom={0}
                                         hasTitle
                                         containerStyle={{display: "flex", justifyContent: "center"}} page={page}
                                         pageCount={rowCount} hasIndex/>
                            : ''}

                    </Card>
                    <div style={{
                        marginTop: 15,
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "calc(100% - 26px)"
                    }}>
                        <Pagination count={count2} page={page} onChange={handleChangePage}/>
                        <div style={{width: 65}}>
                            <FormControl1 className={'trs'}>
                                <InputLabel id="demo-simple-select-label"></InputLabel>
                                <Select1
                                    labelId="demo-simple-select-label"
                                    id="trs"
                                    value={rowCount}
                                    label=""
                                    onChange={handleRowCountSelectChange}

                                >
                                    <MenuItem value={10}>10</MenuItem>
                                    <MenuItem value={20}>20</MenuItem>
                                    <MenuItem value={50}>50</MenuItem>
                                    <MenuItem value={100}>100</MenuItem>
                                </Select1>
                            </FormControl1>
                        </div>

                    </div>
                </Grid2>
            </Grid2>
        </Container>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="error" sx={{width: '100%'}}>
                {message}
            </Alert>
        </Snackbar>


    </div>
};

export default TrafficReport;