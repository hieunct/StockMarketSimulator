import React, { useState, useEffect } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import axios from 'axios';
import io from 'socket.io-client';

// const _ = require('lodash')
const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.primary.light,
        color: theme.palette.common.black,
        borderWidth: 1,
        borderColor: 'black',
        borderStyle: 'solid',
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
    },
}))(TableRow);



function createData(shares, price, total, current) {
    return { shares, price, total, current };
}

const useStyles = makeStyles({
    table: {
        minWidth: 500,
        marginLeft: 30,
    },
    tableRightBorder: {
        borderWidth: 1,
        borderColor: 'black',
        borderStyle: 'solid',
    },
});


const StockDisplay = (props) => {
    const classes = useStyles();
    const [rows, setRows] = useState([]);
    const [stockDict, setStockDict] = useState({});
    const [currentPrice, setCurrentPrice] = useState({});

    useEffect(() => {
        console.log("re-render")
        axios.get('http://localhost:8080/allStockPrice')
            .then((res) => {
                setCurrentPrice(res.data)
            })
    }, [])

    useEffect(() => {
        axios.get('http://localhost:8080/allTransactions')
            .then((res) => {
                // console.log(stockMap)
                const stockList = res.data.map(row => row["Stock Name"]);
                console.log(stockList)
                let stockMap = {}
                for (var i = 0; i < res.data.length; i++) {
                    const stock = res.data;
                    const names = stock[i]["Stock Name"]
                    stockMap = { ...stockMap, [names]: createData(stock[i]["Shares"], stock[i]["Price"], stock[i]["Total"], 0) }
                }
                setStockDict(stockMap);
                setRows(stockList);

            })
        // addData(props.newStock)
    }, [props.newStock])

    useEffect(() => {
        let stockList = rows;
        stockList = rows.filter((item) => {
            return item !== props.deleteStock["Stock Name"]
        })
        setRows(stockList)
    }, [props.deleteStock])

    useEffect(() => {
        const socket = io.connect("http://localhost:8080");
        socket.on("change-type", async (data) => {
            const [key, value] = Object.entries(data)[0]
            setCurrentPrice((currentPrice) => {
                return { ...currentPrice, [key]: value }
            })
        })
    }, [])

    // const addData = (data) => {
    //     if (stockDict[data["Stock Name"]] === undefined) {
    //         setStockDict((stockDict) => {
    //             return { ...stockDict, [data["Stock Name"]]: createData(data["Shares"], data["Price"], data["Total"]) }
    //         });
    //     }
    //     else if (data["Stock Name"] !== undefined) {
    //         console.log(data)
    //         const stockList = stockDict;
    //         stockList[data["Stock Name"]] = createData(data["Shares"], data["Price"], data["Total"]);
    //         setStockDict(stockList);
    //     }
    // }

    return (
        <TableContainer border={1} component={Paper}>
            <Table aria-label="customized table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell className={classes.tableRightBorder} align="center">Stock Name</StyledTableCell>
                        <StyledTableCell className={classes.tableRightBorder} align="center">Shares</StyledTableCell>
                        <StyledTableCell className={classes.tableRightBorder} align="center">Equity</StyledTableCell>
                        <StyledTableCell className={classes.tableRightBorder} align="center">Total Return</StyledTableCell>
                        <StyledTableCell className={classes.tableRightBorder} align="center">Current Price</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.reduce((result, row) => {
                        let currentRowPrice = (currentPrice[row])
                        let shares = 0;
                        let equity = 0;
                        let totalReturn = 0 
                            shares = (parseFloat(stockDict[row]["shares"]).toLocaleString('en-US', { maximumFractionDigits: 7 }));
                            equity = `$ ${(parseFloat(shares.replace(',', '')).toFixed(6) * parseFloat(currentRowPrice.replace(',', ''))).toLocaleString()}`;
                            totalReturn = parseFloat(parseFloat(equity.replace('$', '').replace(',', '')) - parseFloat(stockDict[row]["total"])).toFixed(3)
                        if (stockDict[row]["shares"] !== 0) {
                            result.push(<StyledTableRow>
                                <StyledTableCell className={classes.tableRightBorder} component="th" scope="row" align="center">
                                    {row}
                                </StyledTableCell>
                                <StyledTableCell className={classes.tableRightBorder} align="center">{shares}</StyledTableCell>
                                <StyledTableCell className={classes.tableRightBorder} align="center">{equity}</StyledTableCell>
                                <StyledTableCell className={classes.tableRightBorder} align="center">{totalReturn}</StyledTableCell>
                                <StyledTableCell className={classes.tableRightBorder} align="center">{currentRowPrice}</StyledTableCell>
                            </StyledTableRow>)
                        }
                        return result
                    }, [])}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
export default StockDisplay;