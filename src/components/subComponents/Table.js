import {Card, CardBody, CardTitle, CardSubtitle, Table} from "reactstrap";
import {CircularProgress, Typography} from "@mui/material";
import styles from "../../assets/css/page.module.scss";

const CustomTable = (props) => {
    return (
        <div className={styles.table} style={props.bottom !== null ? {bottom: props.bottom} : {}}>
            {props.loading ?
                <div
                    style={{display: "flex", flexDirection: 'column', justifyContent: "center", height: 600}}>
                    <div style={{alignSelf: "center", display: "flex"}}>
                        <Typography variant={"body1"} style={{
                            display: "flex",
                            flexDirection: 'column',
                            justifyContent: 'center',
                            margin: 10
                        }}>
                            در حال بارگذاری اطلاعات
                        </Typography>
                        <CircularProgress/>
                    </div>
                </div> :
                <Card style={{padding: 15}}>
                    <CardBody>
                        <CardTitle tag="h5">
                            {/*Project Listing*/}
                        </CardTitle>
                        <CardSubtitle className="mb-2 text-muted" tag="h6">
                            {/*Overview of the projects*/}
                        </CardSubtitle>

                        <Table className="no-wrap mt-3 align-middle" responsive borderless>
                            <thead>
                            <tr>
                                {props.headers.map((item, index) => <th style={{
                                    width: item.width ? item.width : null,
                                    minWidth: item.width ? item.width : null
                                }} key={index}>{item.title}</th>)}
                            </tr>
                            </thead>
                            <tbody>
                            {props.rows.map((row, index) =>
                                <tr key={index} className="border-top">
                                    {props.headers.map((item, index) => <td
                                        style={item.align ? {textAlign: item.align} : {}}
                                        key={index}>{item.renderCell(row)}</td>)}
                                </tr>)}

                            {!props.rows.length && <>

                            </>}
                            </tbody>
                        </Table>


                    </CardBody>
                </Card>
            }
        </div>
    );
};

export default CustomTable;
