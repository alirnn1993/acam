import React, {useEffect, useState} from "react";
import {LogApi} from "../utils/LogApi";
import {Alert} from "@mui/lab";
import Pagination from "../components/subComponents/Pagination";
import {Card, Collapse, Container, InputLabel, MenuItem} from "@mui/material";
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
import ButtonGroup from '@mui/material/ButtonGroup';
import styles from "../assets/css/dashboard.module.scss";
import Grid2 from "@mui/material/Unstable_Grid2";
import TimelineRoundedIcon from '@mui/icons-material/TimelineRounded';
import TableChartRoundedIcon from '@mui/icons-material/TableChartRounded';
import {Tooltip as T} from "@mui/material";
import Button2 from "../components/subComponents/Button2";
import Button1 from "../components/subComponents/Button1";
import FormControl1 from "../components/subComponents/FormControl";
import Select1 from "../components/subComponents/Select";



const Log = props => {

    const [page, setPage] = useState(1);
    const [data, setData] = useState([]);
    const [count, setCount] = useState(0);
    const [rows, setRows] = useState([]);
    const [active, setActive] = useState("");
    const count2 = count ? (count % 10 === 0 ? (count / 10) : (Math.floor(count / 10) + 1)) : 0;
    const [rowCount, setRowCount] = useState(10);

    const [openDetails, setOpenDetails] = useState({
        chart: false,
        table: true
    });

    const handleRowCountSelectChange = (event) => {
        setRowCount(event.target.value);

    }

    const handleChangeOpenDetail = (name) => {
        setOpenDetails({...openDetails, [name]: !openDetails[name]})
    }
    const handleChangePage = (event, value) => {
        setPage(value);

    };
    const getLogs = async () => {
        const response = ({data}) => {
            setRows(data.rows);
            setCount(data.count);
        }

        const error = (e) => {

        }

        await LogApi.get(`${page}/${10}`, response, error);
    }

    const getStates = async () => {
        const response = ({data}) => {
            setData(data);
        }
        const error = (e) => {

        }
        await LogApi.getState(`${rowCount}`, response, error)
    }
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

    useEffect(() => {
        (async () => {
            await getLogs();
        })();
    }, [page]);


    useEffect(() => {
        (async () => {
            await getStates();
        })();
    }, [rowCount]);
    return <Container maxWidth={"md"}>
        <Grid2 container spacing={2}>
            <Grid2 item xs={12}>
                <Card elevation={3} className={styles.card}>
                    <div style={{display: "flex", alignItems: "center", cursor: "pointer"}} onClick={e => {
                        handleChangeOpenDetail("chart")
                    }}>
                        {/*<img src={voltageLogo} alt={""} style={{width: 30}}/>*/}
                        <T title={"Board"}>
                            <TimelineRoundedIcon style={{color: "#5a5a5a", margin: 10}}/>
                        </T>
                        <div>
                            Chart
                        </div>
                    </div>
                    <Collapse in={openDetails.chart}>

                        <div>
                            <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                                <div style={{margin: 7}}>
                                    <ButtonGroup variant="outlined" aria-label="outlined button group">
                                        {active === "v3.3" ? <Button1 >V 3.3</Button1> : <Button2 onClick={e => {
                                            setActive("v3.3")
                                        }}>V 3.3</Button2>}

                                        {active === "v7.0" ? <Button1>V 7.0</Button1> : <Button2 onClick={e => {
                                            setActive("v7.0")
                                        }}>V 7.0</Button2>}


                                        {active === "v12.0" ? <Button1>V 12.0</Button1> : <Button2 onClick={e => {
                                            setActive("v12.0")
                                        }}>V 12.0</Button2>}


                                        {active === "c3.3" ? <Button1 >C 3.3</Button1> : <Button2 onClick={e => {
                                            setActive("c3.3")
                                        }}>C 3.3</Button2>}

                                        {active === "c7.0" ? <Button1>C 7.0</Button1> : <Button2 onClick={e => {
                                            setActive("c7.0")
                                        }}>C 7.0</Button2>}


                                        {active === "c12.0" ? <Button1>C 12.0</Button1> : <Button2 onClick={e => {
                                            setActive("c12.0")
                                        }}>C 12.0</Button2>}


                                    </ButtonGroup>

                                </div>
                                <LineChart
                                    width={500}
                                    height={300}
                                    data={data}
                                    margin={{
                                        top: 5,
                                        right: 30,
                                        left: 20,
                                        bottom: 5,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3"/>
                                    <XAxis dataKey="time"/>
                                    <YAxis/>
                                    <Tooltip/>
                                    <Legend/>
                                    {active === "v3.3" &&
                                        <Line type="monotone" dataKey="voltage3.3" stroke="#00ffff" activeDot={{r: 8}}/>}
                                    {active === "v7.0" && <Line type="monotone" dataKey="voltage7.0" stroke="#ff00ff"/>}
                                    {active === "v12.0" && <Line type="monotone" dataKey="voltagae12.0" stroke="#0000ff"/>}


                                    {active === "c3.3" && <Line type="monotone" dataKey="current3.3" stroke="#ff0000"/>}
                                    {active === "c7.0" && <Line type="monotone" dataKey="current7.0" stroke="#00ff00"/>}
                                    {active === "c12.0" && <Line type="monotone" dataKey="current12.0" stroke="#ffff00"/>}

                                </LineChart>


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

                        </div>
                    </Collapse>
                </Card>

            </Grid2>
            <Grid2 item xs={12}>
                <Card elevation={3} className={styles.card}>
                    <div style={{display: "flex", alignItems: "center", cursor: "pointer"}} onClick={e => {
                        handleChangeOpenDetail("table")
                    }}>
                        {/*<img src={voltageLogo} alt={""} style={{width: 30}}/>*/}
                        <T title={"Board"}>
                            <TableChartRoundedIcon style={{color: "#5a5a5a", margin: 10}}/>
                        </T>
                        <div>
                            Table
                        </div>
                    </div>
                    <Collapse in={openDetails.table}>

                        <div>
                            <div style={{minHeight: "calc(100vh - 300px)"}}>
                                {rows.map(item => <div style={{marginTop: 10}}><Alert
                                    severity={levelLog(item.level)}>{item.msg} at {item.date}</Alert></div>)}
                            </div>

                            <div style={{
                                marginTop: 15,
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "calc(100% - 26px)"
                            }}>
                                <Pagination count={count2} page={page} onChange={handleChangePage}/>
                            </div>

                        </div>

                    </Collapse>
                </Card>

            </Grid2>
        </Grid2>
    </Container>;
};

export default Log;