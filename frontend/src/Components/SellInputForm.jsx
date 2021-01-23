import React, { useState, useEffect, useContext } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import axios from 'axios';
import { TransactionContext, StockPriceContext } from './Layout'

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
    const handleStockNameChange = e => setStockName(e.target.value);
    const handleSharesChange = e => setShares(e.target.value);
    const handlePriceChange = e => setPrice(e.target.value);
    const modify = useContext(TransactionContext).handleModifyingStock;
    const handleSubmit = async e => {
        e.preventDefault()
        const data = {
            "Stock Name": stockName,
            "Shares": shares,
            "Price": price,
            "Total": shares * price
        };
        axios.post('http://localhost:8080/sellTransaction', data)
            .then((res) => {
                setStockName('');
                setPrice('');
                setShares('');
                modify(res.data.data)
            });
    }
    return (
        <form className={classes.root} noValidate autoComplete="off" onSubmit={handleSubmit}>
            <FormControl>
                <InputLabel> Stock Name</InputLabel>
                <Input id="outlined-basic" onChange={handleStockNameChange} value={stockName} />
            </FormControl>
            <FormControl>
                <InputLabel> Shares</InputLabel>
                <Input id="outlined-basic" onChange={handleSharesChange} value={shares} />
            </FormControl>
            <FormControl>
                <InputLabel> Price sold</InputLabel>
                <Input id="outlined-basic"
                    onChange={handlePriceChange}
                    value={price}
                    startAdornment={<InputAdornment position="start">$</InputAdornment>} />
            </FormControl>
            <Button type='submit' variant="contained" color="primary" onSubmit={handleSubmit}>
                Submit
            </Button>
        </form>
    );
}
export default SellInputForm