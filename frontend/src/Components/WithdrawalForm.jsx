import React, { useState, useContext, useEffect } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
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


const WithdrawalForm = (props) => {
    const classes = useStyles();
    const [deposit, setDeposit] = useState('');
    const [invalidQuantity, setInvalidQuantity] = useState(false);
    const [enoughMoney, setEnoughMoney] = useState(true)

    const newDeposit = useContext(DepositContext).handleDepositChange
    const newBuyPower = useContext(DepositContext).handleBuyPowerChange

    const handleDepositChange = e => setDeposit(e.target.value);

    const handleSubmit = async e => {
        e.preventDefault()
        e.stopPropagation()
        if (!invalidQuantity) {
            const data = {
                "amount": -deposit,
                "date": Date.now()
            }
            setDeposit('');
            newDeposit(data);
            newBuyPower(data);
        }
    }

    useEffect(() => {
        const currentInvest = localStorage.getItem('investing');
        if (deposit < 0) {
            setInvalidQuantity(true);
        }
        else if (currentInvest - deposit < 0) {
            setEnoughMoney(false);
        }
        else {
            setInvalidQuantity(false);
            setEnoughMoney(true)
        }
    }, [deposit])

    return (
        <form className={classes.root} noValidate autoComplete="off" onSubmit={handleSubmit}>
            <FormControl>
                <InputLabel> Amount</InputLabel>
                <Input type="number" id="outlined-basic" onChange={handleDepositChange} value={deposit} />
            </FormControl>
            <Button type='submit' variant="contained" color="primary" onSubmit={handleSubmit}>
                Submit
            </Button>
            {invalidQuantity && <Alert severity="error">Input quantity is invalid</Alert>}
            {!enoughMoney && <Alert severity="error">You are withrawing more than you have</Alert>}
        </form>
    );
}
export default WithdrawalForm;