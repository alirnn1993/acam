import React, {useEffect, useRef, useState} from "react";
import {Link, useLocation, Outlet, useNavigate} from "react-router-dom";
import styles from '../assets/css/mainPage.module.scss';
import {useAuthState} from "../context/AuthContext";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
    faClipboardList,
    faTachometerAlt,
    faBuilding,
} from '@fortawesome/free-solid-svg-icons';
import {
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    AppBar,
    Toolbar, Typography, Grow, Paper, ClickAwayListener, MenuList, MenuItem, Popper, IconButton
} from "@mui/material";
import AssessmentRoundedIcon from '@mui/icons-material/AssessmentRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import SettingsSuggestRoundedIcon from '@mui/icons-material/SettingsSuggestRounded';
import PublicRoundedIcon from '@mui/icons-material/PublicRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import ContrastRoundedIcon from '@mui/icons-material/ContrastRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import * as yup from "yup";
import {useFormik} from "formik";
import {UserApi} from "../utils/UserApi";
import {TextField} from "../components/subComponents/TextField";
import LoadingButton1 from "../components/subComponents/LoadingButton";
import Grid2 from "@mui/material/Unstable_Grid2";
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import logo from '../assets/img/3.png';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';
import {useDataState} from "../context/DataContext";
import ManageHistoryRoundedIcon from '@mui/icons-material/ManageHistoryRounded';
import {MonitorApi} from "../utils/MonitorApi";
import {CommandApi} from "../utils/CommandApi";
import AspectRatioRoundedIcon from '@mui/icons-material/AspectRatioRounded';
import WebStoriesRoundedIcon from '@mui/icons-material/WebStoriesRounded';
import {SendApi} from "../utils/SendApi";


