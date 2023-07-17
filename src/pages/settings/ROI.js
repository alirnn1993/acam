import {useEffect, useRef, useState} from "react";
import React from "react";
import {Card, Container, MenuItem, Tooltip} from "@mui/material";
import InputLabel from "../../components/subComponents/InputLabel";
import {SelectChangeEvent} from "@mui/material";
import Select from '@mui/material/Select';
import FormControl1 from "../../components/subComponents/FormControl";
import styles from "../../assets/css/dashboard.module.scss";
import {ROIApi} from "../../utils/ROIApi";
import LoadingButton1 from "../../components/subComponents/LoadingButton";
import Grid2 from "@mui/material/Unstable_Grid2";
import Button4 from "../../components/subComponents/Button4";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import CreateRoundedIcon from '@mui/icons-material/CreateRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import ReactPlayer from "react-player";
import {LiveApi} from "../../utils/LiveApi";

const ROI = () => {
    const [lane, setLane] = React.useState('');
    const [modify, setModify] = useState(false);
    const [isSending, setSending] = useState(false);
    const [camera,setCamera]=useState(0);
    const handleChange = (event: SelectChangeEvent) => {
        setLane(event.target.value);
    };
    const canvas = useRef();
    let ctx = null;
    const [tmp, setTmp] = useState([]);
    const initialValue = {
        camera: [],
        speed: [],
        lane1: [],
        lane2: [],
        lane3: [],
        lane4: [],
        lane5: [],
        lane6: [],
        lane7: [],
        lane8: []
    }
    const [lanes, setLanes] = useState(initialValue);
    const names = ["speed", "camera", "lane1", "lane2", "lane3", "lane4", "lane5", "lane6", "lane7", "lane8"];
    const colors = ["#00ffff", "#ff00ff", "#0000ff", "#ff0000", "#00ff00", "#ffff00", "#ffa500", "#8f00ff", "#8f00ff"];

    const {
        host, hostname, href, origin, pathname, port, protocol
    } = window.location;

    useEffect(() => {
        const canvasEle = canvas.current;
        canvasEle.width = canvasEle.clientWidth;
        canvasEle.height = canvasEle.clientHeight;
        ctx = canvasEle.getContext("2d");
        (async () => {
            await getData();
        })();

    }, []);


    useEffect(() => {
        draw();
    }, [modify])

    const getData = async () => {
        const response = ({data}) => {
            let obj = {};
            for (let i = 0; i < data.length; i++) {
                obj[data[i].name] = JSON.parse(data[i].value);
            }
            setLanes(obj);
        }
        const error = (e) => {

        }
        await ROIApi.get(response, error);
    }


    const submitData = async () => {
        setSending(true);
        const response = () => {
            setSending(false);
        }

        const error = () => {
            setSending(false);

        }

        await ROIApi.set({payload: lanes}, response, error)
    }


    function draw(status = false) {
        clear();
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 1;
        ctx.beginPath();
        // draw alle the lines
        if (!modify && !lane)
            names.forEach((name, index) => {
                ctx.strokeStyle = colors[index];
                if (lanes[name].length) {
                    ctx.moveTo(lanes[name][0].x, lanes[name][0].y);
                    lanes[name].forEach((point, index) => {
                        if (index !== 0)
                            ctx.lineTo(point.x, point.y);
                    })
                    if (lanes[name].length > 2)
                        ctx.lineTo(lanes[name][0].x, lanes[name][0].y);
                }

            });
        if (lane && !modify) {
            if (lanes[lane].length) {

                ctx.moveTo(lanes[lane][0].x, lanes[lane][0].y);
                lanes[lane].forEach((point, index) => {
                    if (index !== 0)
                        ctx.lineTo(point.x, point.y);
                })
                if (lanes[lane].length > 2)
                    ctx.lineTo(lanes[lane][0].x, lanes[lane][0].y);
            }
        }
        if (lane && modify) {
            names.forEach((name, index) => {
                if (name !== lane)
                    if (lanes[name].length) {
                        ctx.strokeStyle = colors[index];

                        ctx.moveTo(lanes[name][0].x, lanes[name][0].y);
                        lanes[name].forEach((point, index) => {
                            if (index !== 0)
                                ctx.lineTo(point.x, point.y);
                        })
                        if (lanes[name].length > 2)
                            ctx.lineTo(lanes[name][0].x, lanes[name][0].y);
                    }

            });
        }


        if (tmp.length > 1) {

            tmp.forEach((point, index) => {
                if (index === 0)
                    ctx.moveTo(point.x, point.y);
                else ctx.lineTo(point.x, point.y);
            })
            if (status)
                ctx.lineTo(tmp[0].x, tmp[0].y);


        } else if (tmp.length === 1) {
            ctx.fillRect(tmp[0].x, tmp[0].y, 2, 2);
        }

        ctx.stroke();
        ctx.restore();
    }


    const clear = () => {
        if (!ctx)
            ctx = canvas.current.getContext("2d");
        ctx.clearRect(0, 0, 500, 500);
        ctx.save();
    }


    const startLive = async () => {
        await LiveApi.enableCamera(camera,() => {
            //
            window.liveURL = `${protocol}//${host}/playlist.m3u8?timestamp=${new Date().getTime()}`;
        }, () => {
        });
    }


    useEffect(()=>{
        (async ()=>{
            await startLive();
        })();
    },camra)



    useEffect(() => {
        draw();
        (async ()=>{
            await startLive();
        })();
    }, [tmp, lane, lanes]);


    return <Container maxWidth={"sm"}>
        <Card elevation={3} className={styles.card}>
            <Grid2 container spacing={2} style={{margin: 5}}>
                <Grid2 item xs={8}>
                    <FormControl1 fullWidth>
                        <InputLabel id="demo-simple-select-label">ROI Set</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={lane}
                            label="ROI Set"
                            onChange={handleChange}
                            disabled={modify}
                        >
                            <MenuItem value="">
                                <em>All</em>
                            </MenuItem>
                            <MenuItem value={'lane1'}>Lane 1</MenuItem>
                            <MenuItem value={'lane2'}>Lane 2</MenuItem>
                            <MenuItem value={'lane3'}>Lane 3</MenuItem>
                            <MenuItem value={'lane4'}>Lane 4</MenuItem>
                            <MenuItem value={'lane5'}>Lane 5</MenuItem>
                            <MenuItem value={'lane6'}>Lane 6</MenuItem>
                            <MenuItem value={'lane7'}>Lane 7</MenuItem>
                            <MenuItem value={'lane8'}>Lane 8</MenuItem>
                            <MenuItem value={'speed'}>Speed</MenuItem>
                            <MenuItem value={'camera'}>Camera</MenuItem>
                        </Select>
                    </FormControl1>

                </Grid2>
                <Grid2 item xs={4}>
                    <FormControl1 fullWidth>
                        <InputLabel id="demo-simple-select-label">Camera</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={camera}
                            label="ROI Set"
                            onChange={(event: SelectChangeEvent) => {
                                setCamera(event.target.value);
                            }}
                            disabled={modify}
                        >
                            <MenuItem value={0}>Camera 1</MenuItem>
                            <MenuItem value={1}>Camera 2</MenuItem>
                        </Select>
                    </FormControl1>

                </Grid2>
                <Grid2 item xs={12} md={12}>
                    <div style={{display: "flex", justifyContent: "center"}}>

                        <Tooltip title={"Delete"}>
                            <Button4 color="primary" disabled={!lane || modify || lanes[lane].length === 0}
                                     onClick={() => {
                                         setLanes({...lanes, [lane]: []});
                                         setLane('');
                                     }}>
                                <DeleteRoundedIcon/>
                            </Button4>
                        </Tooltip>


                        <Tooltip title={"Modify"}>

                            <Button4 color="primary" disabled={!lane || modify} onClick={() => {
                                setModify(true);
                                draw();
                            }}>
                                <CreateRoundedIcon/>
                            </Button4>
                        </Tooltip>

                        <Tooltip title={"Cancel"}>

                            <Button4 color="primary" disabled={!modify} onClick={() => {
                                setModify(false);
                                setTmp([]);
                                setLane("");
                            }}>
                                <ClearRoundedIcon/>
                            </Button4>
                        </Tooltip>
                        <Tooltip title={"Confirm"}>

                            <Button4 color="primary" disabled={!modify} onClick={() => {
                                setLanes({...lanes, [lane]: tmp});
                                setTmp([]);
                                setLane("");
                                setModify(false);
                            }}>
                                <CheckRoundedIcon/>
                            </Button4>

                        </Tooltip>
                    </div>
                </Grid2>
            </Grid2>

            <div style={{width: "100%", display: "flex", justifyContent: "center", position: "relative"}}>
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 1
                }}>
                    <ReactPlayer url={window.liveURL} width={"100%"} height={540}
                                 controls onPlay={() => {
                    }} onPause={() => {
                        // clearInterval(window.interval3);
                    }}
                                 onStart={() => {
                                     // startVideoTimer();

                                 }}
                                 style={{width: 500}}/>

                </div>

                <canvas ref={canvas} style={{zIndex: 3}}
                        onClick={e => {
                            if (modify) {
                                if (lane === "speed") {
                                    let rect = e.target.getBoundingClientRect();
                                    let x = e.clientX - rect.left; //x position within the element.
                                    let y = e.clientY - rect.top;  //y position within the element.
                                    let array = tmp;
                                    if (array.length < 2)
                                        array.push({x: x, y: y});
                                    else
                                        array[1] = {x: x, y: y};
                                    setTmp(array);
                                    draw();
                                } else {
                                    let rect = e.target.getBoundingClientRect();
                                    let x = e.clientX - rect.left; //x position within the element.
                                    let y = e.clientY - rect.top;  //y position within the element.
                                    let array = tmp;
                                    array.push({x: x, y: y});
                                    setTmp(array);
                                    draw();
                                }

                            }


                        }}
                        onDoubleClick={e => {
                            if (modify && lane !== 'speed') {
                                let rect = e.target.getBoundingClientRect();
                                let x = e.clientX - rect.left; //x position within the element.
                                let y = e.clientY - rect.top;  //y position within the element.
                                let array = tmp;
                                array.push({x: x, y: y});
                                setTmp(array);
                                draw(true);
                            }
                        }}
                ></canvas>
            </div>
            <div style={{display: "flex", flexDirection: "row-reverse", marginTop: 50}}>

                <LoadingButton1
                    onClick={() => {
                        submitData();
                    }}
                    loading={isSending}
                >
                    Submit
                </LoadingButton1>

                {/*<Button color={"error"}>Cancel</Button>*/}
            </div>
        </Card>


    </Container>
};

export default ROI;