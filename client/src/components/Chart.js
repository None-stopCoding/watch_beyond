import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip,
    ResponsiveContainer, Legend
} from 'recharts';
import { useEffect, useState } from 'react';
import { getAttributesTrends } from '../service';
import { translateAttributes } from '../utils';

const CustomTooltip = ({ active, payload, label, trends }) => {
    if (active && payload && payload.length) {
        return (
            <div className="custom-tooltip">
                <p className="label">{label}</p>
                {
                    payload[0].dataKey
                }
            </div>
        );
    }

    return null;
};

function Chart({ from, to }) {
    const [graphData, updateGraph] = useState([{}]);
    let preparedTrends = {};

    useEffect(async () => {
        await updateTrends();
    }, []);

    const updateTrends = async () => {
        const trends = await getAttributesTrends(1, {
            dateFrom: '10.04.2021',
            dateTo: '12.06.2021',
            period: 'weeks'
        })
        trends.forEach((trend) => {
            const name = trend.name;
            delete trend.name;

            preparedTrends[name] = trend;
        });

        const res = trends.map((trend) => {
            const clean = {};

            Object.keys(trend).forEach((attribute) => {
                clean[attribute] = attribute === 'name' ? trend[attribute] : trend[attribute].value;
            });

            return clean
        });
        updateGraph(res);
    }

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
                <Tooltip content={<CustomTooltip trends={preparedTrends}/>}/>
                <Legend />
                {
                    Object.keys(graphData[0]).map((attribute) => {
                        if (attribute !== 'name') {
                            return <Line type="monotone" dataKey={attribute} key={attribute} stroke="#8884d8" />
                        }
                    })
                }
            </LineChart>
        </ResponsiveContainer>
    );
}

export default Chart;