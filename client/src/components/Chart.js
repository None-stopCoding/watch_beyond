import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip,
    ResponsiveContainer, Legend
} from 'recharts';
import { useEffect, useState } from 'react';
import { getCombinedTrends } from '../service';
import { translateAttributes, translateCategories, getStrokeByAttribute } from '../utils';
import {makeStyles, useTheme} from "@material-ui/core/styles";

const useStyles = makeStyles({
    root: {
        padding: 17
    },
    tooltip: {
        backgroundColor: theme => theme.palette.secondary.main,
        padding: '0 10px',
        paddingBottom: 10,
        border: '1px dashed #000'
    },
    tooltipLabel: {
        fontWeight: 'bold'
    }
});

const CustomTooltip = ({ active, payload, label, data }) => {
    const classes = useStyles(useTheme());
    if (active && payload && payload.length) {
        const attribute = data[label];
        return (
            <div className={classes.tooltip}>
                <p className={classes.tooltipLabel}>{label}</p>
                {
                    Object.keys(attribute).map((attr) => {
                        return (
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div style={{
                                    width: 17,
                                    height: 10,
                                    backgroundColor: getStrokeByAttribute(attr),
                                    marginRight: 5
                                }}/>
                                {`${translateAttributes(attr)} '${translateCategories(attribute[attr].category)}' - ${attribute[attr].value}`}
                            </div>
                        )
                    })
                }
            </div>
        );
    }

    return null;
};

function Chart({ from, to }) {
    const [graphData, updateGraph] = useState([{}]);
    const [tooltipData, setTooltipData] = useState({null: {}});

    useEffect(() => {
        getCombinedTrends(1, {
            dateFrom: '10.04.2021',
            dateTo: '12.06.2021',
            period: 'weeks'
        }).then((trends) => {
            const preparedTrends = {};
            trends.forEach((trend) => {
                preparedTrends[trend.name] = {...trend};
                delete preparedTrends[trend.name].name;
            });
            setTooltipData(preparedTrends);

            updateGraph(trends.map((trend) => {
                const clean = {};

                Object.keys(trend).forEach((attribute) => {
                    clean[attribute] = attribute === 'name' ? trend[attribute] : trend[attribute].value;
                });

                return clean;
            }));
        });
    }, []);

    return (
        <ResponsiveContainer width="100%" height={500}>
            <LineChart
                data={graphData}
                margin={{
                    top: 15,
                    bottom: 15
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip data={tooltipData}/>}/>
                <Legend
                    payload={
                        Object.keys(Object.values(tooltipData)[0]).map(
                            (attr, index) => ({
                                id: index,
                                color: getStrokeByAttribute(attr),
                                value: `${translateAttributes(attr)}`,
                            })
                        )
                    }
                />
                {
                    Object.keys(graphData[0]).map((attribute) => {
                        if (attribute !== 'name') {
                            return <Line type="monotone" dataKey={attribute} key={attribute} stroke={getStrokeByAttribute(attribute)} strokeWidth={1.5}/>
                        }
                    })
                }
            </LineChart>
        </ResponsiveContainer>
    );
}

export default Chart;