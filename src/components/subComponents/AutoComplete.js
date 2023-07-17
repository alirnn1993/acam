import {Autocomplete as T} from "@mui/material";
import {styled} from "@mui/material/styles";

const AutoComplete1 = styled(T)({
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
            // borderColor: '#e26024',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#e26024',
        },
    },
});


export {AutoComplete1};