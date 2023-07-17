import {styled} from "@mui/material/styles";
import {Button} from "@mui/material";

const Button3 = styled(Button)({
    boxShadow: 'none',
    textTransform: 'none',
    fontSize: 16,
    padding: '6px 12px',
    border: '1px solid',
    lineHeight: 1.5,
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    color:'#e26024',
    '&:hover': {
        // backgroundColor: 'rgba(0, 174, 239, 0.15)',
        borderColor: 'transparent',
        boxShadow: 'none'
    },
    '&:active': {
        boxShadow: 'none',
        // backgroundColor: 'rgb(0,174,239)',
        borderColor: 'transparent',
    },
    '&:focus': {
        boxShadow: 'none',
    },
});
export default Button3;