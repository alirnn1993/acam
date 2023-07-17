import Slider, { SliderThumb } from '@mui/material/Slider';
import { styled } from '@mui/material/styles';

const Slider1 = styled(Slider)({
    color: '#e26024',
    height: 8,
    '& .MuiSlider-track': {
        border: 'none',
    },
    '& .MuiSlider-thumb': {
        height: 15,
        width: 15,
        backgroundColor: '#fff',
        border: '1px solid currentColor',
        '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
            boxShadow: 'inherit',
        },
        '&:before': {
            display: 'none',
        },
    },
    '& .MuiSlider-valueLabel': {
        lineHeight: 1.1,
        fontSize: 10,
        background: 'unset',
        padding: 0,
        width: 40,
        height: 40,
        borderRadius: '50% 50% 50% 0',
        backgroundColor: '#e26024',
        transformOrigin: 'bottom left',
        transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
        '&:before': { display: 'none' },
        '&.MuiSlider-valueLabelOpen': {
            transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
        },
        '& > *': {
            transform: 'rotate(45deg)',
        },
    },
});

export default Slider1;