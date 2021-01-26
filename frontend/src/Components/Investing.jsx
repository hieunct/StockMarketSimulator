import { Typography } from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';
import { TransactionContext, StockPriceContext, DepositContext } from './Layout'
import { withStyles, makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import TablePaginationActions from '@material-ui/core/TablePagination/TablePaginationActions';
const useStyles = makeStyles(theme => ({
    numberDisplay: {
        marginRight: theme.spacing(10)
    },
    direction: {
        display: "flex",
        flexDirection: "row",
        marginBottom: theme.spacing(5)
    }
}));
const Investing = (props) => {
    const transactions = useContext(TransactionContext).transaction;
    const updatedPrice = useContext(StockPriceContext).currentPrice;
    const buyPower = useContext(DepositContext).buyPower
    const deposit = useContext(DepositContext).deposit
    const totalReturn = () => {
        return Object.keys(transactions).reduce((result, row) => {
            let currentRowPrice = (updatedPrice[row])
            let shares = '0';
            let equity = '0';
            let totalReturn = '0';
            shares = (parseFloat(transactions[row]["shares"]).toLocaleString('en-US', { maximumFractionDigits: 7 }));
            if (shares !== undefined && currentRowPrice !== undefined) {
                equity = `$ ${(parseFloat(shares.replace(',', '')).toFixed(6) * parseFloat(currentRowPrice.replace(',', ''))).toLocaleString()}`;
            }
            totalReturn = parseFloat(parseFloat(equity.replace('$', '').replace(',', '')) - parseFloat(transactions[row]["total"])).toFixed(3)
            result += parseFloat(totalReturn);
            return result;
        }, 0)
    }
    const totalStockInitial = () => {
        return Object.keys(transactions).reduce((result, row) => {
            result += parseFloat(transactions[row]["total"])
            return result;
        }, 0)
    }
    const classes = useStyles();
    
    return (
        <React.Fragment>
            <div className={classes.direction}>
                <div className={classes.numberDisplay}>
                    <Typography align="left" variant="h2" gutterBottom>
                        Investing
                    </Typography>
                    <Typography align="left" variant="h2" gutterBottom>
                        {buyPower + totalStockInitial() + totalReturn()}
                    </Typography>
                </div>
                <div>
                    <Typography align="left" variant="h2" gutterBottom>
                        Buying Power
                    </Typography>
                    <Typography align="left" variant="h2" gutterBottom>
                        {buyPower}
                    </Typography>
                </div>
            </div>
        </React.Fragment>
    )
}
export default Investing;
// useEffect(() => {
    //     const total = () => {
    //         let sum = 0;
    //         if (Object.keys(transactions).length !== 0 && Object.keys(updatedPrice).length !== 0) {
    //             transactions.forEach((stock, i) => {
    //                 sum += parseFloat(updatedPrice[stock["Stock Name"]].replace(',', '')) * parseFloat(stock["Shares"])
    //             })
    //             return sum.toFixed(3) + totalDeposit;
    //         }
    //         else {
    //             return sum + totalDeposit;
    //         }
    //     }
    //     setInvesting(total)
    // }, [])
    // const investing = () => {
    //     let sum = 0;
    //     if (Object.keys(transactions).length !== 0 && Object.keys(updatedPrice).length !== 0) {
    //         transactions.forEach((stock, i) => {
    //             sum += parseFloat(updatedPrice[stock["Stock Name"]].replace(',', '')) * parseFloat(stock["Shares"])
    //             // console.log((updatedPrice[stock["Stock Name"]].replace(',', '')) * parseFloat(stock["Shares"]))
    //         })
    //         return sum.toFixed(3);
    //     }
    //     else {
    //         return sum;
    //     }
    // }


    // useEffect(() => {
    //     setTotalDeposit(totalDeposit => {
    //         const data = props.newDeposit;
    //         return totalDeposit + parseFloat(data["amount"])
    //     })
    //     const data = {
    //         "amount": totalDeposit,
    //         "date": Date.now()
    //     }
    //     const sendData = async () => {
    //         await axios.post('http://localhost:8080/deposit', data)
    //     }
    //     sendData()
    // }, [props.newDeposit])