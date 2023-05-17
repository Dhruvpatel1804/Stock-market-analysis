import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Grid, MenuItem, TextField, Typography } from '@mui/material';

// third-party
import Chart from 'react-apexcharts';

// project imports
import SkeletonTotalGrowthBarChart from 'ui-component/cards/Skeleton/TotalGrowthBarChart';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

// chart data
import axios from 'axios';
import { useDispatch } from 'react-redux';
const status = [
    {
        value: 'today',
        label: 'Today'
    },
    {
        value: 'month',
        label: 'This Month'
    },
    {
        value: 'year',
        label: 'This Year'
    }
];

// ==============================|| DASHBOARD DEFAULT - TOTAL GROWTH BAR CHART ||============================== //

const TotalGrowthBarChart = ({ isLoading }) => {
    const [value, setValue] = useState('today');
    const theme = useTheme();
    const customization = useSelector((state) => state.customization);
    const [mychartData, setChartData] = useState({
        type: 'candlestick',
        series: [],
        options: {
            chart: {
                type: 'candlestick',
                height: 400,
                background: '#040720'
            },
            zoom: {
                autoScaleYaxis: true
            },
            title: {
                text: 'Nifty 50',
                align: 'left',
                offsetY: 10,
                offsetX: 20,
                style: {
                    color: '#fff'
                }
            },
            grid: {
                show: false,
                xaxis: {
                    type: 'datetime',
                    tooltip: {
                        enabled: false
                    },
                    labels: {
                        show: true,
                        formatter: (value) => {
                            return value;
                        }
                    }
                },
                yaxis: {
                    // min: 6485,
                    tooltip: {
                        enabled: true
                    }
                }
            }
        }
    });
    const { navType } = customization;
    const { primary } = theme.palette.text;
    const darkLight = theme.palette.dark.light;
    const grey200 = theme.palette.grey[200];
    const grey500 = theme.palette.grey[500];

    const primary200 = theme.palette.primary[200];
    const primaryDark = theme.palette.primary.dark;
    const secondaryMain = theme.palette.secondary.main;
    const secondaryLight = theme.palette.secondary.light;
    const dispach = useDispatch();
    const UpdateData = () => {
        const currentTimeInSeconds = Math.floor(Date.now() / 1000);
        const previousTimeInSeconds = currentTimeInSeconds - 21600000;
        // Outputs the current time in seconds since the Unix epoch
        const baseURL = `https://priceapi.moneycontrol.com/techCharts/indianMarket/stock/history?symbol=in%3BNSX&resolution=1&from=${previousTimeInSeconds}&to=${currentTimeInSeconds}&countback=200&currencyCode=INR`;
        axios
            .get(baseURL, {
                headers: {
                    accept: '*/*',
                    'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
                    'sec-ch-ua': '"Chromium";v="112", "Google Chrome";v="112", "Not:A-Brand";v="99"',
                    'sec-ch-ua-mobile': '?0',
                    'sec-ch-ua-platform': '"Linux"',
                    'sec-fetch-dest': 'empty',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-site': 'same-site',
                    Referer: 'https://www.moneycontrol.com/',
                    'Referrer-Policy': 'strict-origin-when-cross-origin'
                }
            })
            .then((response) => {
                const nifty50 = response.data['c'][response.data['c'].length - 1];
                const nifty50high = response.data['h'][response.data['h'].length - 1];
                const nifty50low = response.data['l'][response.data['l'].length - 1];
                const candleData = response.data;
                const data = candleData.t.map((time, index) => {
                    return [time, candleData.o[index], candleData.h[index], candleData.l[index], candleData.c[index]];
                });
                dispach({ type: 'nifty50', payload: nifty50 });
                dispach({ type: 'nifty50high', payload: nifty50high });
                dispach({ type: 'nifty50low', payload: nifty50low });
                setChartData((prevState) => ({ ...prevState, ['series']: [{ data }] }));
            });
    };
    UpdateData();
    useEffect(() => {
        setInterval(() => {
            UpdateData();
        }, 10000);
    }, [navType, primary200, primaryDark, secondaryMain, secondaryLight, primary, darkLight, grey200, isLoading, grey500]);
    return (
        <>
            {isLoading ? (
                <SkeletonTotalGrowthBarChart />
            ) : (
                <MainCard>
                    <Grid container spacing={gridSpacing}>
                        <Grid item xs={12}>
                            <Grid container alignItems="center" justifyContent="space-between">
                                <Grid item>
                                    <Grid container direction="column" spacing={1}>
                                        <Grid item>
                                            <Typography variant="subtitle2">Total Growth</Typography>
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="h3">{customization.nifty50}</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item>
                                    <TextField
                                        id="standard-select-currency"
                                        select
                                        value={value}
                                        onChange={(e) => setValue(e.target.value)}
                                    >
                                        {status.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Chart {...mychartData} />
                        </Grid>
                    </Grid>
                </MainCard>
            )}
        </>
    );
};

TotalGrowthBarChart.propTypes = {
    isLoading: PropTypes.bool
};

export default TotalGrowthBarChart;

// fetch("https://priceapi.moneycontrol.com//techCharts/indianMarket/index/history?symbol=in%3BNSX&resolution=1D&from=1644537600&to=1683244800&countback=320&currencyCode=INR", {
//   "headers": {
//     "accept": "*/*",
//     "accept-language": "en-US,en;q=0.9",
//     "sec-ch-ua": "\"Chromium\";v=\"112\", \"Google Chrome\";v=\"112\", \"Not:A-Brand\";v=\"99\"",
//     "sec-ch-ua-mobile": "?0",
//     "sec-ch-ua-platform": "\"Windows\"",
//     "sec-fetch-dest": "empty",
//     "sec-fetch-mode": "cors",
//     "sec-fetch-site": "same-site",
//     "Referer": "https://www.moneycontrol.com/",
//     "Referrer-Policy": "strict-origin-when-cross-origin"
//   },
//   "body": null,
//   "method": "GET"
// });
