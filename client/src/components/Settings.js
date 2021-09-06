import { Box, Typography, Slider } from "@material-ui/core";
import { ToggleButtonGroup, ToggleButton } from '@material-ui/lab';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useState, useEffect } from 'react';

import {getBorderAnalysisDates, getTimeline} from '../service';

const useStyles = makeStyles({
    root: {
        // backgroundColor: theme => theme.palette.secondary.main,
        padding: 17
    }
});

function Settings({ content }) {
    const classes = useStyles(useTheme());
    const { period, slider, chips } = content;

    const [periodChosen, choosePeriod] = useState(period?.default);
    const [sliderDates, setSliderDates] = useState([]);
    const [sliderMarks, setSliderMarks] = useState([]);

    useEffect(() => {
        getBorderAnalysisDates(1).then((dates) => setSliderDates([dates.first, dates.last]));
    }, []);

    const periodChanged = (period) => {
        choosePeriod(period);

    }

    const generateTimeline = () => {
        getTimeline(1, {
            dateFrom: sliderDates[0],
            dateTo: sliderDates[1],
            period: periodChosen }
        ).then(setSliderMarks)
    }


    return (
        <Box className={classes.root} height='100%'>
            {
                period &&
                <Box paddingBottom={3}>
                    <Typography>Шаг анализа</Typography>
                    <ToggleButtonGroup
                        value={periodChosen}
                        exclusive
                        onChange={(e, period) => periodChanged(period)}
                        aria-label="text alignment"
                    >
                        {
                            Object.keys(period.items).map((key) =>
                                <ToggleButton value={key} aria-label="left aligned" key={key}>
                                    <Typography>{ period.items[key] }</Typography>
                                </ToggleButton>
                            )
                        }
                    </ToggleButtonGroup>
                </Box>
            }
            {
                slider &&
                <Box>
                    <Typography>Временной интервал</Typography>
                    <Slider
                        value={sliderDates}
                        onChange={(e, dates) => setSliderDates(dates)}
                        valueLabelDisplay="auto"
                        aria-labelledby="range-slider"
                    />
                </Box>
            }
        </Box>
    )
}

export default Settings;