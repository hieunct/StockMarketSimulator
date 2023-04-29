import Button from '@material-ui/core/Button';
import React, { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import { StockPriceContext } from './Layout'

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
}));


const ResetButton = () => {
    const classes = useStyles();
    const resetPage = useContext(StockPriceContext).handleResetPage;
    const handleSubmit = async e => {
        e.preventDefault()
        e.stopPropagation()
        await resetPage()
    }

    return (
        <React.Fragment>
            <form className={classes.root} noValidate autoComplete="off" onSubmit={handleSubmit}>
                <Button type='submit' variant="contained" color="primary" >
                    Reset Portfolio
                </Button>
            </form>
        </React.Fragment>
    );
}


export default ResetButton