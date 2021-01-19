import { Chart } from 'chart.js';
import React, { useState, useEffect } from 'react';
import Investing from './Investing';
import { withStyles, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    investing: {
        marginLeft: theme.spacing(10)
    }
}));
const Progress = () => {
    const [stockPrice, setStockPrice] = useState([]);
    const [stockInterval, setStockInterval] = useState([]);
    const classes = useStyles()
    useEffect(() => {
        fetchStock()
    }, []);


    const fetchStock = () => {
        const API_KEY = 'DG4BRBSVFRTU4V67';
        let StockSymbol = 'BTC';
        let API_Call = `https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=BTC&market=USD&apikey=${API_KEY}`
        let stockPricee = [];
        let stockIntervall = [];

        fetch(API_Call)
            .then(
                function (response) {
                    return response.json();
                }
            )
            .then(
                function (data) {
                    console.log(data);

                    for (var key in data['Time Series (Digital Currency Daily)']) {
                        stockIntervall.push(key);
                        stockPricee.push(data['Time Series (Digital Currency Daily)'][key]['1a. open (USD)']);
                    }
                    setStockPrice(stockPricee.reverse())
                    setStockInterval(stockIntervall.reverse())
                }
            )
    }

    useEffect(() => {
        const ctx = document.getElementById("stockChart");
        new Chart(ctx, {
            type: "line",
            data: {
                labels: stockInterval,
                datasets: [
                    {
                        fill: false,
                        label: "BTC",
                        lineTension: 0.2,
                        backgroundColor: 'rgba(75,192,192,0.4)',
                        borderColor: 'rgba(75,192,192,1)',
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: 'rgba(75,192,192,1)',
                        pointBackgroundColor: '#fff',
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                        pointHoverBorderColor: 'rgba(220,220,220,1)',
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: stockPrice,
                    }
                ]
            }
        });
    });


    return (
        <React.Fragment>
            <div>
                <h1 align="center">Stock Market</h1>
                <div className={classes.investing}>
                    <Investing>
                    </Investing>
                </div>

                <div className="Progress">
                    <canvas id="stockChart" width={document.body.clientWidth} height="450" />
                </div>
            </div>
        </React.Fragment>
    )
}
export default Progress;