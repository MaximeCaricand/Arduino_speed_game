/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import HighchartsReact from 'highcharts-react-official';
import { useEffect, useState } from 'react';
import ledLow from '../public/led_low.png';
import ledHigh from '../public/led_high.png';
import styles from './Game.module.css'

const gaugeAvgOffset = 100;
const gaugeMax = 2400;

export default function Game(props: { Highcharts: object, curLed: number, curTime: number, avgTime: number }) {

    function getChartOptions(curTime: number, avgTime: number) {
        const offset = curTime === 0 ? 0 : gaugeAvgOffset;
        if (curTime > gaugeMax) {
            curTime = gaugeMax;
        }
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
                max: gaugeMax,
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
                dataLabel: {
                    enable: false,
                },
                title: { text: 'Milliseconds' },
                plotBands: [{
                    from: 0,
                    to: avgTime - offset,
                    color: '#55BF3B' // green
                }, {
                    from: avgTime - offset,
                    to: avgTime + offset,
                    color: '#DDDF0D' // yellow
                }, {
                    from: avgTime + offset,
                    to: 3000,
                    color: '#DF5353' // red
                }]
            },
            credits: {
                enabled: false
            },
            series: [{
                name: 'Speed',
                data: [curTime],
                tooltip: {
                    enabled: false
                },
                dataLabels: {
                    enabled: false,
                }
            }]
        }
    }

    const [chartOptions, setChartOptions] = useState(getChartOptions(props.curTime, props.avgTime));

    useEffect(() => {
        setChartOptions(getChartOptions(props.curTime, props.avgTime));
    }, [props.curTime, props.avgTime]);

    const leds = [0, 1, 2].map(index => {
        const img: StaticImageData = index === props.curLed ? ledHigh : ledLow;
        return (
            <div key={index} className={`col-lg-2 col-md-4 col-sm-12 ${index === 0 ? ' offset-lg-3' : ''} text-center ${styles.ledImg}`}>
                <img src={img.src} width={125} height='auto' />
            </div >
        )
    });

    return (
        <>
            {leds}
            <div className='col-md-12 text-center mt-5'>
                <h2 className='h4'>{`Last reaction time : ${props.curTime} ms`}</h2>
            </div>
            <div className='col-xl-5 col-lg-12 mt-lg-4 mt-0'>
                <HighchartsReact highcharts={props.Highcharts} allowChartUpdate={true} options={chartOptions} />
            </div>

        </>
    )
}
