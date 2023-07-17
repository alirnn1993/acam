import react, {useEffect, useRef, useState} from "react";
import React from "react";
import './App.css';
import {Card, Container, MenuItem} from "@mui/material";
import InputLabel from "./components/subComponents/InputLabel";
import {SelectChangeEvent} from "@mui/material";
import Select from '@mui/material/Select';
import FormControl1 from "./components/subComponents/FormControl";
import styles from "./assets/css/dashboard.module.scss";
import Button2 from "./components/subComponents/Button2";
import Button3 from "./components/subComponents/Button3";
import Button1 from "./components/subComponents/Button1";

const PlateTest = () => {
    const [lane, setLane] = React.useState('');
    const [modify, setModify] = useState(false);
    const handleChange = (event: SelectChangeEvent) => {
        setLane(event.target.value);
    };
    const canvas = useRef();
    let ctx = null;
    const [tmp, setTmp] = useState([]);
    const initialValue = {
        camera: [{x: 20, y: 20}, {x: 30, y: 35}, {x: 35, y: 40}, {x: 32, y: 31}],
        lane1: [{x: 50, y: 20}, {x: 100, y: 20}, {x: 100, y: 70}, {x: 50, y: 70}],
        lane2: [],
        lane3: [],
        lane4: [],
        lane5: [],
        lane6: [],
        lane7: [],
        lane8: []
    }
    const [lanes, setLanes] = useState(initialValue);
    const names = ["camera", "lane1", "lane2", "lane3", "lane4", "lane5", "lane6", "lane7", "lane8"]
    useEffect(() => {


        const canvasEle = canvas.current;
        canvasEle.width = canvasEle.clientWidth;
        canvasEle.height = canvasEle.clientHeight;


        ctx = canvasEle.getContext("2d");
    }, []);


    function draw() {
        clear();
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 1;
        ctx.beginPath();
        // draw alle the lines
        if (!modify && !lane)
            names.forEach((name, index) => {
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


        if (tmp.length > 1) {
            tmp.forEach((point, index) => {
                if (index === 0)
                    ctx.moveTo(point.x, point.y);
                else ctx.lineTo(point.x, point.y);
            })
            ctx.lineTo(tmp[0].x, tmp[0].y);
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


    useEffect(() => {
        draw();
    }, [tmp, lane]);








    return <Container maxWidth={"md"}>
        <Card elevation={3} className={styles.card}>
            <div>

            </div>
            <FormControl1 fullWidth>
                <InputLabel id="demo-simple-select-label">Lane</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={lane}
                    label="Lane"
                    onChange={handleChange}
                    disabled={modify}
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    <MenuItem value={'lane1'}>Lane 1</MenuItem>
                    <MenuItem value={'lane2'}>Lane 2</MenuItem>
                    <MenuItem value={'lane3'}>Lane 3</MenuItem>
                    <MenuItem value={'lane4'}>Lane 4</MenuItem>
                    <MenuItem value={'lane5'}>Lane 5</MenuItem>
                    <MenuItem value={'lane6'}>Lane 6</MenuItem>
                    <MenuItem value={'lane7'}>Lane 7</MenuItem>
                    <MenuItem value={'lane8'}>Lane 8</MenuItem>
                    <MenuItem value={'camera'}>Camera</MenuItem>
                </Select>
            </FormControl1>
            <Button1 disabled={!lane || modify} onClick={() => {
                setModify(true);
                clear();
            }}>Modify</Button1>
            <Button3 disabled={!modify} onClick={() => {
                setModify(false);
                setTmp([]);
                setLane("");
            }}>Cancel</Button3>
            <Button3 disabled={!modify}
                     onClick={() => {
                         setLanes({...lanes, [lane]: tmp});
                         setTmp([]);
                         setLane("");
                         setModify(false);

                     }}>Confirm</Button3>
            <div style={{width: "100%", display: "flex", justifyContent: "center"}}>
                <canvas ref={canvas}
                        onClick={e => {
                            if (modify) {
                                let rect = e.target.getBoundingClientRect();
                                let x = e.clientX - rect.left; //x position within the element.
                                let y = e.clientY - rect.top;  //y position within the element.
                                let array = tmp;
                                array.push({x: x, y: y});
                                setTmp(array);
                                draw();
                            }


                        }}
                ></canvas>
            </div>

        </Card>


    </Container>
};

export default PlateTest;