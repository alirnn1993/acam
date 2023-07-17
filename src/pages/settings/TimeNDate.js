import React, {useState} from "react";
import styles from "../../assets/css/dashboard.module.scss";
import { Container, InputLabel, MenuItem, TextField, Typography} from "@mui/material";
import Card from "@mui/material/Card";
import Stack from '@mui/material/Stack';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {TimePicker} from '@mui/x-date-pickers/TimePicker';
import {DesktopDatePicker} from '@mui/x-date-pickers/DesktopDatePicker';
import dayjs from 'dayjs';
import Grid2 from "@mui/material/Unstable_Grid2";
import {SettingApi} from "../../utils/SettingApi";
import {useDataState} from "../../context/DataContext";
import Select1 from "../../components/subComponents/Select";
import FormControl1 from "../../components/subComponents/FormControl";
import LoadingButton1 from "../../components/subComponents/LoadingButton";

const TimeNDate = (props) => {
    const data = useDataState();
    const [value1, setValue1] = useState(dayjs('2014-08-18T21:11:54'));
    const [method, SetMethod] = useState(data.values.time.method);
    const [isSending1, setIsSending1] = useState(false);
    const handleChangeMethod = (event) => {
        SetMethod(event.target.value);
    };
    const handleChange1 = (newValue) => {
        setValue1(newValue);
    };

    const handleSubmit = () => {
        setIsSending1(true);
        const response = (result) => {
            (async ()=>{
                await data.refreshData();
            })();
            setIsSending1(false);

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

    return <div style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100%"
    }}>
        <Container maxWidth={"md"}>
            <Card elevation={1} className={styles.card}>

                <Typography variant={"h5"} component={"h5"} style={{color:'#9a9a9a',fontWeight:100}}>
                    Time & Date
                </Typography>
                <Grid2 container spacing={2}>
                    <Grid2 item xs={12} md={4} style={{display: "flex", alignItems: "center"}}>
                        <FormControl1 fullWidth sx={{m: 1}} >
                            <InputLabel id="demo-simple-select-label">Set time method</InputLabel>
                            <Select1
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={method}
                                label="Set time method"
                                onChange={handleChangeMethod}
                            >
                                <MenuItem value={1}>Internet</MenuItem>
                                <MenuItem value={2}>NTP Server</MenuItem>
                                <MenuItem value={3}>Manual</MenuItem>
                            </Select1>
                        </FormControl1>
                    </Grid2>
                    <Grid2 item xs={12} md={8}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Stack spacing={3}>
                                <DesktopDatePicker
                                    label="Date"
                                    inputFormat="MM/DD/YYYY"
                                    value={value1}
                                    disabled={method !== 3}
                                    onChange={handleChange1}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                                <TimePicker
                                    label="Time"
                                    value={value1}
                                    onChange={handleChange1}
                                    disabled={method !== 3}

                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </Stack>
                        </LocalizationProvider>
                    </Grid2>

                    <Grid2 item xs={12}>
                        <div style={{display: "flex", flexDirection: "row-reverse", margin: 10}}>

                            <LoadingButton1
                                type={"button"}
                                onClick={handleSubmit}
                                loading={isSending1}
                            >
                                Submit
                            </LoadingButton1>

                            {/*<Button color={"error"}>Cancel</Button>*/}
                        </div>
                    </Grid2>
                </Grid2>


            </Card>
        </Container>
    </div>;
};

export default TimeNDate;