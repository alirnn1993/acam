import React from "react";
import plateStyle from "../../assets/css/plate.module.scss";
import {IMask} from "react-imask";
import {emulateTab} from "emulate-tab";
import PropTypes from "prop-types";
import TransitPlate from "./TransitPlate";


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

const MotorcyclePlate = React.forwardRef((props, ref) => {


    return <div ref={ref} {...props}>
        <div className={`${plateStyle.motorcycleBox}  ${plateStyle.plateMotorcycle}`}>
            <div className={`${plateStyle.motorcycle1}`}>
                <input className={plateStyle.motorcycleNumber11} type="text"
                       onChange={e => {
                           props.handleChange({...props.value, no1: PlateNo1(e.target.value)});
                           emulateTab();
                       }}
                       value={props.value.no1?props.value.no1:''} disabled={props.disabled}/>
                <input className={plateStyle.motorcycleNumber12} type="text"
                       onChange={e => {
                           props.handleChange({...props.value, no2: PlateNo2(e.target.value)});
                           emulateTab();
                       }}
                       value={props.value.no2?props.value.no2:''} disabled={props.disabled}/>
                <input className={plateStyle.motorcycleNumber13} type="text"
                       onChange={e => {
                           props.handleChange({...props.value, no3: PlateNo2(e.target.value)});
                           emulateTab();
                       }}
                       value={props.value.no3?props.value.no3:''} disabled={props.disabled}/>

            </div>

            <div className={plateStyle.motorcycle2}>
                <input className={plateStyle.motorcycleNumber21} type="text"
                       onChange={e => {
                           props.handleChange({...props.value, no4: PlateNo1(e.target.value)});
                           emulateTab();
                       }}
                       value={props.value.no4?props.value.no4:''} disabled={props.disabled}/>
                <input className={plateStyle.motorcycleNumber22} type="text"
                       onChange={e => {
                           props.handleChange({...props.value, no5: PlateNo2(e.target.value)});
                           emulateTab();
                       }}
                       value={props.value.no5?props.value.no5:''} disabled={props.disabled}/>
                <input className={plateStyle.motorcycleNumber23} type="text"
                       onChange={e => {
                           props.handleChange({...props.value, no6: PlateNo2(e.target.value)});
                           emulateTab();
                       }}
                       value={props.value.no6?props.value.no6:''} disabled={props.disabled}/>
                <input className={plateStyle.motorcycleNumber24} type="text"
                       onChange={e => {
                           props.handleChange({...props.value, no7: PlateNo2(e.target.value)});
                           emulateTab();
                       }}
                       value={props.value.no7?props.value.no7:''} disabled={props.disabled}/>
                <input className={plateStyle.motorcycleNumber25} type="text"
                       onChange={e => {
                           props.handleChange({...props.value, no8: PlateNo2(e.target.value)});
                           emulateTab();
                       }}
                       value={props.value.no8?props.value.no8:''} disabled={props.disabled} readOnly={props.disabled}/>

            </div>
        </div>

    </div>

});
MotorcyclePlate.propTypes={
    handleChange: PropTypes.func,
    value: PropTypes.object,
    disabled: PropTypes.bool,
}

MotorcyclePlate.defaultProps ={
    handleChange:(e=>{}),
    value: {no1:'',no2:'',no3:'',no4:'',no5:'',no6:'',no7:'',no8:''},
    disabled:false
}
export default MotorcyclePlate;