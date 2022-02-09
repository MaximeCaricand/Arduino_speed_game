import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import highchartsMore from "highcharts/highcharts-more.js"
import solidGauge from "highcharts/modules/solid-gauge";
import { useEffect, useState } from 'react';

if (typeof Highcharts === 'object') {
    highchartsMore(Highcharts);
    solidGauge(Highcharts);
}

export default function Game() {

    const [chartOptions, setChartOptions] = useState({
        chart: {
            type: 'gauge',
            plotBorderWidth: 0,
            plotShadow: false,
        },
        title: { text: '' },
        pane: { startAngle: -150, endAngle: 150 },
        yAxis: {
            min: 0,
            max: 2000,
            minorTickInterval: 'auto',
            minorTickWidth: 1,
            minorTickLength: 10,
            minorTickPosition: 'inside',
            minorTickColor: '#666',
            tickPixelInterval: 30,
            tickWidth: 2,
            tickPosition: 'inside',
            tickLength: 10,
            tickColor: '#666',
            labels: {
                step: 2,
                rotation: 'auto'
            },
            title: { text: 'Milliseconds' },
            plotBands: [{
                from: 0,
                to: 120,
                color: '#55BF3B' // green
            }, {
                from: 120,
                to: 160,
                color: '#DDDF0D' // yellow
            }, {
                from: 160,
                to: 3000,
                color: '#DF5353' // red
            }]
        },
        series: [{
            name: 'Speed',
            data: [80],
            tooltip: {
                valueSuffix: 'Milliseconds'
            }
        }]
    });

    // updateSeries = () => {
    //     this.setState({
    //         chartOptions: {
    //             series: [
    //                 { data: [Math.random() * 5, 2, 1] }
    //             ]
    //         }
    //     });
    // }

    return (
        <>
            <HighchartsReact
                highcharts={Highcharts}
                options={chartOptions}
            />
        </>
    )
}
