import React, {useEffect, useState} from "react";
import {useGauge} from "use-gauge";
import styles from "../../assets/css/dashboard.module.scss";
import {Typography} from "@mui/material";
import $ from 'jquery';


const Gauge = (props) => {
    const [state, setState] = useState({
        value: props.value,
        diameter: 40,
        minValue: props.minValue,
        maxValue: props.maxValue,
        startAngle: 37.5,
        endAngle: 322.5,
        numTicks: 6,
    });

    useEffect(()=>{
        $('text').css("font-size","8px");

    });

    const {
        offset,
        strokeWidth: arcStrokeWidth,
        color: progressColor,
        strokeLineCap,
    } = {
        offset: 5,
        strokeWidth: 2,
        color: '#fb8500',
        strokeLineCap: 'round'
    }


    const {color: tickColor, length: tickLength} =
        {color: '#ccc', length: 5}


    const {
        baseRadius,
        tipRadius,
        color: needleColor,
    } = {baseRadius: 0, tipRadius: 0, color: '#fb8500'}

    useEffect(()=>{
        setState({...state,value: props.value})
    },[props.value]);

    const {
        ref,
        ticks,
        getTickProps,
        getLabelProps,
        valueToAngle,
        angleToValue,
        getArcProps,
        getNeedleProps,
        getSVGProps,
    } = useGauge({
        ...state,
        domain: [state.minValue, state.maxValue],
    });
    const {value, minValue, maxValue, startAngle, endAngle} = state;

    const {tip, base, points} = getNeedleProps({
        value,
        baseRadius,
        tipRadius,
    });

    return <div className={styles.chart1Container}>
        <svg ref={ref} {...getSVGProps()} >
            <path
                {...getArcProps({
                    offset,
                    startAngle,
                    endAngle,
                })}
                fill="none"
                className="stroke-gray-100"
                strokeWidth={arcStrokeWidth}
                // @ts-ignore
                strokeLinecap={strokeLineCap}
            />
            {state.value > minValue && (
                <path
                    {...getArcProps({
                        offset,
                        startAngle,
                        endAngle: valueToAngle(state.value),
                    })}
                    fill="none"
                    stroke={progressColor}
                    strokeWidth={arcStrokeWidth}
                    // @ts-ignore
                    strokeLinecap={strokeLineCap}
                />
            )}
            <g id="ticks">
                {ticks.map((angle) => {
                    return (
                        <React.Fragment key={`tick-group-${angle}`}>
                            <line
                                stroke={tickColor}
                                {...getTickProps({angle, length: tickLength})}
                            />
                            <text
                                className="text-sm fill-gray-500 font-medium"
                                {...getLabelProps({angle, offset: 6})}
                            >
                                {angleToValue(angle)}
                            </text>
                        </React.Fragment>
                    );
                })}
            </g>
            <g id="needle">
                <circle className="fill-gray-300" {...base} r={0}/>
                <circle fill={needleColor} {...base} />
                <circle fill={needleColor} {...tip} />
                <polyline fill={needleColor} points={points}/>
                <circle className="fill-white" {...base} r={0}/>

            </g>
        </svg>
        <div style={{
            position: "absolute",
            bottom: 23,
            paddingTop: 3,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
        }}>
            <div
                style={{
                    width: 16,
                    borderTopLeftRadius: "56%",
                    borderTopRightRadius: "56%",
                    borderColor: "gray",
                    borderStyle: "solid",
                    borderWidth: 2,
                    borderLeft: 0,
                    borderBottom: 0,
                    borderRight: 0,
                    height: 28,
                    paddingTop:0
                }}>
                <Typography variant={"body2"} style={{textAlign: "center", position: "relative",fontSize:"0.675rem"}}>
                    {value}
                    <span style={{position: "absolute", bottom: -9, right: -2}}>
                                                <Typography variant={"caption"} style={{color: "#fb8500",fontSize:10}}>
                                                    {props.unit}
                                                </Typography>
                                            </span>
                </Typography>
            </div>
        </div>
        <Typography variant={"caption"} component={"p"}
                    style={{display: "block", width: "fit-content", textAlign: "center", alignSelf: "center",marginTop:10,fontSize:"0.55rem"}}>
            {props.title}
        </Typography>
    </div>
}

export default Gauge;