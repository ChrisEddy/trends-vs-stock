import React, { Component } from 'react';
import '../css/graphs.css';
import Chart from 'chart.js';

const host = '/';

class Graphs extends Component {
    constructor(props){
        super(props)
        this.state = {
            trend: '',
            trendData: {},
            trendChartObject: {},
            stockChartObject: {},
            stock: '',
            stockData: {}
        }
        this.handleTrendChange = this.handleTrendChange.bind(this);
        this.handleStockChange = this.handleStockChange.bind(this);
        this.removeChart = this.removeChart.bind(this);
        this.createTrendChart = this.createTrendChart.bind(this);
        this.createStockChart = this.createStockChart.bind(this);
        this.createFavCharts = this.createFavCharts.bind(this);
    }

    componentDidMount(){        
        this.createTrendChart([], []);
        this.createStockChart([], []);
    }

    handleTrendChange(e){
        this.setState({trend: e.target.value});
    }

    handleStockChange(e){
        this.setState({stock: e.target.value});
    }

    fetchTrendData(e, trend){
        e.preventDefault();
        if(trend.length > 0){
            this.setState({trendData: {}})
            console.log('Fetching new trend data...');
            let data = JSON.stringify({query: trend});
            fetch(host + "trend", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: data,
            }).then(response => {
                return response.json();
            }).then(data =>{
                console.log(data.result);
                this.setState({trendData: data.result.default});
                const parsedLabels = [];
                const parsedData = [];
                for (let i = 0; i < this.state.trendData.timelineData.length; i++){
                    parsedLabels[i] = this.state.trendData.timelineData[i].formattedAxisTime;
                    parsedData[i] = this.state.trendData.timelineData[i].value[0];
                }
                this.removeChart(this.state.trendChartObject);
                this.createTrendChart(parsedLabels, parsedData);
            });
        }
        else{
            console.log('Cannot get trend from empty form.');
        }
       
    }

    fetchStockData(e, stock){
        e.preventDefault();
        if(stock.length > 0){
            console.log('Fetching new stock data...');
            this.setState({stockData: {}})
            let resource = 'https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol=' + stock.toUpperCase() + '&apikey=8C87NWCAZA7OFTRU';
            console.log(stock);
            if(stock){
                fetch(resource, {
                    method: "GET",
                    headers: {"Content-Type": "application/json"}
                }).then(response => {
                    return response.json();
                }).then(data =>{
                    const parsedLabels = [];
                    const parsedData = [];
                    if(!data.hasOwnProperty('Error Message')){
                        Object.keys(data['Weekly Time Series']).map(key1 => {
                            parsedLabels.push(key1);
                            parsedData.push(data['Weekly Time Series'][key1]["4. close"]);
                            // Object.keys(data['Weekly Time Series'][key1]["4. close"]).map(key2 => {
                                 
                            // })
                        })
                        let oneYearLabels = parsedLabels.slice(0, 52).reverse();
                        let oneYearData = parsedData.slice(0, 52).reverse();
                        this.removeChart(this.state.stockChartObject);
                        this.createStockChart(oneYearLabels, oneYearData);
                    }
                    else{
                        console.log('Not a valid stock name')
                    }
                   
                });
            }
            else{
                console.log('No stock provided')
            }
        }
    }

    removeChart(chart){
        chart.destroy();
    }

    createFavCharts(e, trend, stock){
        e.preventDefault();
        this.setState({trend: trend});
        this.setState({stock: stock});
        this.removeChart(this.state.stockChartObject);
        this.removeChart(this.state.trendChartObject);
        this.fetchStockData(e, stock)
        this.fetchTrendData(e, trend)
    }

    createTrendChart(labels, data){
        this.setState({trendChartObject: 
            new Chart(document.getElementById("trendChart").getContext('2d'), {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Interest Over Time',
                        data: data,
                        backgroundColor: [
                            '#b3e6ff'
                        ],
                        borderColor: [
                            '#0099e6'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: false
                            }
                        }]
                    }
                }
            })
        });
    }

    createStockChart(labels, data){
        this.setState({stockChartObject: 
            new Chart(document.getElementById("stockChart").getContext('2d'), {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Stock Price',
                        data: data,
                        backgroundColor: [
                            '#ffe4a5'
                        ],
                        borderColor: [
                            '#FD7152'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: false
                            }
                        }]
                    }
                }
            })
        });
    }

    render() {
        return (
        <div className="Graphs">
            <div className='row m-0'>
                <div className='col-lg-6 col-md-12 col-sm-12 col-xs-12'>
                    <canvas id="trendChart"></canvas>
                    <form className='pt-3'>
                        <div className="form-group">
                            <input onChange={this.handleTrendChange} value={this.state.trend} type="text" className="form-control" placeholder="Enter Search Term or Topic"/>
                            <small className="form-text text-muted">This uses the Google Trends API</small>
                        </div>
                    <button onClick={(e) => this.fetchTrendData(e, this.state.trend)} type="submit" className="btn btn-primary">Load Trend</button>
                    </form>
                </div>
                <div className='col-lg-6 col-md-12 col-sm-12 col-xs-12'>
                    <canvas id="stockChart"></canvas>
                    <form className='pt-3'>
                        <div className="form-group">
                            <input onChange={this.handleStockChange} value={this.state.stock} type="text" className="form-control" placeholder="Enter a Stock Ticker"/>
                            <small className="form-text text-muted">This uses Alpha Vantage API - Must use proper ticker notation</small>
                        </div>
                    <button onClick={(e) => this.fetchStockData(e, this.state.stock)} type="submit" className="btn btn-primary">Load Stock</button>
                    </form>
                </div>
            </div>

            <div className='row pt-4 ml-0 mr-0'>
                <div className='col-12 pb-2'>
                    <h4>Developer Favorites</h4>
                </div>
                <div className='col-lg-4'>
                    <div className="card" style={{width: '18rem'}}>
                        <div className="card-body">
                            <h5 className="card-title">EA Games</h5>
                            <p className="card-text">With the most downvoted <a href='https://www.reddit.com/r/StarWarsBattlefront/comments/7cff0b/seriously_i_paid_80_to_have_vader_locked/dppum98/?st=jeedsu6r&sh=a382c6a2'> Reddit comment</a> in history...</p>
                            <p>EA stock prices tumbled as investors watched the reddit drama unfold.</p>
                            <button onClick={(e) => this.createFavCharts(e, 'EA Games', 'EA')} type="submit" className="btn btn-primary">Load Charts</button>
                        </div>
                    </div>
                </div>

                <div className='col-lg-4'>
                    <div className="card" style={{width: '18rem'}}>
                        <div className="card-body">
                            <h5 className="card-title">Facebook</h5>
                            <p className="card-text">During the recent Mark Zuckerberg congress meetings...</p>
                            <p>Facebook stock plummeted as faith was lost in the company's business practices</p>
                            <button onClick={(e) => this.createFavCharts(e, 'Facebook', 'FB')} type="submit" className="btn btn-primary">Load Charts</button>
                        </div>
                    </div>
                </div>
            
                <div className='col-lg-4'>
                    <div className="card" style={{width: '18rem'}}>
                        <div className="card-body">
                            <h5 className="card-title">Iraq War</h5>
                            <p className="card-text">Check out the changes in Oil price as president bush was ramping up the Iraq invasion.</p>
                            <p>Some say the middle east wars are about oil, checkout the stocks...</p>
                            <button onClick={(e) => this.createFavCharts(e, 'Iraq War', 'OIL')} type="submit" className="btn btn-primary">Load Charts</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        );
    }
}

export default Graphs;