import {styled} from "@mui/material/styles";
import {InputLabel as I} from "@mui/material";

const InputLabel = styled(I)({
    width: "100%",
    '& label.Mui-focused': {
        color: 'rgb(0,174,239)',
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: 'rgb(0,174,239)',
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: 'rgb(0,174,239)',
        },
        '&:hover fieldset': {
            borderColor: 'rgb(0,174,239)',
        },
        '&.Mui-focused fieldset': {
            borderColor: 'rgb(0,174,239)',
        },
    },
});

export default InputLabel;