const e = require("express");

const insertTransaction = (db, callback, data) => {
    db.collection('Transactions').insertOne(data, (err, result) => {
        // console.log(result)
        callback()
    })
}

const getAllTransactions = async (db, callback, data) => {
    const dataList = db.collection('Transactions').find().toArray((err, result) => {
        if (err) {
            throw err;
        }
        data = result
        // console.log(result)
    })
    await dataList;
    console.log(data)
    callback()
};

const updateExistedStock = (db, callback, existedStock, data) => {
    data["Shares"] = parseInt(existedStock["Shares"]) + parseInt(data["Shares"]);
    data["Total"] = parseInt(existedStock["Total"]) + parseInt(data["Total"]);
    data["Price"] = parseInt(data["Total"]) / parseInt(data["Shares"]);
    const filter = { "Stock Name": data["Stock Name"] }
    const updateDoc = {
        $set: {
            "Shares": data["Shares"],
            "Price": data["Price"],
            "Total": data["Total"]
        },
    };
    db.collection('Transactions').updateOne(filter, updateDoc,
        (err, result) => {
            callback();
        })
}

const insertStockPrice = (db, data) => {
    db.collection("StockPrice").insertOne(data, (err, res) => {
        if (err) {
            throw err;
        }
        console.log(res);
    })
}

const sellTransaction = (db, callback, existedStock, data) => {
    data["Shares"] = parseInt(existedStock["Shares"]) - parseInt(data["Shares"]);
    data["Total"] = parseInt(existedStock["Total"]) - parseInt(data["Total"]);
    const filter = { "Stock Name": data["Stock Name"] }
    if (data["Shares"] == 0) {
        db.collection("Transactions").deleteOne(filter, (err, res) => {
            if (err) {
                throw (err);
            }
            callback();
        })
        db.collection("StockPrice").deleteOne({"stock": data["Stock Name"]}, (err, res) => {
            if (err) {
                throw (err);
            }
        })
    }
    else {
        const updateDoc = {
            $set: {
                "Shares": data["Shares"],
                "Total": data["Total"]
            },
        };
        db.collection("Transactions").updateOne(filter, updateDoc, (err, res) => {
            if (err) {
                throw (err);
            }
            callback();
        })
    }
}

const depositMoney = (db, callback, data) => {
    db.collection("Deposit").insertOne(data, (err, res) => {
        if (err) {
            console.log(err);
        }
        callback();
    })
}

exports.insertTransaction = insertTransaction;
exports.getAllTransactions = getAllTransactions;
exports.updateExistedStock = updateExistedStock;
exports.insertStockPrice = insertStockPrice;
exports.sellTransaction = sellTransaction;
exports.depositMoney = depositMoney;