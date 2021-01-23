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


const WithdrawalForm = (props) => {
    const classes = useStyles();
    const [deposit, setDeposit] = useState('');
    
    const handleDepositChange = e => setDeposit(e.target.value);

    const handleSubmit = async e => {
        e.preventDefault()
        const data = {
            "amount": deposit,
            "date": Date().toLocaleString()
        }
        axios.post('http://localhost:8080/deposit', data)
            .then((res) => {
                setDeposit('')
            });
    }
    return (
        <form className={classes.root} noValidate autoComplete="off" onSubmit={handleSubmit}>
            <FormControl>
                <InputLabel> Amount</InputLabel>
                <Input id="outlined-basic" onChange={handleDepositChange} value={deposit} />
            </FormControl>
            <Button type='submit' variant="contained" color="primary" onSubmit={handleSubmit}>
                Submit
            </Button>
        </form>
    );
}
export default WithdrawalForm;