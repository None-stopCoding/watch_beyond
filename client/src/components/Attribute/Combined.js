import {Box, Divider, Grid, Paper} from '@material-ui/core';
import {
    ResponsiveContainer, LineChart, CartesianGrid, PieChart, Pie,
    XAxis, YAxis, Tooltip, Line, Brush, AreaChart, Area, Sector, Cell,
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend
} from 'recharts';
import {useEffect, useState} from "react";
import {getCurrentAttributes, getProfileAttributesTrends} from "../../service";
import {getStrokeByCategory, translateAttributes, translateCategories} from "../../utils";

const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
        <g>
            <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
                {translateCategories(payload.name)}
            </text>
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
            />
            <Sector
                cx={cx}
                cy={cy}
                startAngle={startAngle}
                endAngle={endAngle}
                innerRadius={outerRadius + 6}
                outerRadius={outerRadius + 10}
                fill={fill}
            />
            <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
            <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`Люди ${value}`}</text>
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
                {`(Rate ${(percent * 100).toFixed(2)}%)`}
            </text>
        </g>
    );
};

function Combined() {
    const [attributesData, seAttributesData] = useState({});
    const [currentAttributesData, setCurrentAttributesData] = useState([{}]);
    const [currentAttributePies, setCurrentAttributePie] = useState({});

    useEffect(() => {
        getProfileAttributesTrends(1, {
            dateFrom: '10.04.2021',
            dateTo: '12.06.2021',
            period: 'weeks'
        }).then(seAttributesData);
        getCurrentAttributes(1).then((data) => {
            setCurrentAttributesData(data);

            const pies = {}
            Object.keys(data).forEach((pie) => pies[pie] = { activeIndex: 0 });
            setCurrentAttributePie(pies);
        });
    }, []);

    const onCurrentAttributePieEnter = (attr, index) => {
        const data = {...currentAttributePies};
        data[attr].activeIndex = index;

        setCurrentAttributePie(data);
    };

    return (
        <>
        <Grid container spacing={3} style={{ textAlign: 'center' }}>
            <Grid item xs={9}>
                <h4>Анализ изменения значений категорий каждого признака</h4>
            </Grid>
            <Grid item xs={3}>
                <h4>{`Показатели категории каждого признака на 12.06.2021`}</h4>
            </Grid>
        </Grid>
        <Divider variant="middle"/>
        <Grid container spacing={3}>
            {
                Object.keys(attributesData).map((attr) => {
                    return (
                        <Grid item xs={12} container sapcing={3}>
                            <Grid item xs={9}>
                                <h4>{`Анализ признака '${translateAttributes(attr)}'`}</h4>

                                <ResponsiveContainer width="100%" height={200}>
                                    <LineChart
                                        width={500}
                                        height={200}
                                        data={attributesData[attr]}
                                        syncId="attributesCombined"
                                        margin={{
                                            top: 10,
                                            right: 30,
                                            left: 0,
                                            bottom: 0,
                                        }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        {
                                            Object.keys(attributesData[attr][0]).map((category) => {
                                                if (category !== 'name') {
                                                    return <Line type="monotone"
                                                                 dataKey={category}
                                                                 key={category}
                                                                 stroke={getStrokeByCategory(category)}
                                                                 strokeWidth={1.5}
                                                                 name={translateCategories(category)}
                                                    />
                                                }
                                            })
                                        }
                                    </LineChart>
                                </ResponsiveContainer>
                            </Grid>
                            <Grid item xs={3}>
                                <ResponsiveContainer width="100%" height="100%">
                                    {
                                        (currentAttributesData[attr] || []).length > 3 ?
                                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={currentAttributesData[attr]}>
                                                <PolarGrid />
                                                <PolarAngleAxis dataKey="name" />
                                                <PolarRadiusAxis angle={
                                                    90 - (360 / currentAttributesData[attr].length) < 0 ? 90 :
                                                        90 - (360 / currentAttributesData[attr].length)
                                                } domain={[0, Math.max(currentAttributesData[attr].map((category) => category.value))]}/>
                                                <Radar name="Mike" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                                            </RadarChart>
                                        :
                                            <PieChart width={400} height={400}>
                                            {
                                                Object.keys(currentAttributesData[attr] || []).map((category) =>
                                                    <Pie data={currentAttributesData[attr]}
                                                         activeIndex={currentAttributePies[attr]?.activeIndex}
                                                         activeShape={renderActiveShape}
                                                         dataKey="value"
                                                         key={currentAttributesData[attr][category].name}
                                                         cx="50%" cy="50%"
                                                         innerRadius={60}
                                                         outerRadius={80}
                                                         paddingAngle={2}
                                                         onMouseEnter={(e, index) => onCurrentAttributePieEnter(attr, index)}
                                                    >
                                                        {
                                                            Object.keys(currentAttributesData[attr] || []).map((entry, index) =>
                                                                <Cell key={`cell-${index}`}
                                                                      fill={getStrokeByCategory(currentAttributesData[attr][entry].name)}/>
                                                            )
                                                        }
                                                    </Pie>
                                                )
                                            }
                                            </PieChart>
                                    }
                                </ResponsiveContainer>
                            </Grid>
                        </Grid>
                    )
                })
            }
        </Grid>
        </>
    )
}

export default Combined;