const Main = props => {
    const [open3, setOpen3] = useState(false);
    const [openErrorDialog, setOpenErrorDialog] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [open, setOpen] = React.useState(false);
    const auth = useAuthState();
    const data = useDataState();
    const anchorRef = React.useRef(null);
    const Ref = useRef(null);


    const unmount = () => {
        if (window.interval)
            clearInterval(window.interval);
    }

    const updateTime = async () => {
        const response = ({data}) => {
            window.interval = setInterval(function () {
                if (Ref.current.innerHTML) {
                    let h = parseInt(Ref.current.innerHTML.split(":")[0]);
                    let m = parseInt(Ref.current.innerHTML.split(":")[1]);
                    let s = parseInt(Ref.current.innerHTML.split(":")[2]);
                    s++;
                    if (s === 60) {
                        s = 0;
                        m++;
                        if (m === 60) {
                            m = 0;
                            h++;
                            if (h === 24)
                                h = 0;
                        }
                    }
                    Ref.current.innerHTML = `${h}:${m < 10 ? `0${m}` : m}:${s < 10 ? `0${s}` : s}`
                } else {
                    let h = data.time.split(":")[0];
                    let m = data.time.split(":")[1];
                    let s = data.time.split(":")[2];
                    Ref.current.innerHTML = `${h}:${m < 10 ? `0${m}` : m}:${s < 10 ? `0${s}` : s}`
                }

            }, 1000);
        }

        const error = (e) => {

        }
        await MonitorApi.getTimeConfiguration(response, error);

    }
    const hardReboot = () => {
        (async () => {
            const response = (result) => {

            }
            const error = (e) => {

            }
            await CommandApi.hardReboot(response, error);
        })();
    }

    const restartANPR = () => {
        (async () => {
            const response = (result) => {

            }
            const error = (e) => {

            }
            await CommandApi.restartANPR(response, error);
        })();
    }

    const eraseImages = () => {
        (async () => {
            const response = (result) => {

            }
            const error = (e) => {

            }
            await CommandApi.eraseImages(response, error);
        })();
    }


    const sendALl =  () => {
        (async ()=>{
            const response = ({data}) => {

            }

            const error = (e) => {

            }
            await SendApi.sendAll(response,error);
        })();
    }
    const shutdown = () => {
        (async () => {
            const response = (result) => {

            }
            const error = (e) => {

            }
            await CommandApi.shutdown(response, error);
        })();
    }

    const handleToggle = (e) => {
        setOpen((prevOpen) => !prevOpen);
    };

    function handleListKeyDown(event: React.KeyboardEvent) {
        if (event.key === 'Tab') {
            event.preventDefault();
            setOpen(false);
        } else if (event.key === 'Escape') {
            setOpen(false);
        }
    }


    // return focus to the button when we transitioned from !open -> open
    const prevOpen = React.useRef(open);


    React.useEffect(() => {
        if (prevOpen.current === true && open === false) {
            // anchorRef.current.focus();
        }

        prevOpen.current = open;
    }, [open]);


    useEffect(() => {
        (async () => {
            await updateTime();
        })();
        return unmount;
    }, []);


    const handleOpenErrorDialog = () => {
        setOpenErrorDialog(true);
    }

    const handleCloseErrorDialog = () => {
        setOpenErrorDialog(false);
    }
    const validationSchema = yup.object({
        password: yup
            .string("رمز عبور جدید را وارد کنید.")
            .min(8, "Minimum length of password is 8 character."),
        passwordConfirmation: yup
            .string("رمز عبور را تکرار کنید.")
            .oneOf([yup.ref('password'), null], 'Confirm password is not match'),
        name: yup
            .string("")
            .required("Name is required"),
        username: yup
            .string()
            .required("Username is required")

    });

    const formik = useFormik({
        initialValues: {
            password: '', passwordConfirmation: '', name: auth.user.name, username: auth.user.username

        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            setIsSending(true);
            const response = (result) => {
                setIsSending(false);
                handleClose3();

            }
            const error = (e) => {
                setIsSending(false);
                handleClose3();
            }
            let fd = new FormData();
            fd.append("payload", JSON.stringify(values));
            await UserApi.updateMyself(fd, response, error);
        },
    });

    const handleClickOpen = () => {
        setOpen3(true);
    };

    const handleClose3 = () => {
        setOpen3(false);
    };
    const navigate = useNavigate();

    const handleClose = (event) => {
        switch (event) {
            case 0:
                hardReboot();
                break;

            case 1:
                restartANPR();
                break;

            case 2:
                eraseImages();
                break;

            case 4:
                shutdown();
                break;
            case 3:
                sendALl();
                break;


        }
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }

        setOpen(false);
    };


    return <div className={''}>
        <AppBar position="static" className={styles.appBar}>
            <Toolbar style={{padding: 0, height: 40}}>

                <Grid2 container style={{width: "100%"}}>
                    <Grid2 item xs={6}>

                        <div className={styles.barInfo}>

                            <div style={{display: "flex", justifyContent: "start", width: "100%", marginLeft: 20}}>
                                <Typography variant={"caption"}
                                            style={{textAlign: "center", marginRight: 15, color: "#000"}}>
                                    IP Address: {data.values.network["tcp/IP"].manual.ipAddress}
                                </Typography>
                                <Typography variant={"caption"}
                                            style={{textAlign: "center", color: "#000"}}>
                                    Time:
                                </Typography>
                                <Typography variant={"caption"}
                                            style={{textAlign: "center", color: "#000"}} ref={Ref}>

                                </Typography>

                            </div>

                        </div>
                    </Grid2>
                    <Grid2 item xs={6}>
                        <div style={{display: "flex", flexDirection: "row-reverse", alignItems: "center"}}>
                            <Tooltip title={"logout"} onClick={() => {
                                (async () => {
                                    await auth.logout();
                                })();
                            }}>
                                <IconButton
                                    size="small"
                                    edge="start"
                                    color="inherit">
                                    <LogoutRoundedIcon style={{color: "#58595b"}}/>
                                </IconButton>
                            </Tooltip>
                            <div style={{
                                marginRight: 10,
                                paddingRight: 10,
                                borderRightStyle: "solid",
                                borderRightWidth: 1,
                                borderRightColor: "#000",
                                display: "flex",
                                borderLeftStyle: "solid",
                                borderLeftWidth: 1,
                                borderLeftColor: "#000",
                                flexDirection: "row-reverse"

                            }}>
                                <Tooltip title={"profile"} onClick={handleClickOpen}>
                                    <IconButton onClick={handleClickOpen}
                                                size="small"
                                                edge="start"
                                                color="inherit">
                                        <PersonRoundedIcon style={{color: "#58595b"}}/>
                                    </IconButton>
                                </Tooltip>
                                <Typography variant={"caption"} style={{
                                    marginRight: 10,
                                    paddingLeft: 10,
                                    display: "flex",
                                    alignItems: "center",
                                    color: "#000"
                                }}>
                                    {auth.user.username}
                                </Typography>
                            </div>


                            <Tooltip title={"More Options"}>
                                <IconButton
                                    ref={anchorRef}
                                    onClick={handleToggle}
                                    size="small"
                                    edge="start"
                                    color="inherit">
                                    <ManageHistoryRoundedIcon style={{color: "#58595b"}}/>
                                </IconButton>
                            </Tooltip>

                        </div>

                    </Grid2>
                </Grid2>


            </Toolbar>
        </AppBar>

        <Dialog open={openErrorDialog}
                maxWidth={"sm"}
                fullWidth
                onClose={handleCloseErrorDialog}>
            <DialogTitle>Error and Faults</DialogTitle>
            <DialogContent>
            </DialogContent>
        </Dialog>
        <Dialog
            fullWidth
            maxWidth={"sm"}
            open={open3}
            onClose={handleClose3}
        >
            <form onSubmit={formik.handleSubmit}>
                <DialogTitle>Change Password</DialogTitle>
                <DialogContent>


                    <div className={styles.inputContainer}>

                        <TextField
                            fullWidth
                            id="name"
                            name="name"
                            label="Name"
                            type="text"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            error={formik.touched.name && Boolean(formik.errors.name)}
                            helperText={formik.touched.name && formik.errors.name}
                            variant="outlined"
                            disabled
                        />
                    </div>

                    <div className={styles.inputContainer}>

                        <TextField
                            fullWidth
                            id="username"
                            name="username"
                            label="Username"
                            type="username"
                            value={formik.values.username}
                            onChange={formik.handleChange}
                            error={formik.touched.username && Boolean(formik.errors.username)}
                            helperText={formik.touched.username && formik.errors.username}
                            variant="outlined"
                            disabled
                        />
                    </div>

                    <div className={styles.inputContainer}>

                        <TextField
                            fullWidth
                            id="password"
                            name="password"
                            label="Password"
                            type="password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            error={formik.touched.password && Boolean(formik.errors.password)}
                            helperText={formik.touched.password && formik.errors.password}
                            variant="outlined"
                        />
                    </div>

                    <div className={styles.inputContainer}>

                        <TextField
                            fullWidth
                            id="passwordConfirmation"
                            name="passwordConfirmation"
                            label="Confirm password"
                            type="password"
                            value={formik.values.passwordConfirmation}
                            onChange={formik.handleChange}
                            error={formik.touched.passwordConfirmation && Boolean(formik.errors.passwordConfirmation)}
                            helperText={formik.touched.passwordConfirmation && formik.errors.passwordConfirmation}
                            variant="outlined"
                        />
                    </div>


                </DialogContent>
                <DialogActions>

                    <LoadingButton1
                        type={"submit"}
                        loading={isSending}
                    >
                        Submit
                    </LoadingButton1>


                </DialogActions>
            </form>
        </Dialog>


        <div>
            <div className={styles.menuContainer}>
                <div>
                    <div style={{}}>
                        <Link to={'dashboard'} className={`${styles.link}`}>
                            <img src={logo} alt={""} style={{
                                width: "100%"
                            }}/>
                        </Link>
                    </div>
                    <div>


                        {auth.user && (auth.user.role === 1 || auth.user.role === 2) ? menuItems.map((item, index) =>
                            <Item2 {...item} navigate={navigate} key={`nav${index}`}/>
                        ) : menuItems2.map((item, index) =>
                            <Item2 {...item} navigate={navigate} key={`nav${index}`}/>
                        )}
                    </div>
                </div>

            </div>
            <div className={styles.contents}>
                <div>
                    <Outlet/>

                </div>
            </div>
        </div>
        <Popper
            open={open}
            anchorEl={anchorRef.current}
            role={undefined}
            placement="bottom-start"
            transition
            disablePortal
            style={{zIndex: 15}}
        >
            {({TransitionProps, placement}) => (
                <Grow
                    {...TransitionProps}
                    style={{
                        transformOrigin:
                            placement === 'bottom-start' ? 'left top' : 'left bottom',
                    }}
                >
                    <Paper>
                        <ClickAwayListener onClickAway={handleClose}>
                            <MenuList
                                autoFocusItem={open}
                                id="composition-menu"
                                aria-labelledby="composition-button"
                                onKeyDown={handleListKeyDown}
                            >

                                {items.map((item, index) =>
                                    <MenuItem onClick={() => {
                                        handleClose(index)
                                    }} key={`ii${index}`}>{item}</MenuItem>
                                )}
                            </MenuList>
                        </ClickAwayListener>
                    </Paper>
                </Grow>
            )}
        </Popper>

    </div>
};


