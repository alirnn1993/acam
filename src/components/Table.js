import { Table} from "reactstrap";
import {CircularProgress, Typography} from "@mui/material";
import styles from "../assets/css/page.module.scss";
import {useEffect} from "react";
import $ from 'jquery';
import PropTypes from "prop-types";

const CustomTable = ({headers,rows,containerStyle,fixed,overflowY,fullWidth,hasTitle,loading,hasIndex,pageCount,page}) => {

    useEffect(()=>{},[rows]);


    useEffect(() => {
        if (!fixed)
            $("#table").css("position", "inherit");
        if(overflowY)
            $("#table").css("overflow-y",overflowY)
        if(fullWidth)
            $("#table").css("width","100%")

    });
    return (
        <div className={styles.table} style={{...containerStyle}} id={"table"}>
            {loading ?
                <div
                    style={{display: "flex", flexDirection: 'column', justifyContent: "center", height: 600}}>
                    <div style={{alignSelf: "center", display: "flex"}}>
                        <Typography variant={"body1"} style={{
                            display: "flex",
                            flexDirection: 'column',
                            justifyContent: 'center',
                            margin: 10
                        }}>
                            Loading Data
                        </Typography>
                        <CircularProgress sx={{
                            color: "#fb8500",
                        }}/>
                    </div>
                </div> :


                <Table  style={{maxWidth:750}}>
                    <thead style={{marginBottom: 15,borderBottomStyle:"solid",borderBottomWidth:2,borderBottomColor:"#000",background:"#fff"}}>
                    {hasTitle&&<tr style={{marginBottom: 5}}>
                        {headers.map((item, index) => <th style={{
                            width: item.width ? item.width : null,
                            minWidth: item.width ? item.width : null, fontSize: "0.75rem"
                        }} key={index}>{item.title}</th>)}
                    </tr>}


                    </thead>
                    <tbody>
                    {rows.map((row, outIndex) =>
                        <tr key={outIndex} style={{borderBottom:"1px solid rgba(190,190,190,0.8)"}}>
                            {headers.map((item, index) => <td
                                style={item.align ? {textAlign: item.align,width: item.width ? item.width : null,
                                    minWidth: item.width ? item.width : null,} : {width: item.width ? item.width : null,
                                    minWidth: item.width ? item.width : null}}
                                key={index}>{hasIndex?item.renderCell(row,(page-1)*pageCount+outIndex+1):item.renderCell(row)}</td>)}
                        </tr>)}
                    </tbody>
                </Table>

            }
        </div>
    );
};


CustomTable.propTypes={
    containerStyle: PropTypes.object,
    loading: PropTypes.bool,
    page: PropTypes.number,
    pageCount: PropTypes.number,
    hasTitle: PropTypes.bool,
    hasIndex: PropTypes.bool,
    fixed: PropTypes.bool,
    rows: PropTypes.arrayOf(PropTypes.object),
    headers: PropTypes.arrayOf(PropTypes.object),
}

CustomTable.defaultProps ={
    containerStyle:{},
    rows:[],
    loading:false,
    hasTitle:false,
    hasIndex:false,
    page:0,
    pageCount:0,
    fixed:false
}

export default CustomTable;


