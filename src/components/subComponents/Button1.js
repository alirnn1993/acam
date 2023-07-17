import {styled} from "@mui/material/styles";
import {Button} from "@mui/material";

const Button1 = styled(Button)({
    boxShadow: 'none',
    textTransform: 'none',
    fontSize: 16,
    padding: '6px 12px',
    border: '1px solid',
    lineHeight: 1.5,
    backgroundColor: '#e26024',
    borderColor: '#e26024',
    color:'#fff',
    '&:hover': {
        backgroundColor: '#e26010',
        borderColor: '#e26024',
        boxShadow: 'none',
    },
    '&:active': {
        boxShadow: 'none',
        backgroundColor: '#e26024',
        borderColor: '#e26024',
    },
    '&:focus': {
        boxShadow: '0 0 0 0.2rem rgba(0, 174, 239, 0.15)',
    },
});
export default Button1;