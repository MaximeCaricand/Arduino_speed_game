import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import highchartsMore from "highcharts/highcharts-more.js"
import solidGauge from "highcharts/modules/solid-gauge";
import { useEffect, useState } from 'react';

if (typeof Highcharts === 'object') {
    highchartsMore(Highcharts);
    solidGauge(Highcharts);
}

const gaugeAvgOffset = 300;

export default function Game(props: { curTime: number, avgTime: number }) {

    function getChartOptions(curTime: number, avgTime: number) {
        return {
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
                    to: avgTime - gaugeAvgOffset,
                    color: '#55BF3B' // green
                }, {
                    from: avgTime - gaugeAvgOffset,
                    to: avgTime + gaugeAvgOffset,
                    color: '#DDDF0D' // yellow
                }, {
                    from: avgTime + gaugeAvgOffset,
                    to: 3000,
                    color: '#DF5353' // red
                }]
            },
            series: [{
                name: 'Speed',
                data: [curTime],
                tooltip: {
                    valueSuffix: 'Milliseconds'
                }
            }]
        }
    }

    const [chartOptions, setChartOptions] = useState(getChartOptions(props.curTime, props.avgTime));

    useEffect(() => {
        setChartOptions(getChartOptions(props.curTime, props.avgTime));
        // console.log(chartOptions);
    }, [props.curTime, props.avgTime])



    return (
        <>
            <HighchartsReact
                highcharts={Highcharts}
                allowChartUpdate={true}
                options={chartOptions}
            />
        </>
    )
}
