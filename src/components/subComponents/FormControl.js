import {styled} from "@mui/material/styles";
import {FormControl as F} from "@mui/material";

const FormControl1 = styled(F)({
    width: "100%",
    '& label.Mui-focused': {
        color: '#e26024',
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

export default FormControl1;