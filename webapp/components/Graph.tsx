import HighchartsReact from 'highcharts-react-official';
import { useEffect, useState } from 'react';
import { Distribution } from '../utils/model/MessageData.model';

export default function Graph(props: { Highcharts: object, distribution: Distribution }) {

    function getChartOptions(distribution: Distribution) {
        const sum = distribution.green + distribution.red + distribution.yellow;
        return {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            title: {
                text: ''
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            accessibility: {
                point: {
                    valueSuffix: '%'
                }
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                    }
                }
            },
            credits: {
                enabled: false
            },
            series: [{
                name: '',
                colorByPoint: true,
                data: [{
                    name: 'Slow speed',
                    y: getDistributionPercent(distribution.red, sum),
                    color: '#df5353'
                }, {
                    name: 'Median speed',
                    y: getDistributionPercent(distribution.yellow, sum),
                    color: '#dddf0d'
                }, {
                    name: 'Quick speed',
                    y: getDistributionPercent(distribution.green, sum),
                    color: '#55bf3b'
                }]
            }]
        };
    }

    function getDistributionPercent(value: number, sum: number) {
        return +((value * 100) / sum).toFixed(2);
    }

    const [chartOptions, setChartOptions] = useState(getChartOptions(props.distribution));

    useEffect(() => {
        setChartOptions(getChartOptions(props.distribution));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.distribution]);

    return (
        <>
            <div className='col-xl-5 col-lg-12 offset-xl-1 mt-lg-4 mt-0'>
                <HighchartsReact highcharts={props.Highcharts} allowChartUpdate={true} options={chartOptions} />
            </div>
        </>
    )
}
