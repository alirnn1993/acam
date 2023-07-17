import {TextField as T} from "@mui/material";
import {styled} from "@mui/material/styles";

const TextField = styled(T)({
    width: "100%",
    '& label.Mui-focused': {
        color:'#e26024',
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: '#e26024',
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            // borderColor: '#e26024',
        },
        '&:hover fieldset': {
            // borderColor: '#000',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#e26024',
        },
    },
});


export {TextField};