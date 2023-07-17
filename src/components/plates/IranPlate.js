import React, {useState} from "react";
import plateStyle from "../../assets/css/plate.module.scss";
import {IMask} from "react-imask";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { emulateTab } from 'emulate-tab';
import PropTypes from "prop-types";
import CustomTable from "../Table";

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

const IranPlate = React.forwardRef((props, ref) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const select = (index) => {
        anchorEl.blur();
        handleClose();
        if (index)
            props.handleChange({...props.value, letter: index});
        else
            props.handleChange({...props.value, letter: null});

        emulateTab();
    }
    const handleClose = () => {
        setAnchorEl(null);
    };
    const letters = ["none", "الف", "ب", "پ", "ت", "ث", "ج", "چ", "ح", "خ", "د", "ذ", "ر", "ز", "ژ", "س", "ش", "ص", "ض", "ط", "ظ", "ع", "غ", "ف", "ق", "ک", "گ", "ل", "م", "ن", "و", "ه", "ی"];


    return <div ref={ref} {...props}>
        <div className={`${plateStyle.plateBox} ${plateStyle.plateWhite}`} >
            <div className={plateStyle.box1}>


                <input className={plateStyle.boxNumber11} type="text"
                       onChange={e => {
                           props.handleChange({

                               ...props.value, no1: PlateNo1(e.target.value)
                           });
                           emulateTab();
                       }}
                       value={props.value.no1 ? props.value.no1 : ''} disabled={props.disabled}/>
                <input className={plateStyle.boxNumber12} type="text"
                       onChange={e => {
                           props.handleChange({
                               ...props.value, no2: PlateNo2(e.target.value)
                           });
                           emulateTab();
                       }}
                       value={props.value.no2 ? props.value.no2 : ''} disabled={props.disabled}/>
            </div>
            <div className={plateStyle.box2}>
                <input className={plateStyle.boxNumber20} type="text" onClick={handleClick}
                       value={props.value.letter ? letters[parseInt(props.value.letter)] : ''}
                       disabled={props.disabled}/>
            </div>


            <div className={plateStyle.box3}>
                <input className={plateStyle.boxNumber31} type="text"
                       onChange={e => {
                           props.handleChange({
                               ...props.value, no3: PlateNo1(e.target.value)
                           })
                           emulateTab();
                       }}
                       value={props.value.no3 ? props.value.no3 : ''} disabled={props.disabled}/>
                <input className={plateStyle.boxNumber32} type="text"
                       onChange={e => {
                           props.handleChange({
                               ...props.value, no4: PlateNo2(e.target.value)
                           });
                           emulateTab();
                       }}
                       value={props.value.no4 ? props.value.no4 : ''} disabled={props.disabled}/>
                <input className={plateStyle.boxNumber33} type="text"
                       onChange={e => {
                           props.handleChange({...props.value, no5: PlateNo2(e.target.value)});
                           emulateTab();
                       }}
                       value={props.value.no5 ? props.value.no5 : ''} disabled={props.disabled}/>
            </div>
            <div className={plateStyle.box4}>
                <input className={plateStyle.boxNumber41} type="text"
                       onChange={e => {
                           props.handleChange({...props.value, no6: PlateNo1(e.target.value)});
                           emulateTab();
                       }}
                       value={props.value.no6 ? props.value.no6 : ''} disabled={props.disabled}/>
                <input className={plateStyle.boxNumber42} type="text"
                       onChange={e => {
                           props.handleChange({...props.value, no7: PlateNo2(e.target.value)});
                           emulateTab();
                       }}
                       value={props.value.no7 ? props.value.no7 : ''} disabled={props.disabled}/>
            </div>
            <Menu
                id="demo-positioned-menu"
                aria-labelledby="demo-positioned-button"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >


                {letters.map((letter, index) => <MenuItem key={`letter1${index}`} onClick={e => {
                    select(index);
                }}>{letter}</MenuItem>)}

            </Menu>
        </div>


    </div>
});


export default IranPlate;IranPlate.propTypes={
    handleChange: PropTypes.func,
    value: PropTypes.object,
    disabled: PropTypes.bool,
}

IranPlate.defaultProps ={
    handleChange:(e=>{}),
    value: {no1:'',no2:'',no3:'',no4:'',no5:'',no6:'',no7:'',letter:''},
    disabled:false
}