import React, {useState} from "react";
import plateStyle from "../../assets/css/plate.module.scss";
import {IMask} from "react-imask";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import {emulateTab} from "emulate-tab";
import PropTypes from "prop-types";
import FTZPlate from "./FTZPlate";


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

const TransitPlate = React.forwardRef((props, ref) => {
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
    }
    const handleClose = () => {
        setAnchorEl(null);
    };
    const letters = ['none','A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'W', 'X', 'Y', 'Z'];


    return <div ref={ref} {...props}>
        <div className={`${plateStyle.transitBox} ${plateStyle.plateTransit}`}>
            <div className={plateStyle.transit1}>
                <input className={plateStyle.transitNumber11} type="text"
                       onChange={e => {
                           props.handleChange({...props.value, no1: PlateNo1(e.target.value)});
                           emulateTab();

                       }}
                       value={props.value.no1 ? props.value.no1 : ''} disabled={props.disabled}/>
                <input className={plateStyle.transitNumber12} type="text"
                       onChange={e => {
                           props.handleChange({...props.value, no2: PlateNo2(e.target.value)});
                           emulateTab();

                       }}
                       value={props.value.no2 ? props.value.no2 : ''} disabled={props.disabled}/>
            </div>
            <div className={plateStyle.transit2}>
                <input className={plateStyle.transitNumber20} type="text" onClick={handleClick}
                       value={props.value.letter ? letters[parseInt(props.value.letter)] : ''}
                       disabled={props.disabled}/>
            </div>
            <div className={plateStyle.transit3}>
                <input className={plateStyle.transitNumber31} type="text"
                       onChange={e => {
                           props.handleChange({...props.value, no3: PlateNo1(e.target.value)});
                           emulateTab();

                       }}
                       value={props.value.no3 ? props.value.no3 : ''} disabled={props.disabled}/>
                <input className={plateStyle.transitNumber32} type="text"
                       onChange={e => {
                           props.handleChange({...props.value, no4: PlateNo2(e.target.value)});
                           emulateTab();

                       }}
                       value={props.value.no4 ? props.value.no4 : ''} disabled={props.disabled}/>
                <input className={plateStyle.transitNumber33} type="text"
                       onChange={e => {
                           props.handleChange({...props.value, no5: PlateNo2(e.target.value)});
                           emulateTab();

                       }}
                       value={props.value.no5 ? props.value.no5 : ''} disabled={props.disabled}/>
            </div>
            <div className={plateStyle.transit4}>
                <input className={plateStyle.transitNumber41} type="text"
                       onChange={e => {
                           props.handleChange({...props.value, no6: PlateNo1(e.target.value)});
                           emulateTab();

                       }}
                       value={props.value.no6 ? props.value.no6 : ''} disabled={props.disabled}/>
                <input className={plateStyle.transitNumber42} type="text"
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


                {letters.map((letter, index) => <MenuItem onClick={e => {
                    select(index);
                }} key={`ltter2${index}`}>{letter}</MenuItem>)}

            </Menu>
        </div>

    </div>;
});
TransitPlate.propTypes={
    handleChange: PropTypes.func,
    value: PropTypes.object,
    disabled: PropTypes.bool,
}

TransitPlate.defaultProps ={
    handleChange:(e=>{}),
    value: {no1:'',no2:'',no3:'',no4:'',no5:'',no6:'',no7:'',letter:''},
    disabled:false
}
export default TransitPlate;