export default Main;

const Item2 = props => {
    let {sub} = props;
    if (sub) {
        return <>
            {sub.map((item, index) => {
                return <SimpleMenuItem2 {...item} key={`item2${index}`}/>
            })}
        </>;
    } else {
        return <>
            <SimpleMenuItem2 {...props} />
        </>
    }


}

const menuItems2 = [
    // {
    //     title: "Dashboard",
    //     to: "/dashboard",
    //     Icon: DashboardRoundedIcon,
    //     activeOnlyWhenExact: true,
    //     isMaterial: true
    // },
    {
        title: "Traffic Report",
        to: "/traffic-report",
        Icon: AssessmentRoundedIcon,
        activeOnlyWhenExact: true,
        isMaterial: true

    }, {
        title: "Control panel",
        Icon: SettingsRoundedIcon,
        isMaterial: true,
        sub: [

            {
                title: "General Settings",
                to: "/setting/system",
                Icon: SettingsSuggestRoundedIcon,
                isMaterial: true

            }, {
                title: "Network",
                to: "/setting/network",
                Icon: PublicRoundedIcon,
                isMaterial: true
            }, {
                title: "Environment",
                to: "/setting/environment",
                Icon: SettingsBrightnessIcon,
                isMaterial: true

            },
            {
                title: "ROI",
                to: "/setting/roi",
                Icon: AspectRatioRoundedIcon,
                isMaterial: true

            },
            {
                title: "Logs",
                to: "/setting/log",
                Icon: WebStoriesRoundedIcon,
                isMaterial: true

            },
            {
                title: "User Management",
                to: "/setting/users",
                Icon: PeopleAltRoundedIcon,
                isMaterial: true

            }, {
                title: "White/Black List",
                to: "/setting/list",
                Icon: ContrastRoundedIcon,
                isMaterial: true

            },
        ]
    },
];
const menuItems = [
    {
        title: "Dashboard",
        to: "/dashboard",
        Icon: faTachometerAlt,
        activeOnlyWhenExact: true
    },
    {
        title: "Traffic Report",
        to: "/traffic-report",
        Icon: faTachometerAlt,
        activeOnlyWhenExact: true
    }, {
        title: "Control panel",
        Icon: faBuilding,
        sub: [{
            title: "System",
            to: "/setting/system",
            Icon: faClipboardList,
        }, {
            title: "Time & Date",
            to: "/setting/time",
            Icon: faClipboardList,
        }, {
            title: "Network",
            to: "/setting/network",
            Icon: faClipboardList,
        }, {
            title: "Environment",
            to: "/setting/environment",
            Icon: faClipboardList,
        }, {
            title: "Image",
            to: "/setting/image",
            Icon: faClipboardList,
        }, {
            title: "User Management",
            to: "/setting/image",
            Icon: faClipboardList,
        }, {
            title: "White/Black list",
            to: "/setting/list",
            Icon: ContrastRoundedIcon,
        }, {
            title: "Aggregated Report",
            to: "/setting/aggregated-list",
            Icon: faClipboardList,
        }, {
            title: "Debug",
            to: "/setting/debug",
            Icon: faClipboardList,
        },]

    },


];


const SimpleMenuItem2 = ({Icon, to, isMaterial, title}) => {

    let location = useLocation();
    return <Link to={to} className={`${styles.link}`}>
        <Tooltip title={title}>
            <div className={` ${styles.menuItem} ${location.pathname === to ? styles.activeMenuItem : ''}`}>
                {isMaterial ? <Icon/> : <FontAwesomeIcon icon={Icon}/>}
            </div>
        </Tooltip>
    </Link>;
};


const items = ["Reboot", "Restart ANPR", "Erase images", "Send All", "Shutdown"];
