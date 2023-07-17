import React from "react";
import plateStyle from "../../assets/css/plate.module.scss";
import {IMask} from "react-imask";
import {emulateTab} from "emulate-tab";
import PropTypes from "prop-types";
import IranPlate from "./IranPlate";
let PlateNo1 = IMask.createPipe({
    mask: "No",
    blocks: {
        No: {
            mask: IMask.MaskedRange,
            from: 1,
            to: 9
        }
    },
    overwrite: true
});

let PlateNo2 = IMask.createPipe({
    mask: "No",
    blocks: {
        No: {
            mask: IMask.MaskedRange,
            from: 0,
            to: 9
        }
    },
    overwrite: true
});
const FTZPlate = React.forwardRef((props, ref)  => {
  
    return<div ref={ref} {...props}>
        <div className={`${plateStyle.ftzBox} ${plateStyle.plateFtzWhite}`}>
            <div className={plateStyle.ftz1}>
                <input className={plateStyle.ftzNumber11} type="text"
                       onChange={e => {
                           props.handleChange({...props.value, no1: PlateNo1(e.target.value)});
                           emulateTab();
                       }}
                       value={props.value.no1?props.value.no1:''} disabled={props.disabled}/>
                <input className={plateStyle.ftzNumber12} type="text"
                       onChange={e => {
                           props.handleChange({...props.value, no2: PlateNo2(e.target.value)});
                           emulateTab();
                       }}
                       value={props.value.no2?props.value.no2:''} disabled={props.disabled}/>
                <input className={plateStyle.ftzNumber13} type="text"
                       onChange={e => {
                           props.handleChange({...props.value, no3: PlateNo2(e.target.value)});
                           emulateTab();
                       }}
                       value={props.value.no3?props.value.no3:''} disabled={props.disabled}/>
                <input className={plateStyle.ftzNumber14} type="text"
                       onChange={e => {
                           props.handleChange({...props.value, no4: PlateNo2(e.target.value)});
                           emulateTab();
                       }}
                       value={props.value.no4?props.value.no4:''} disabled={props.disabled}/>
                <input className={plateStyle.ftzNumber15} type="text"
                       onChange={e => {
                           props.handleChange({...props.value, no5: PlateNo2(e.target.value)});
                           emulateTab();
                       }}
                       value={props.value.no5?props.value.no5:''} disabled={props.disabled}/>
            </div>
            <div className={plateStyle.ftz2}>
                <input className={plateStyle.ftzNumber21} type="text"
                       onChange={e => {
                           props.handleChange({...props.value, no6: PlateNo1(e.target.value)});
                           emulateTab();
                       }}
                       value={props.value.no6?props.value.no6:''} disabled={props.disabled}/>
                <input className={plateStyle.ftzNumber22} type="text"
                       onChange={e => {
                           props.handleChange({...props.value, no7: PlateNo2(e.target.value)})
                       }}
                       value={props.value.no7?props.value.no7:''} disabled={props.disabled}/>
            </div>
            <div className={plateStyle.ftz3}>
                <input className={plateStyle.ftzNumber31} type="text"
                       onChange={e => {
                           props.handleChange({...props.value, no1: PlateNo1(e.target.value)});
                           emulateTab();
                       }}
                       value={props.value.no1?props.value.no1:''} disabled={props.disabled}/>
                <input className={plateStyle.ftzNumber32} type="text"
                       onChange={e => {
                           props.handleChange({...props.value, no2: PlateNo2(e.target.value)});
                           emulateTab();
                       }}
                       value={props.value.no2?props.value.no2:''} disabled={props.disabled}/>
                <input className={plateStyle.ftzNumber33} type="text"
                       onChange={e => {
                           props.handleChange({...props.value, no3: PlateNo2(e.target.value)});
                           emulateTab();
                       }}
                       value={props.value.no3?props.value.no3:''} disabled={props.disabled}/>
                <input className={plateStyle.ftzNumber34} type="text"
                       onChange={e => {
                           props.handleChange({...props.value, no4: PlateNo2(e.target.value)});
                           emulateTab();
                       }}
                       value={props.value.no4?props.value.no4:''} disabled={props.disabled}/>
                <input className={plateStyle.ftzNumber35} type="text"
                       onChange={e => {
                           props.handleChange({...props.value, no5: PlateNo2(e.target.value)});
                           emulateTab();
                       }}
                       value={props.value.no5?props.value.no5:''} disabled={props.disabled}/>
            </div>
            <div className={plateStyle.ftz4}>
                <input className={plateStyle.ftzNumber41} type="text"
                       onChange={e => {
                           props.handleChange({...props.value, no6: PlateNo1(e.target.value)});
                           emulateTab();
                       }}
                       value={props.value.no6?props.value.no6:''} disabled={props.disabled}/>
                <input className={plateStyle.ftzNumber42} type="text"
                       onChange={e => {
                           props.handleChange({...props.value, no7: PlateNo2(e.target.value)})
                       }}
                       value={props.value.no7?props.value.no7:''} disabled={props.disabled}/>
            </div>
        </div>
    
    </div>;
});


FTZPlate.propTypes={
    handleChange: PropTypes.func,
    value: PropTypes.object,
    disabled: PropTypes.bool,
}

FTZPlate.defaultProps ={
    handleChange:(e=>{}),
    value: {no1:'',no2:'',no3:'',no4:'',no5:'',no6:'',no7:''},
    disabled:false
}
export default FTZPlate;