import React, {useEffect, useState} from "react";
import styles from "../../assets/css/dashboard.module.scss";
import {
    Card,
    Container, Dialog, DialogTitle, DialogContent, DialogActions,
    FormControlLabel, FormGroup, FormLabel,
    InputLabel,
    MenuItem,
    Snackbar, Tooltip,
    Typography, DialogContentText
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import {PlateApi} from "../../utils/PlateApi";
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import Button4 from "../../components/subComponents/Button4";
import CheckBox1 from "../../components/subComponents/CheckBox";
import FormControl1 from "../../components/subComponents/FormControl";
import {TextField as TextField1} from "../../components/subComponents/TextField";
import {Alert} from "@mui/lab";
import Pagination from "../../components/subComponents/Pagination";
import CustomTable from "../../components/Table";
import {TimePicker} from "@mui/x-date-pickers/TimePicker";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import IranPlate from "../../components/plates/IranPlate";
import TransitPlate from "../../components/plates/TransitPlate";
import BluePlate from "../../components/plates/BluePlate";
import FTZPlate from "../../components/plates/FTZPlate";
import MotorcyclePlate from "../../components/plates/MotorcyclePlate";
import Select1 from "../../components/subComponents/Select";
import LoadingButton1 from "../../components/subComponents/LoadingButton";
import dayjs from "dayjs";
import AddIcon from '@mui/icons-material/Add';
import FAB from "../../components/subComponents/FAB";
import Radio1 from "../../components/subComponents/Radio";
import Button2 from "../../components/subComponents/Button2";
import Button1 from "../../components/subComponents/Button1";

const List = () => {
    const constValue = {

        iran: {
            no1: null,
            no2: null,
            no3: null,
            no4: null,
            no5: null,
            no6: null,
            no7: null,
            letter: null
        },
        ftzPlate: {
            no1: null,
            no2: null,
            no3: null,
            no4: null,
            no5: null,
            no6: null,
            no7: null
        },
        transitPlate: {
            no1: null,
            no2: null,
            no3: null,
            no4: null,
            no5: null,
            no6: null,
            no7: null,
            letter: null
        },
        bluePlate: {
            no1: null,
            no2: null,
            no3: null,
            no4: null,
            no5: null,
            no6: null,
            no7: null,
            letter: null
        },
        motorcyclePlate: {
            no1: null,
            no2: null,
            no3: null,
            no4: null,
            no5: null,
            no6: null,
            no7: null,
            no8: null
        },
        saturday: false,
        sunday: false,
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        name: "",
        startTime: null,
        endTime: null,
        type: '',
        plateType: ''


    };
    const [message, setMessage] = useState({msg: '', logo: ""});
    const [open, setOpen] = useState(false);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [page1, setPage1] = useState(1);
    const [page2, setPage2] = useState(1);
    const [isSending, setIsSending] = useState(false);
    const [value, setValue] = useState(constValue);
    const [white, setWhite] = useState({count: 0, data: [], loading: false});
    const [black, setBlack] = useState({count: 0, data: [], loading: false});
    const [deleteId, setDeleteId] = useState({id: 0, type: ''});
    const [isDeleting, setIsDeleting] = useState(false);


    const handleOpenConfirmDialog = (id, type) => {
        setOpenConfirmDialog(true);
        setDeleteId({id: id, type: type});
    }
    const handleCloseDialog = () => {
        setOpenDialog(false);
    }
    const handleOpenDialog = (type) => {
        setOpenDialog(true);
        handleChange({...value, type: type})
    }

    const handleChangePage1 = (event, value) => {
        setPage1(value);

    };
    const handleChangePage2 = (event, value) => {
        setPage2(value);

    };


    const handleCloseConfirmDialog = () => {
        setOpenConfirmDialog(false);
    }
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };
    const showMessage = (message, logo) => {
        setMessage({msg: message, logo: logo});
        setOpen(true);
    }

    const handleChange = (newValue) => {
        setValue(newValue);
    };


    const deletePlate = (id, type) => {

        const response = (result) => {
            handleCloseConfirmDialog();
            showMessage("delete was successful", "success");
            if (type === 'white')
                (async () => {
                    await getWhiteList();
                })();
            else
                (async () => {
                    await getBlackList();
                })();
        }
        const error = (e) => {
            handleCloseConfirmDialog();
            showMessage("An Error occurred!", "error");

        }

        (async () => {
            await PlateApi.deletePlate(id, response, error);
        })();
    }

    const addNew = async () => {
        setIsSending(true);
        const response = (result) => {
            setIsSending(false);
            handleCloseDialog();
            showMessage("insert was successful", "success");
            if (value.type === "white")
                (async () => {
                    await getWhiteList();
                })();
            else
                (async () => {
                    await getBlackList();
                })();
            setValue(constValue);
        }
        const error = (e) => {
            setIsSending(false);
            checkError(e.response.status);

        }
        let fd = new FormData();
        fd.append("payload", JSON.stringify(value));
        await PlateApi.addPlate(fd, response, error);
    }

    const checkError = (no) => {
        switch (no) {
            case 501:
                showMessage("Start time bust be lower than end time!", "error");
                break;
            case 502:
            case 506:
                showMessage("Invalid Plate!", "error");
                break;
            case 503:
                showMessage("Conflict time with black or white list!", "error");
                break;
            case 504:
                showMessage("Error occurred!", "error");
                break;
            case 507:
                showMessage("List type is necessary!", "error");
                break;
            case 508:
                showMessage("Name is necessary!", "error");
                break;
            case 509:
                showMessage("Start time & end time are necessary!", "error");
                break;
            case 510:
                showMessage("No days selected!", "error");
                break;
        }
    }
    const getWhiteList = async () => {
        setWhite({...white, loading: true});
        const response = (result) => {
            setWhite({data: result.data.data, count: Math.ceil(result.data.count / 10), loading: false});

        }

        const error = (e) => {
            setWhite({...white, loading: false});

        }

        await PlateApi.getAllPlate('white', page1, response, error);
    }

    const getBlackList = async () => {
        setBlack({...white, loading: true});

        const response = (result) => {
            setBlack({data: result.data.data, count: Math.ceil(result.data.count / 10), loading: false});

        }

        const error = (e) => {
            setBlack({...white, loading: false});

        }

        await PlateApi.getAllPlate('black', page2, response, error);
    }

    const headers = [
        {
            field: 'title', title: 'Plate', width: 100, renderCell: (row) => (
                <div style={{display: "flex", justifyContent: "center", width: "100%", textAlign: "center"}}>
                    {row.plateType === "iran" ?
                        <IranPlate value={{
                            no1: row.plate.substring(0, 1),
                            no2: row.plate.substring(1, 2),
                            letter: row.plate.substring(2, 4),
                            no3: row.plate.substring(4, 5),
                            no4: row.plate.substring(5, 6),
                            no5: row.plate.substring(6, 7),
                            no6: row.plate.substring(7, 8),
                            no7: row.plate.substring(8)
                        }} disabled/> :

                        row.plateType === "ftz" ? <FTZPlate disabled value={{
                                no1: row.plate.substring(0, 1),
                                no2: row.plate.substring(1, 2),
                                no3: row.plate.substring(2, 3),
                                no4: row.plate.substring(3, 4),
                                no5: row.plate.substring(4, 5),
                                no6: row.plate.substring(5, 6),
                                no7: row.plate.substring(6)
                            }}/> :
                            (row.plateType === "blue" ?

                                <BluePlate value={{
                                    no1: row.plate.substring(0, 1),
                                    no2: row.plate.substring(1, 2),
                                    letter: row.plate.substring(2, 4),
                                    no3: row.plate.substring(4, 5),
                                    no4: row.plate.substring(5, 6),
                                    no5: row.plate.substring(6, 7),
                                    no6: row.plate.substring(7, 8),
                                    no7: row.plate.substring(8)
                                }} disabled/> :

                                (row.plateType === "motorcycle") ?
                                    <MotorcyclePlate disabled value={{
                                        no1: row.plate.substring(0, 1),
                                        no2: row.plate.substring(1, 2),
                                        no3: row.plate.substring(2, 3),
                                        no4: row.plate.substring(3, 4),
                                        no5: row.plate.substring(4, 5),
                                        no6: row.plate.substring(5, 6),
                                        no7: row.plate.substring(6, 7),
                                        no8: row.plate.substring(7)
                                    }}/> :


                                    <TransitPlate value={{
                                        no1: row.plate.substring(0, 1),
                                        no2: row.plate.substring(1, 2),
                                        letter: row.plate.substring(2, 4),
                                        no3: row.plate.substring(4, 5),
                                        no4: row.plate.substring(5, 6),
                                        no5: row.plate.substring(6, 7),
                                        no6: row.plate.substring(7, 8),
                                        no7: row.plate.substring(8)
                                    }} disabled/>)}
                </div>
            )
        },
        {
            field: 'title', title: 'Name', width: 80, renderCell: (row) => (
                <div style={{display: "block", width: "100%", textAlign: "center"}}>
                    {row.name}

                </div>
            ),
        },
        {
            field: 'title', title: 'Time', width: 120, renderCell: (row) => (
                <div style={{display: "block", width: "100%", textAlign: "center"}}>
                    {row.days}
                    <br/>
                    {row.time1}-{row.time2}
                </div>
            ),
        },

        {
            field: 'title', title: '', width: 30, renderCell: (row) => (
                <div style={{display: "block", width: "100%", textAlign: "center"}}>
                    <Button4 color="primary" onClick={() => {

                        handleOpenConfirmDialog(row.id, row.type);
                        // deletePlate(row.id, row.type);
                    }}>
                        <DeleteRoundedIcon/>
                    </Button4>
                </div>
            ),
        }


    ];
    useEffect(() => {
        (async () => {
            await getWhiteList();
        })();
    }, [page1]);
    useEffect(() => {
        (async () => {
            await getBlackList();
        })();
    }, [page2]);

    return <div>

        <Container maxWidth={"xl"}>
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Add New</DialogTitle>
                <DialogContent style={{paddingTop: 10}}>
                    <Grid2 container spacing={2}>
                        <Grid2 item xs={6}>

                            <TextField1
                                fullWidth
                                label="Name"
                                type="text"
                                value={value.name}
                                // onChange={formik.handleChange}
                                onChange={(e) => {
                                    setValue({
                                        ...value,
                                        name: e.target.value
                                    })
                                }}
                                variant="outlined"

                            />
                        </Grid2>
                        <Grid2 item xs={6}>
                            <FormControl1 fullWidth>
                                <InputLabel id="demo-simple-select-label">Type</InputLabel>
                                <Select1
                                    labelId="demo-simple-select-label"
                                    value={value.type}
                                    label="type"
                                    onChange={event => {
                                        setValue({...value, type: event.target.value})
                                    }}
                                >
                                    <MenuItem value={'white'}>White</MenuItem>
                                    <MenuItem value={'black'}>Black</MenuItem>
                                </Select1>
                            </FormControl1>
                        </Grid2>

                        <Grid2 item xs={6}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <TimePicker
                                    label="Start Time"
                                    value={value.startTime ? dayjs(value.startTime).add(-3, "h").add(-30, "m").toDate() : null}
                                    onChange={e => {
                                        handleChange({
                                            ...value,
                                            startTime: dayjs(e.$d).add(3, "h").add(30, "m").toDate()
                                        })
                                    }}

                                    renderInput={(params) => <TextField1 {...params} fullWidth/>}
                                />
                            </LocalizationProvider>
                        </Grid2>
                        <Grid2 item xs={6}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <TimePicker
                                    label="End Time"
                                    value={value.endTime ? dayjs(value.endTime).add(-3, "h").add(-30, "m").toDate() : null}

                                    onChange={e => {
                                        handleChange({
                                            ...value,
                                            endTime: dayjs(e.$d).add(3, "h").add(30, "m").toDate()
                                        })
                                    }}

                                    renderInput={(params) => <TextField1 {...params} fullWidth/>}
                                />
                            </LocalizationProvider>
                        </Grid2>


                        <Grid2 item xs={12}>
                            <FormControl1 component="fieldset">
                                <FormLabel component="legend"></FormLabel>
                                <FormGroup aria-label="position" row style={{justifyContent: "center"}}>
                                    <FormControlLabel
                                        value="saturday"
                                        style={{marginLeft: 5, marginRight: 5}}
                                        control={<CheckBox1 checked={value.saturday} name={"saturday"}
                                                            onChange={(event) => {
                                                                setValue({
                                                                    ...value,
                                                                    [event.target.name]: event.target.checked

                                                                })
                                                            }}/>}
                                        label="Sat"
                                        labelPlacement="top"
                                    />
                                    <FormControlLabel
                                        value="sunday"
                                        style={{marginLeft: 5, marginRight: 5}}
                                        control={<CheckBox1 checked={value.sunday} name={"sunday"}
                                                            onChange={(event) => {
                                                                setValue({
                                                                    ...value,
                                                                    [event.target.name]: event.target.checked

                                                                })
                                                            }}/>}
                                        label="Sun"
                                        labelPlacement="top"
                                    />
                                    <FormControlLabel
                                        value="monday"
                                        style={{marginLeft: 5, marginRight: 5}}
                                        control={<CheckBox1 checked={value.monday} name={"monday"}
                                                            onChange={(event) => {
                                                                setValue({
                                                                    ...value,
                                                                    [event.target.name]: event.target.checked

                                                                })
                                                            }}/>}
                                        label="Mon"
                                        labelPlacement="top"
                                    />
                                    <FormControlLabel
                                        value="tuesday"
                                        style={{marginLeft: 5, marginRight: 5}}
                                        control={<CheckBox1 checked={value.tuesday} name={"tuesday"}
                                                            onChange={(event) => {
                                                                setValue({
                                                                    ...value,
                                                                    [event.target.name]: event.target.checked

                                                                })
                                                            }}/>}
                                        label="Tue"
                                        labelPlacement="top"
                                    />
                                    <FormControlLabel
                                        value="wednesday"
                                        style={{marginLeft: 5, marginRight: 5}}
                                        control={<CheckBox1 checked={value.wednesday} name={"wednesday"}
                                                            onChange={(event) => {
                                                                setValue({
                                                                    ...value,
                                                                    [event.target.name]: event.target.checked

                                                                })
                                                            }}/>}
                                        label="Wed"
                                        labelPlacement="top"
                                    />
                                    <FormControlLabel
                                        value="thursday"
                                        style={{marginLeft: 5, marginRight: 5}}
                                        control={<CheckBox1 checked={value.thursday} name={"thursday"}
                                                            onChange={(event) => {
                                                                setValue({
                                                                    ...value,
                                                                    [event.target.name]: event.target.checked

                                                                })
                                                            }}/>}
                                        label="Thr"
                                        labelPlacement="top"
                                    />
                                    <FormControlLabel
                                        value="friday"
                                        style={{marginLeft: 5, marginRight: 5}}
                                        control={<CheckBox1 checked={value.friday} name={"friday"}
                                                            onChange={(event) => {
                                                                setValue({
                                                                    ...value,
                                                                    [event.target.name]: event.target.checked

                                                                })
                                                            }}/>}
                                        label="Fri"
                                        labelPlacement="top"
                                    />
                                </FormGroup>
                            </FormControl1>
                        </Grid2>
                        <Grid2 item xs={12} style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                            <div style={{marginTop: 15, marginBottom: 15}}>
                                <FormControl1>
                                    <FormControlLabel
                                        control={<Radio1 checked={value.plateType === 'iran'} value={'iran'}
                                                         onChange={e => {
                                                             handleChange({...value, plateType: e.target.value})
                                                         }}/>} label={
                                        <div style={{marginTop: 15, marginBottom: 15}}>
                                            <Tooltip title={"Standard Plate"} followCursor>
                                                <IranPlate handleChange={e => {
                                                    handleChange({...value, iran: e})
                                                }} value={value.iran}
                                                           disabled={value.plateType !== 'iran'}/>
                                            </Tooltip>
                                        </div>}/>

                                    <FormControlLabel
                                        control={<Radio1 checked={value.plateType === 'transit'} value={'transit'}
                                                         onChange={e => {
                                                             handleChange({...value, plateType: e.target.value})
                                                         }}/>} label={
                                        <div style={{marginTop: 15, marginBottom: 15}}>
                                            <Tooltip title={"Transit Plate"} followCursor>

                                                <TransitPlate handleChange={e => {
                                                    handleChange({...value, transitPlate: e})
                                                }} value={value.transitPlate}
                                                              disabled={value.plateType !== 'transit'}/>
                                            </Tooltip>
                                        </div>
                                    }/>

                                    <FormControlLabel
                                        control={
                                            <Radio1
                                                checked={value.plateType === 'blue'}
                                                value={'blue'}

                                                onChange={e => {
                                                    handleChange({...value, plateType: e.target.value})
                                                }}/>}
                                        label={
                                            <div style={{marginTop: 15, marginBottom: 15}}>
                                                <Tooltip title={"Diplomat Plate"} followCursor>
                                                    <BluePlate handleChange={e => {
                                                        handleChange({...value, bluePlate: e})
                                                    }} value={value.bluePlate}
                                                               disabled={value.plateType !== 'blue'}/>
                                                </Tooltip>
                                            </div>}/>

                                    <FormControlLabel control={<Radio1
                                        checked={value.plateType === 'ftz'}
                                        value={'ftz'}

                                        onChange={e => {
                                            handleChange({...value, plateType: e.target.value})
                                        }}/>} label={<div style={{margin: 5}}>
                                        <Tooltip title={"FTZ Plate"} followCursor>
                                            <FTZPlate handleChange={e => {
                                                handleChange({...value, ftzPlate: e})
                                            }} value={value.ftzPlate}
                                                      disabled={value.plateType !== 'ftz'}/>
                                        </Tooltip>

                                    </div>}/>

                                    <FormControlLabel control={<Radio1
                                        checked={value.plateType === 'motorcycle'}
                                        value={'motorcycle'}

                                        onChange={e => {
                                            handleChange({...value, plateType: e.target.value})
                                        }}/>} label={<div style={{margin: 5}}>
                                        <Tooltip title={"Motorcycle Plate"} followCursor>

                                            <MotorcyclePlate handleChange={e => {
                                                handleChange({...value, motorcyclePlate: e})
                                            }} value={value.motorcyclePlate}
                                                             disabled={value.plateType !== 'motorcycle'}/>
                                        </Tooltip>
                                    </div>}/>

                                </FormControl1>


                            </div>


                        </Grid2>

                    </Grid2>

                </DialogContent>
                <DialogActions>
                    <Button2 onClick={handleCloseDialog}>
                        Cancel
                    </Button2>
                    <LoadingButton1
                        type={"button"}
                        loading={isSending}
                        onClick={(e) => {
                            (async () => {
                                await addNew();
                            })();
                        }}
                    >
                        Submit
                    </LoadingButton1>
                </DialogActions>
            </Dialog>

            <Grid2 container spacing={2}>

                <Grid2 item xs={6}>
                    <Card elevation={1} className={styles.card} style={{position: "relative"}}>
                        <div style={{position: "absolute", bottom: 15, right: 15, zIndex: 15}}>
                            <Tooltip title={"New White"}>
                                <FAB size="small" color="secondary" aria-label="add"
                                     onClick={e => handleOpenDialog('white')}>
                                    <AddIcon/>
                                </FAB>
                            </Tooltip>
                        </div>
                        <Typography variant={"h5"} component={"h5"} style={{color: '#9a9a9a', fontWeight: 100}}>
                            White List
                        </Typography>


                        <div style={{height: 'calc(100vh - 190px)', marginTop: 10, position: "relative"}}>
                            <CustomTable headers={headers} rows={white.data} loading={white.loading} fixed
                                         containerStyle={{bottom: 30}} hasTitle/>

                            {/*{white.data.map((item, index) => <Item {...item} delete={deletePlate} type={1}/>)}*/}
                        </div>
                        <div style={{
                            display: "flex",
                            justifyContent: "center",
                            marginTop: 5
                        }}>
                            <Pagination count={white.count} page={page1} onChange={handleChangePage1}/>
                        </div>
                    </Card>
                </Grid2>
                <Grid2 item xs={6}>
                    <Card elevation={1} className={styles.card} style={{position: "relative"}}>
                        <div style={{position: "absolute", bottom: 15, right: 15, zIndex: 15}}>
                            <Tooltip title={"New Black"}>
                                <FAB size="small" color="secondary" aria-label="add"
                                     onClick={e => handleOpenDialog("black")}>
                                    <AddIcon/>
                                </FAB>
                            </Tooltip>
                        </div>
                        <Typography variant={"h5"} component={"h5"} style={{color: '#9a9a9a', fontWeight: 100}}>
                            Black List
                        </Typography>


                        <div style={{height: 'calc(100vh - 190px)', marginTop: 10, position: "relative"}}>
                            <CustomTable headers={headers} rows={black.data} loading={black.loading} fixed
                                         containerStyle={{bottom: 30}} hasTitle/>

                            {/*{white.data.map((item, index) => <Item {...item} delete={deletePlate} type={1}/>)}*/}
                        </div>
                        <div style={{
                            display: "flex",
                            justifyContent: "center",
                            marginTop: 5
                        }}>
                            <Pagination count={black.count} page={page2} onChange={handleChangePage2}/>
                        </div>
                    </Card>
                </Grid2>
            </Grid2>


        </Container>
        <Dialog
            open={openConfirmDialog}
            onClose={handleCloseConfirmDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                Are you sure to delete??
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button2 onClick={handleCloseConfirmDialog}>Cancel</Button2>
                <LoadingButton1
                    type={"button"}
                    loading={isDeleting}
                    autoFocus
                    onClick={() => {
                        (async () => {
                            await deletePlate(deleteId.id, deleteId.type);
                        })();
                    }}
                >
                    Yes
                </LoadingButton1>

            </DialogActions>
        </Dialog>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity={message.logo} sx={{width: '100%'}}>
                {message.msg}
            </Alert>
        </Snackbar>
    </div>;
};

export default List;
