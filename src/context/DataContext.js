import React, {createContext, useContext, useEffect, useState} from "react";
import {SettingApi} from "../utils/SettingApi";
import {useAuthState} from "./AuthContext";
import {ModeNightOutlined} from "@mui/icons-material";
import {MonitorApi} from "../utils/MonitorApi";
import dayjs from 'dayjs';


const DataContext = createContext(null);
const DataProvider = ({children}) => {

    const [value, setValue] = useState({
        "system": {
            "name": "",
            "locationName": "",
            "locationGeometry": {
                "lat": "",
                "lng": ""
            },
            "policeCode": "",
            "cameraStatus": false,
            "cameraType": false,
            "rotationAngle": null,
            "reverseDirectionDetection": false
        },
        "time": {
            "method": "",
            "time": null,
            "date": ""
        },
        "network": {
            "tcp/IP": {
                "method": 1,
                "manual": {
                    "ipAddress": "",
                    "netmask": "",
                    "gateway": "",
                    "dns1": "",
                    "dns2": ""
                }
            },
            "ftp": {
                "ipAddress": "",
                "port": 0,
                "username": "",
                "password": "",
                "directoryPathOnTheServer": "",
                "imageFilenamePattern": ""
            }

        },
        "environment": {
            "led": {
                "set1": {
                    "method": 'automatic',
                    "brightnessPercentage": 50,
                    "period": "",
                    "type": "white"
                },
                "set2": {
                    "method": 'automatic',
                    "brightnessPercentage": 50,
                    "period": "",
                    "type": "ir"
                },
                "sunriseDelay": "",
                "sunsetDelay": "",

            },
            "temperature": {
                "fanEnable": "automatic",
                "tec": false,
                "environment": {
                    "active": false,
                    "highTemperatureLimit": 11,
                    "lowTemperatureLimit": 85
                },
                "camera": {
                    "active": false,
                    "highTemperatureLimit": 10,
                    "lowTemperatureLimit": 95
                }
            }
        }

    });


    const auth = useAuthState();
    const fetchData = async () => {

        let networkData = null;
        let settingData = null;
        let timeData = null;
        const response1 = ({data}) => {
            settingData = data[0];
            set();

        }
        const error1 = (e) => {
        }

        const response2 = ({data}) => {
            networkData = data;
            set();

        }
        const error2 = (e) => {
        }

        const response3 = ({data}) => {
            timeData = data;
            set();

        }
        const error3 = (e) => {
        }
        const set = () => {

            if (settingData && networkData && timeData) {
                setValue({
                    "system": {
                        "name": settingData.name,
                        "locationName": settingData.location,
                        "locationGeometry": {
                            "lat": settingData.latitude,
                            "lng": settingData.longitude
                        },
                        "policeCode": settingData.policeCode,
                        "cameraStatus": Boolean(settingData.enableCamera),
                        "cameraType": Boolean(false),
                        "rotationAngle": ' ',
                        "reverseDirectionDetection": Boolean(settingData.reverseDetection)
                    },
                    "time": {
                        "method": 1,
                        "time": timeData.time,
                        "date": timeData.date,
                        "hour": 0,
                        "minute": 0,
                        "second": 0
                    },
                    "network": {
                        "tcp/IP": {
                            "method": networkData.status,
                            "manual": {
                                "ipAddress": networkData.ip,
                                "netmask": networkData.netmask,
                                "gateway": "",
                                "dns1": networkData.dns[0],
                                "dns2": networkData.dns[1]
                            }
                        },
                        "ftp": {
                            "ipAddress": settingData.ftpIpAddress,
                            "port": settingData.ftpPort,
                            "username": settingData.username,
                            "password": settingData.password,
                            "directoryPathOnTheServer": settingData.directoryPath,
                            "imageFilenamePattern": settingData.imageFileName
                        }

                    },
                    "environment": {
                        "led": {
                            "set1": {
                                "method": settingData.LED0ActiveType,
                                "brightnessPercentage": settingData.LED0Brightness,
                                "period": settingData.LED0Blinking,
                                "type": settingData.LED0Type
                            },
                            "set2": {
                                "method": settingData.LED1ActiveType,
                                "brightnessPercentage": settingData.LED1Brightness,
                                "period": settingData.LED1Blinking,
                                "type": settingData.LED1Type
                            },
                            "sunriseDelay": settingData.sunriseDelay,
                            "sunsetDelay": settingData.sunsetDelay,

                        },
                        "temperature": {
                            "fanEnable": settingData.FanActive,
                            "tec": false,
                            "environment": {
                                "active": settingData.EnvEnable,
                                "highTemperatureLimit": settingData.EnvHigh,
                                "lowTemperatureLimit": settingData.EnvLow
                            },
                            "camera": {
                                "active": settingData.CameraEnable,
                                "highTemperatureLimit": settingData.CameraHigh,
                                "lowTemperatureLimit": settingData.CameraLow
                            }
                        }
                    }

                });

            }

        }
        await SettingApi.getSetting(response1, error1);
        await MonitorApi.getNetworkConfiguration(response2, error2);
        await MonitorApi.getTimeConfiguration(response3, error3);

    }


    useEffect(() => {

        if (auth.isAuthenticated) {
            (async () => {
                await fetchData();
            })();
        }
    }, [auth.isAuthenticated]);

    return (
        <DataContext.Provider value={{
            value, fetchData

        }}>
            {children}
        </DataContext.Provider>
    )
}

const useDataState = () => {

    const values = useContext(DataContext).value;
    const refreshData = useContext(DataContext).fetchData;

    return {
        values, refreshData
    }
}
export {useDataState, DataProvider, DataContext};