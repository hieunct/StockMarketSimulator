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
    const [totalDeposit, setTotalDeposit] = useState(0);
    const [investing, setInvesting] = useState(0);
    const transactions = useContext(TransactionContext).transaction;
    const updatedPrice = useContext(StockPriceContext).currentPrice;
    const deposit = useContext(DepositContext).deposit
    const classes = useStyles();
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
    return (
        <React.Fragment>
            <div className={classes.direction}>
                <div className={classes.numberDisplay}>
                    <Typography align="left" variant="h2" gutterBottom>
                        Investing
                    </Typography>
                    <Typography align="left" variant="h2" gutterBottom>
                        {deposit}
                    </Typography>
                </div>
                <div>
                    <Typography align="left" variant="h2" gutterBottom>
                        Buying Power
                    </Typography>
                    <Typography align="left" variant="h2" gutterBottom>
                        {deposit}
                    </Typography>
                </div>
            </div>
        </React.Fragment>
    )
}
export default Investing;