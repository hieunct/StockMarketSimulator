
import './App.css';
import Layout from './Components/Layout';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import Progress from './Components/Progress';
// export const TransactionContext = React.createContext();
// export const StockPriceContext = React.createContext();

const App = () => {
  // const [transaction, setTransaction] = useState({});
  // const [currentPrice, setCurrentPrice] = useState({});
  // const [newData, setNewData] = useState(false)
  // useEffect(() => {
  //   const fetchData1 = async () => {
  //     const response1 = await axios.get('http://localhost:8080/allTransactions')
  //     const response2 = await axios.get('http://localhost:8080/allStockPrice')
  //     setCurrentPrice(response2.data);
  //     setTransaction(response1.data);
  //   }
  //   fetchData1();
  // }, [newData])

  // useEffect(() => {
  //   const socket = io.connect("http://localhost:8080");
  //   socket.on("change-type", async (data) => {
  //     const [key, value] = Object.entries(data)[0]
  //     setCurrentPrice((currentPrice) => {
  //       return { ...currentPrice, [key]: value }
  //     })
  //   })
  // }, [])

  return (
    <div>
      {/* {console.log(currentPrice)} */}
      {/* <StockPriceContext.Provider value={{ currentPrice, setCurrentPrice }}>
        <TransactionContext.Provider value={{ transaction, setNewData }}> */}
      <h1 align="center">Stock Market</h1>
      <Progress>
      </Progress>

      <Layout>

      </Layout>
      {/* </TransactionContext.Provider>
      </StockPriceContext.Provider> */}
    </div>
  );
}

export default App;
