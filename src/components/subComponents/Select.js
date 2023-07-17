import {styled} from "@mui/material/styles";
import {Select as S} from "@mui/material";

const Select1 = styled(S)({
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
            // borderColor: '#e26024',
        },
    },
});
export default Select1;