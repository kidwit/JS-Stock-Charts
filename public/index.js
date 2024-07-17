function getColor(stock) {
    if (stock === "GME") {
        return 'rgba(61, 161, 61, 0.7)';
    } else if (stock === "MSFT") {
        return 'rgba(209, 4, 25, 0.7)';
    } else if (stock === "DIS") {
        return 'rgba(18, 4, 209, 0.7)';
    } else if (stock === "BNTX") {
        return 'rgba(166, 43, 158, 0.7)';
    }
}

async function main() {
    const timeChartCanvas = document.querySelector('#time-chart');
    const highestPriceChartCanvas = document.querySelector('#highest-price-chart');
    const averagePriceChartCanvas = document.querySelector('#average-price-chart');

    const API_KEY = '6b65a4a29c4140c8b1382e4d931f10a2';
    const symbols = ['GME', 'MSFT', 'DIS', 'BNTX'].join(',');

    const url = `https://api.twelvedata.com/time_series?symbol=${symbols}&interval=1day&apikey=${API_KEY}`;

    try {
        const response = await fetch(url);
        const result = await response.json();
        console.log(result); // Inspect the data

        const stocks = [result.GME, result.MSFT, result.DIS, result.BNTX];

        // Reverse the values for each stock
        stocks.forEach(stock => stock.values.reverse());

        // Log the updated stocks data to inspect
        console.log(stocks);

        // Time Chart
        new Chart(timeChartCanvas.getContext('2d'), {
            type: 'line',
            data: {
                labels: stocks[0].values.map(value => value.datetime),
                datasets: stocks.map(stock => ({
                    label: stock.meta.symbol,
                    backgroundColor: getColor(stock.meta.symbol),
                    borderColor: getColor(stock.meta.symbol),
                    data: stock.values.map(value => parseFloat(value.high))
                }))
            }
        });
    // High Chart
    new Chart(highestPriceChartCanvas.getContext('2d'), {
        type: 'bar',
        data: {
            labels: stocks.map(stock => stock.meta.symbol),
            datasets: [{
                label: 'Highest',
                backgroundColor: stocks.map(stock => (
                    getColor(stock.meta.symbol)
                )),
                borderColor: stocks.map(stock => (
                    getColor(stock.meta.symbol)
                )),
                data: stocks.map(stock => (
                    findHighest(stock.values)
                ))
            }]
        }
    });
    } catch (error) {
        console.error('Error fetching stock data:', error);
    }
}

function findHighest(values) {
    let highest = 0;
    values.forEach(value => {
        if (parseFloat(value.high) > highest) {
            highest = value.high
        }
    })
    return highest
}


main();
