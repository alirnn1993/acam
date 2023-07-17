import React, {Fragment, useEffect, useState} from "react";
import styles from '../assets/css/mainPage.module.scss';
import {faRightToBracket, faBars, faArrowLeftLong} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Link, useLocation, useNavigate, Outlet, useParams} from "react-router-dom";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {useAuthState} from "../context/AuthContext";
import logo from '../assets/img/logo.png';
import {UserApi} from "../utils/UserApi";
import TitleImg from "../assets/img/title.png";
import {
    ListItem,
    ListItemText,
    Tooltip,
    Button,
    DialogTitle,
    TextField,
    MenuItem,
    ListItemIcon,
    styled,
    useTheme,
    IconButton,
    Typography,
    Divider,
    List,
    Container,
    Drawer,
    DialogContent,
    DialogActions, Dialog, Menu, Box
} from "@mui/material";
import {Logout} from "@mui/icons-material";
import Avatar from "@mui/material/Avatar";
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';


const DrawerHeader = styled('div')(({theme}) => ({
    display: 'flex', alignItems: 'center', padding: theme.spacing(0, 1), // necessary for content to be below app bar
    ...theme.mixins.toolbar, justifyContent: 'flex-start',
}));
const drawerWidth = 240;
const MainPage = ({children}) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const theme = useTheme();
    const [open1, setOpen1] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [name, setName] = useState('');
    const params = useParams();

    const auth = useAuthState();
    const {pathname} = useLocation();
    const navigate = useNavigate();
    const handleClickOpen = () => {
        setOpen2(true);
    };

    const handleClose1 = () => {
        setOpen2(false);
    };
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    const handleDrawerOpen = () => {
        setOpen1(true);
    };

    const handleDrawerClose = () => {
        setOpen1(false);
    };
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const updateCustomer = async () => {
        const response = (result) => {
            setTimeout(() => {
                // auth.checkUser();
                auth.updateUser(name);

            }, 500);
        }

        const error = (e) => {

        }
        let fd = new FormData();
        fd.append("name", name);
        await UserApi.updateProfile(fd, response, error);
    }

    const list = (anchor) => (<Box
        sx={{width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250}}
        role="presentation"
        onClick={handleDrawerClose}
        onKeyDown={handleDrawerClose}
    >
        <List>
            <ListItem button key={'buy'} onClick={() => {
                navigate(params.type ? `/buy/${params.type}/1` : '/buy/files/1');
            }}>
                <ListItemText primary={'خرید و فروش'}/>
            </ListItem>
            <ListItem button key={'rent'} onClick={() => {
                navigate(params.type ? `/rent/${params.type}/1` : '/rent/files/1');

            }}>
                <ListItemText primary={'رهن و اجاره'}/>
            </ListItem>


            <ListItem button key={'user'} onClick={() => {
                navigate('/new/file');
            }}>
                <ListItemText primary={`ثبت فایل`}/>
            </ListItem>
            <ListItem button key={'user'} onClick={() => {
                navigate('/new/request');
            }}>
                <ListItemText primary={`ثبت درخواست`}/>
            </ListItem>
        </List>
        {auth.isAuthenticated &&

            <>
                <Divider/>
                <List>
                    <ListItem button key={"profile"} onClick={handleClickOpen}>
                        <ListItemIcon>
                            <Avatar/>
                        </ListItemIcon>
                        <ListItemText primary={` پروفایل (${auth.isAuthenticated ? auth.user.name : ''}) `}/>
                    </ListItem>

                    <ListItem key={"myView"} onClick={() => {
                        auth.logout();
                    }}>
                        <ListItemIcon>
                            <Logout fontSize="small"/>
                        </ListItemIcon>

                        <ListItemText primary={"خروج"}/>
                    </ListItem>
                </List>
            </>}
    </Box>);

    return <Fragment>

        <Container maxWidth={pathname !== "/" ? false : "md"} disableGutters={true}
                   className={`${styles.appBar} ${pathname !== "/" ? styles.active : styles.appBarRight}`}>
            <IconButton color="primary" aria-label="add to shopping cart" onClick={handleDrawerOpen}>
                <FontAwesomeIcon icon={faBars}/>
            </IconButton>

            <Link to={params.type ? `/buy/${params.type}/1` : '/buy/files/1'} style={pathname !== "/" ? {} : {display: 'none'}}>
                <Button variant="contained">خرید
                    و
                    فروش
                </Button>
            </Link>
            <Link to={params.type ? `/rent/${params.type}/1` : '/rent/files/1'} style={pathname !== "/" ? {} : {display: 'none'}}>
                <Button variant="contained">رهن
                    و
                    اجاره
                </Button>
            </Link>
            <Link to={'/new/file'}>
                <Button variant="contained">
                    <Typography variant={"subtitle1"}>
                        {`${!auth.isAuthenticated ? 'ورود / ' : ''}`}
                        ثبت
                        فایل جدید
                    </Typography>

                </Button>
            </Link>
            <Link to={'/new/request'}>
                <Button variant="contained">
                    <Typography variant={"subtitle1"}>
                        {`${!auth.isAuthenticated ? 'ورود / ' : ''}`}
                        ثبت
                        درخواست جدید
                    </Typography>

                </Button>
            </Link>
            <div>
                <Link to={'/'}>
                    <img src={TitleImg} alt={""}/>
                </Link>
            </div>
            {pathname === "/" ?
                <>
                    {auth.isAuthenticated ? <Tooltip title="کابر">
                            <IconButton color="primary" aria-label="upload picture" component="button"
                                        onClick={handleClick}>
                                <AccountCircleRoundedIcon/>
                            </IconButton>
                        </Tooltip>
                        : <Tooltip title="ورود">
                            <IconButton color="primary" aria-label="upload picture" component="button" onClick={() => {
                                navigate("/user/login");
                            }} className={styles.loginBtn}>
                                <FontAwesomeIcon icon={faRightToBracket}/>
                            </IconButton>
                        </Tooltip>
                    }
                </> : <>
                    <Tooltip title="بازگشت">
                        <IconButton color="primary" aria-label="upload picture" component="button" onClick={() => {
                            navigate(-1);
                        }} className={styles.loginBtn}>
                            <FontAwesomeIcon icon={faArrowLeftLong}/>
                        </IconButton>
                    </Tooltip>
                </>}


        </Container>
        <Drawer
            sx={{
                width: drawerWidth, flexShrink: 0, '& .MuiDrawer-paper': {
                    width: drawerWidth,
                },
            }}
            anchor="right"
            open={open1}
            onClose={handleDrawerClose}
        >
            <DrawerHeader
                style={{
                    position: 'relative',
                    padding: 0,
                    height: 240,
                    overflow: 'hidden',
                    background: "#1976d2"
                }}>
                <img src={logo} alt={''}
                     style={{
                         width: '100%',
                         position: 'absolute',
                     }}/>
                <IconButton onClick={handleDrawerClose}
                            style={{
                                position: 'absolute',
                                top: 25,
                                left: 25
                            }}>
                    {theme.direction === 'rtl' ? <ChevronLeftIcon/> : <ChevronRightIcon/>}
                </IconButton>
            </DrawerHeader>
            {list('right')}
        </Drawer>
        <Container maxWidth={pathname !== "/" ? false : "md"} disableGutters={true}>

            <Outlet/>

        </Container>


        <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            className={styles.menu}
            PaperProps={{
                elevation: 0, sx: {
                    overflow: 'visible', // filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    mt: 1.5, '& .MuiAvatar-root': {
                        width: 32, height: 32, ml: -0.5, mr: 1,
                    }, '&:before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                    },
                },
            }}
            transformOrigin={{horizontal: 'left', vertical: 'top'}}
            anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
        >
            <MenuItem onClick={handleClickOpen}>
                <Avatar style={{justifyContent: "center"}}/> پروفایل ({auth.isAuthenticated ? auth.user.name : ''})
            </MenuItem>

            <Divider/>

            {/*</MenuItem>*/}
            <MenuItem onClick={() => {
                auth.logout();
            }}>
                <ListItemIcon>
                    <Logout fontSize="small"/>
                </ListItemIcon>
                خروج

            </MenuItem>
        </Menu>
        <Dialog
            fullWidth={true}
            maxWidth={'sm'}
            open={open2}
            onClose={handleClose1}
        >
            <DialogTitle>بروزرسانی پروفایل</DialogTitle>
            <DialogContent>
                <div>
                    <div className={styles.inputContainer}>
                        <TextField id="outlined-basic" label="نام" variant="outlined" value={name}
                                   defaultValue={auth.isAuthenticated ? auth.user.name : ''}
                                   onChange={(e) => {
                                       setName(e.target.value);
                                   }}
                        />
                    </div>
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose1} color={'error'}>بستن</Button>
                <Button onClick={() => {
                    handleClose1();
                    (async () => {
                        await updateCustomer();
                    })();

                }}>بروزرسانی</Button>
            </DialogActions>
        </Dialog>
    </Fragment>;
};

export default MainPage;