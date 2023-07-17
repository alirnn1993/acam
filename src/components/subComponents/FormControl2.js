import {styled} from "@mui/material/styles";
import {FormControl as F} from "@mui/material";

const FormControl2 = styled(F)({
    width: "100%",
    '& label.Mui-focused': {
        color: '#e26024',
    },
    '& label':{
        color: "#ccc"
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: '#e26024',
    },
    '& .MuiOutlinedInput-root': {
        '& .MuiOutlinedInput-input':{
            color: "#ccc"
        },
        '& fieldset': {
            borderColor: '#ccc',
            color: "#ccc"
        },
        '& legend':{
            color: "#ccc"
        },
        '&:hover fieldset': {
            borderColor: '#ccc',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#e26024',
        },
    },
});

export default FormControl2;