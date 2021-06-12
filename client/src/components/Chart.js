import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip,
    ResponsiveContainer, Legend
} from 'recharts';
import { useEffect, useState } from 'react';
import { getAttributesTrends } from '../service';

function Chart({ from, to }) {
    const [graphData, updateGraph] = useState([
        {
            name: '23/05/21',
            first: 15,
            second: 70,
        }, {
            name: '30/05/21',
            first: 40,
            second: 35,
        }, {
            name: '05/06/21',
            first: 10,
            second: 25,
        }, {
            name: '12/06/21',
            first: 20,
            second: 30,
        }
    ]);

    // useEffect(async () => {
    //     const trends = await getAttributesTrends();
    //     updateGraph(trends);
    // }, [from, to]);

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
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="first" stroke="#8884d8" />
                <Line type="monotone" dataKey="second" stroke="#82ca9d" />
            </LineChart>
        </ResponsiveContainer>
    );
}

export default Chart;