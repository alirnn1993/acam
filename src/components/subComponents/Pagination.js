import {styled} from "@mui/material/styles";
import {createTheme, Pagination as P, PaginationItem,ThemeProvider} from "@mui/material";
import Button3 from "./Button3";
import Button4 from "./Button4";
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined';
const Pagination = (props) => {


    const theme = createTheme({
        palette: {
            primary: {
                // Purple and green play nicely together.
                main:'#e26024',
            },
            secondary: {
                // This is green.A700 as hex.
                main: '#11cb5f',
            },
        },
    });


    return <ThemeProvider theme={theme}><P
        count={props.count}
        color="primary"
        onChange={props.onChange}


    /></ThemeProvider>
};
export default Pagination;