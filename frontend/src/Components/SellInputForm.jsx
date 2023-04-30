import React, { useState, useContext, useEffect } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import axios from 'axios';
import { TransactionContext, StockPriceContext, DepositContext } from './Layout'
import Alert from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
}));


const SellInputForm = (props) => {
    const classes = useStyles();
    const [stockName, setStockName] = useState('');
    const [shares, setShares] = useState('');
    const [price, setPrice] = useState('');
    const [invalidQuantity, setInvalidQuantity] = useState(false);
    const [enoughShares, setEnoughShares] = useState(true);

    const handleStockNameChange = e => setStockName(e.target.value);
    const handleSharesChange = e => setShares(e.target.value);
    const handlePriceChange = e => setPrice(e.target.value);

    const modify = useContext(TransactionContext).handleModifyingStock;
    const newHistory = useContext(TransactionContext).handleModifyingHistory;
    const buyPower = useContext(DepositContext).buyPower;
    const newBuyPower = useContext(DepositContext).handleBuyAndSell;
    const updatedPrice = useContext(StockPriceContext).currentPrice;
    const globalTransaction = useContext(TransactionContext).transaction;

    const handleSubmit = async e => {
        e.preventDefault()
        e.stopPropagation()
        if (!invalidQuantity) {
            const data = {
                "Stock Name": stockName,
                "Shares": shares,
                "Price": updatedPrice[stockName],
                "Total": parseFloat(shares) * parseFloat(updatedPrice[stockName])
            };
            const history = {
                "stock": stockName.toUpperCase(),
                "shares": shares,
                "price": updatedPrice[stockName],
                "total": -(parseFloat(shares) * parseFloat(updatedPrice[stockName])),
                "date": new Date().toLocaleDateString()
            }
            axios.post(`${process.env.REACT_APP_BACKEND_URL}sellTransaction`, data)
                .then((res) => {
                    setStockName('');
                    setPrice('');
                    setShares('');
                    modify(res.data.data)
                });
            await axios.post(`${process.env.REACT_APP_BACKEND_URL}tradeHistory`, history);

            await newHistory(history);
            newBuyPower({
                "amount": parseFloat(buyPower) + (parseFloat(shares) * parseFloat(updatedPrice[stockName])),
                "date": Date.now()
            })
        }
    }

    useEffect(() => {
        const stockInfo = globalTransaction[stockName.toUpperCase()];
        const currentShares = stockInfo ? parseFloat(stockInfo['shares']) : undefined;

        if (shares < 0) {
            setInvalidQuantity(true);
        }
        else if(currentShares && currentShares < parseFloat(shares)) {
            setEnoughShares(false);
        }
        else {
            setInvalidQuantity(false);
            setEnoughShares(true);
        }
    }, [shares])

    return (
        <form className={classes.root} noValidate autoComplete="off" onSubmit={handleSubmit}>
            <FormControl>
                <InputLabel> Stock Name</InputLabel>
                <Input id="outlined-basic" onChange={handleStockNameChange} value={stockName} />
            </FormControl>
            <FormControl>
                <InputLabel> Shares</InputLabel>
                <Input type="number" id="outlined-basic" onChange={handleSharesChange} value={shares} />
            </FormControl>
            <Button type='submit' variant="contained" color="primary" onSubmit={handleSubmit}>
                Submit
            </Button>
            {invalidQuantity && <Alert severity="error">Input quantity is invalid</Alert>}
            {!enoughShares && <Alert severity="error">You do not have enough shares</Alert>}
        </form>
    );
}
export default SellInputForm