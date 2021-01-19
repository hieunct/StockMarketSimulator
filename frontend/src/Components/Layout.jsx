import { useState } from 'react';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import StockDisplay from './StockDisplay';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Progress from './Progress';
import BuyInputForm from './BuyInputForm';
import SellInputForm from './SellInputForm';
import { Typography } from '@material-ui/core';
const useStyles = makeStyles({
    table: {
        minWidth: 700,
    },
    tableRightBorder: {
        borderWidth: 1,
        borderColor: 'black',
        borderStyle: 'solid'
    },
    stockDisplay: {
        width: 600,
        marginRight: 30,
    },
    lineDisplay: {
        marginBottom: 100,
    },
    inputAndTable: {
        display: "flex",
        alignItems: "center",
        marginTop: 50,
        justify: "flex-end",
        flexDirection: "row"
    }
});

const Layout = () => {
    const classes = useStyles();
    const [newStock, setNewStock] = useState({});
    const [deleteStock, setDeleteStock] = useState({});
    const addData = (data) => {
        setNewStock(data);
    }
    const sellStock = (data) => {
        setDeleteStock(data);
    }
    return (
        <React.Fragment>
            <Grid container>
                <Grid xs={12}>
                    <Progress>
                    </Progress>
                </Grid>
                <Grid className={classes.inputAndTable}>
                    <Grid className={classes.stockDisplay} >
                        <StockDisplay newStock={newStock} deleteStock={deleteStock}>
                        </StockDisplay>

                    </Grid>
                    <Grid>
                        <Typography variant="h4" align="left" color="primary">
                            Buy Stock
                        </Typography>
                        <BuyInputForm onSubmit={addData}>
                        </BuyInputForm>
                        <Typography variant="h4" align="left" color="primary">
                            Sell Stock
                        </Typography>
                        <SellInputForm onSubmit={sellStock}>

                        </SellInputForm>
                    </Grid>
                </Grid>
            </Grid>
        </React.Fragment >
    );
}
export default Layout;