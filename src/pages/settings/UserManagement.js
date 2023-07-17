import React, {useEffect, useState} from "react";
import styles from "../../assets/css/dashboard.module.scss";
import {Card, Container, Fab, FormControlLabel, Snackbar, Tooltip, Typography} from "@mui/material";
import CustomTable from "../../components/Table";
import {Link, useNavigate} from "react-router-dom";
import {UserApi} from "../../utils/UserApi";
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded';
import IOSSwitch from "../../components/subComponents/IOSSwitch";
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import Button4 from "../../components/subComponents/Button4";
import {Alert} from "@mui/lab";

const UserManagement = (props) => {
    const [rows, setRows] = useState([]);
    const [dataLoading, setDataLoading] = useState(false);
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const showMessage = (message) => {
        setMessage(message);
        setOpen(true);
    }
    const activate = async (id) => {
        await UserApi.activateUser(id, (result) => {
            fetchData();
            showMessage('user has been activated!')

        }, (error) => {
        });
    }
    const deactivate = async (id) => {
        await UserApi.deactivateUser(id, (result) => {
            fetchData();
            showMessage('user has been deactivated!')


        }, (error) => {
        });
    }

    const fetchData = async () => {
        setDataLoading(true);
        const response = (result) => {
            setDataLoading(false);
            setRows(result.data);
        }

        const error = (e) => {
            setDataLoading(false);

        }
        await UserApi.getAllUser(response, error);
    }

    const deleteUser = async (id) => {
        const response = (result) => {
            (async () => {
                await fetchData();
            })();
            showMessage('user was deleted!')

        }

        const error = (e) => {
            // setDataLoading(false);

        }

        await UserApi.removeUser(id, response, error);
    }

    const headers = [

        {
            field: 'username', title: 'Username', width: 100,
            align: 'right',
            renderCell: (row) => (
                <>
                    <Link to={`/user/${row.id}`}
                          style={{display: "block", width: "100%", textAlign: "center"}}>{row.username}</Link>


                </>)
        },
        {
            field: 'username', title: 'Role', width: 100,
            align: 'right',
            renderCell: (row) => (
                <>
                    <Link to={`/user/${row.id}`}
                          style={{display: "block", width: "100%", textAlign: "center"}}>{row.role}</Link>

                </>)
        },


        {
            field: 'userStatus', title: 'Status', width: 30,
            align: 'right',
            renderCell: (row) => (
                <>
                    <Tooltip title={"Activate/Deactivate"}>


                        <FormControlLabel
                            control={<IOSSwitch sx={{m: 1}}
                                                defaultChecked={parseInt(row.active) === 1}
                                                onChange={e => {
                                                    if (e.target.checked)
                                                        (async () => {
                                                            await activate(row.id);
                                                        })();
                                                    else (async () => {
                                                        await deactivate(row.id);
                                                    })();
                                                }}
                            />}
                            label=""
                        />
                    </Tooltip>
                </>)
        },
        {
            field: 'title', title: '', width: 30, renderCell: (row) => (
                <div style={{display: "block", width: "100%", textAlign: "center"}}>
                    <Button4 color="primary" onClick={() => {
                        deleteUser(row.id);
                    }}>
                        <DeleteRoundedIcon/>
                    </Button4>
                </div>
            ),
        }
    ];

    useEffect(() => {
        (async () => {
            await fetchData();
        })();
    }, [])

    return <div
        style={{width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center"}}>
        <Container maxWidth={"sm"}>
            <Card elevation={1} className={styles.card} style={{position: "relative"}}>


                <Typography variant={"h5"} component={"h5"} style={{color: '#9a9a9a', fontWeight: 100}}>
                    Users
                </Typography>
                <div style={{height: 'calc(70vh - 30px)', direction: "ltr", overflow: "hidden", paddingTop: 50}}>
                    <div>
                        <CustomTable headers={headers} rows={rows} loading={dataLoading}
                                     hasTitle containerStyle={{bottom: 0}}/>

                    </div>
                </div>
                <Fab aria-label="add" onClick={() => {
                    navigate("/user");
                }} style={{position: "absolute", bottom: 30, right: 30}}>
                    <PersonAddRoundedIcon/>
                </Fab>

            </Card>
        </Container>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="success" sx={{width: '100%'}}>
                {message}
            </Alert>
        </Snackbar>
    </div>;
};

export default UserManagement;