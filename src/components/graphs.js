import React, { Component } from 'react';
import '../css/graphs.css';
import Chart from 'chart.js';

const devHost = 'http://localhost:9000/';

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
    }

    handleStockChange(e){
        this.setState({stock: e.target.value});
    }

    handleTrendChange(e){
        this.setState({trend: e.target.value});
    }

    fetchStockData(ticker){
        console.log('Fetching new stock data...');
    }

    removeChart(chart){
        chart.destroy();
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
                                beginAtZero:true
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
                                beginAtZero:true
                            }
                        }]
                    }
                }
            })
        });
    }

    fetchTrendData(e, trend){
        e.preventDefault();
        if(trend.length > 0){
            this.setState({trendData: {}})
            console.log('Fetching new trend data...');
            let data = JSON.stringify({query: trend});
            fetch("/trend", {
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

    componentDidMount(){        
        this.createTrendChart([], []);
        this.createStockChart([], []);
    }

    render() {
        return (
        <div className="Graphs">
            <div className='row m-0'>
                <div className='col-lg-6 col-md-12 col-sm-12 col-xs-12'>
                    <canvas id="trendChart"></canvas>
                    <form className='pt-3'>
                        <div className="form-group">
                            <input onChange={this.handleTrendChange} type="text" className="form-control" placeholder="Enter Search Term or Topic"/>
                            <small className="form-text text-muted">This uses the Google Trends API</small>
                        </div>
                    <button onClick={(e) => this.fetchTrendData(e, this.state.trend)} type="submit" className="btn btn-primary">Load Chart</button>
                    </form>
                </div>
                <div className='col-lg-6 col-md-12 col-sm-12 col-xs-12'>
                    <canvas id="stockChart"></canvas>
                    <form className='pt-3'>
                        <div className="form-group">
                            <input onChange={this.handleStockChange} type="text" className="form-control" placeholder="Enter a Stock Ticker"/>
                            <small className="form-text text-muted">This uses Stock Market API</small>
                        </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
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
                            <a className="btn btn-primary">Load Charts</a>
                        </div>
                    </div>
                </div>

                <div className='col-lg-4'>
                    <div className="card" style={{width: '18rem'}}>
                        <div className="card-body">
                            <h5 className="card-title">Facebook</h5>
                            <p className="card-text">During the recent Mark Zuckerberg congress meetings...</p>
                            <p>Facebook stock plummeted as faith was lost in the company's business practices</p>
                            <a className="btn btn-primary">Load Charts</a>
                        </div>
                    </div>
                </div>
            
                <div className='col-lg-4'>
                    <div className="card" style={{width: '18rem'}}>
                        <div className="card-body">
                            <h5 className="card-title">Iraq War</h5>
                            <p className="card-text">Check out the changes in Oil price as president bush was ramping up the Iraq invasion.</p>
                            <p>Some say the middle east wars are about oil, checkout the stocks...</p>
                            <a className="btn btn-primary">Load Charts</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        );
    }
}

export default Graphs;