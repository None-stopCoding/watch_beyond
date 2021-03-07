import './App.css';
import { useEffect, useState } from 'react';
import Chart from 'react-google-charts';

function App() {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [gender, setGender] = useState(null);
    const [age, setAge] = useState(null);
    const [imageAmount, setAmount] = useState(0);

    const getData = () => {
        fetch("http://localhost:5000/")
            .then(res => res.json())
            .then(
                (result) => {
                    setIsLoaded(true);
                    const gender = {
                        'Woman': 0,
                        'Man': 0
                    };
                    const age = {
                        'kid': 0,
                        'adult': 0,
                        'grownUp': 0,
                        'old': 0
                    };
                    console.log(result);
                    setAmount(Object.keys(result).length);
                    Object.keys(result).forEach((img) => {
                        const res = result[img];
                        gender[res.gender]++;
                        age[0 <= res.age && res.age < 20 ? 'kid' :
                            20 <= res.age && res.age < 40 ? 'adult' :
                            40 <= res.age && res.age < 60 ? 'grownUp' :
                            60 <= res.age ? 'old' : 'None']++;
                    });

                    setGender(gender);
                    setAge(age);
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
    }

    useEffect(() => getData(), [getData])

    if (error) {
        return <div>Ошибка: {error.message}</div>;
    } else if (!isLoaded) {
        return <div>Загрузка...</div>;
    } else {
        return (
            <div className="App">
                <header className="App-header">
                    <div style={{ display: 'flex', maxWidth: 900, flexDirection: 'column', minHeight: 1200,
                                    justifyContent: "space-between"
                    }}>
                        <Chart
                            width={800}
                            height={500}
                            chartType="BarChart"
                            loader={<div>Loading Chart</div>}
                            data={[
                                ['Gender', 'Количество'],
                                ['Мужской', gender?.Man || 0],
                                ['Женский', gender?.Woman || 0]
                            ]}
                            options={{
                                title: `Кол-во человек каждого пола (всего: ${imageAmount})`,
                                vAxis: { title: 'Пол', titleTextStyle: { color: '#333' } }
                            }}
                        />
                        <Chart
                            width={800}
                            height={500}
                            chartType="BarChart"
                            loader={<div>Loading Chart</div>}
                            data={[
                                ['Age', 'Количество'],
                                ['0-20', age?.kid || 0],
                                ['20-40', age?.adult || 0],
                                ['40-60', age?.grownUp || 0],
                                ['60-80', age?.old || 0]
                            ]}
                            options={{
                                title: `Кол-во человек каждого возраста (всего: ${imageAmount})`,
                                vAxis: { title: 'Возраст', titleTextStyle: { color: '#333' } }
                            }}
                        />
                    </div>
                </header>
            </div>
        );
    }
}

export default App;
