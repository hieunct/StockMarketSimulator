import { useState, useEffect, useRef } from 'react';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import StockDisplay from './StockDisplay';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Progress from './Progress';
import BuyInputForm from './BuyInputForm';
import SellInputForm from './SellInputForm';
import DepositForm from './DepositForm';
import WithdrawalForm from './WithdrawalForm';
import axios from 'axios';
import io from 'socket.io-client';
import { Typography } from '@material-ui/core';
import Investing from './Investing';
const useStyles = makeStyles(theme => ({
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
    },
    investing: {
        marginLeft: theme.spacing(10)
    },
    deposit: {
        display: "flex",
        flexDirection: "row",
        marginTop: theme.spacing(4)
    },
    depositMargin: {
        marginRight: theme.spacing(2)
    }
}));

export const TransactionContext = React.createContext();
export const StockPriceContext = React.createContext();
export const DepositContext = React.createContext();

const useIsMount = () => {
    const isMountRef = useRef(true);
    useEffect(() => {
      isMountRef.current = false;
    }, []);
    return isMountRef.current;
  };
const Layout = () => {
    const classes = useStyles();
    const [newStock, setNewStock] = useState({});
    const [deleteStock, setDeleteStock] = useState({});
    const [transaction, setTransaction] = useState({});
    const [currentPrice, setCurrentPrice] = useState({});
    const [deposit, setDeposit] = useState(0);
    const prevDeposit = useRef();
    const isMount = useIsMount();
    const addData = (data) => {
        setNewStock(data);
    }
    const sellStock = (data) => {
        setDeleteStock(data);
    }
    function createTransaction(shares, price, total, current) {
        return { shares, price, total, current };
    }
    const handleModifyingStock = (data, boolean) => {
        setTransaction(transaction => {
            if (data["Shares"] === 0) {
                delete transaction[data["Stock Name"]];
                console.log(transaction)
                return { ...transaction }
            }
            return { ...transaction, [data["Stock Name"]]: createTransaction(data["Shares"], data["Price"], data["Total"], 0) }
        })
    }

    async function handleDepositChange (data) {
        setDeposit(deposit => {
            return parseFloat(deposit) + parseFloat(data["amount"])
        })
    }

    async function handleBuyAndSell (data) {
        setDeposit(data["amount"])
    }
    useEffect(() => {
        prevDeposit.current = deposit;
    })

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get('http://localhost:8080/allTransactions')
            if (Object.keys(response.data).length !== 0) {
                const stockList = response.data.map(row => row["Stock Name"]);
                let stockMap = {}
                response.data.forEach((stock, i) => {
                    const names = stock["Stock Name"]
                    stockMap = { ...stockMap, [names]: createTransaction(stock["Shares"], stock["Price"], stock["Total"], 0) }
                })
                setTransaction(stockMap);
            }
            else {
                setTransaction({})
            }
        }
        const fetchData2 = async () => {
            const response = await axios.get('http://localhost:8080/allStockPrice')
            setCurrentPrice(response.data);
        }
        fetchData();
        fetchData2();
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get("http://localhost:8080/mostRecentDeposit")
            if (response.data.length !== 0) {
                setDeposit(response.data[0].amount);
            }
        }
        fetchData()
    }, [])

    useEffect(() => {
        const socket = io.connect("http://localhost:8080");
        socket.on("change-type", async (data) => {
            const [key, value] = Object.entries(data)[0]
            setCurrentPrice((currentPrice) => {
                return { ...currentPrice, [key]: value }
            })
        })
    }, [])

    useEffect(() => {
        const sendDeposit = async () => {
            const data = {
                "amount": deposit,
                "date": Date.now(),
            }
            await axios.post("http://localhost:8080/deposit", data)
        }
        console.log(prevDeposit.current)
        console.log(deposit)
        if(deposit !== 0 && deposit !== localStorage.getItem("deposit")) {
            sendDeposit();
        }
    }, [deposit])

    useEffect(() => {
        localStorage.setItem("deposit", deposit);
    }, [prevDeposit.current])
    return (
        <React.Fragment>
            <Grid container>
                <StockPriceContext.Provider value={{ currentPrice }}>
                    <TransactionContext.Provider value={{ transaction, handleModifyingStock }}>
                        <Grid className={classes.inputAndTable}>
                            <Grid className={classes.stockDisplay} >
                                <StockDisplay newStock={newStock} deleteStock={deleteStock}>
                                </StockDisplay>
                            </Grid>
                            <DepositContext.Provider value={{ deposit, handleDepositChange, handleBuyAndSell }}>
                                <Grid>
                                    <Investing >
                                    </Investing>
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
                                    <div className={classes.deposit}>
                                        <div className={classes.depositMargin}>
                                            <Typography variant="h4" align="left" color="primary">
                                                Deposit
                                                </Typography>
                                            <DepositForm >
                                            </DepositForm>
                                        </div>
                                        <div>
                                            <Typography variant="h4" align="left" color="primary">
                                                Withdraw
                                                </Typography>
                                            <WithdrawalForm>
                                            </WithdrawalForm>
                                        </div>
                                    </div>
                                </Grid>
                            </DepositContext.Provider>
                        </Grid>
                    </TransactionContext.Provider>
                </StockPriceContext.Provider>
            </Grid>
        </React.Fragment >
    );
}
export default Layout;