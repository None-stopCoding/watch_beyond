import { createMuiTheme } from '@material-ui/core/styles';


export const getTheme = () => createMuiTheme({
    palette: {
        primary: {
            light: '#7b7379',
            main: '#4f484d',
            dark: '#272125',
            contrastText: '#f1e7ca'
        },
        secondary: {
            light: '#ffffe2',
            main: '#e8ccb0',
            dark: '#b59b81',
            contrastText: '#4c493d'
        }
    }
})

export const translateAttributes = (attributeName) => {
    const dict = {
        age: 'Возраст',
        gender: 'Пол',
        emotion: 'Эмоция'
    }

    return dict[attributeName] || attributeName;
}

export const translateCategories = (categoryName) => {
    const dict = {
        Man: 'Мужчина',
        Woman: 'Женщина',

        happy: 'Счастье',
        neutral: 'Нейтральное',
        angry: 'Злость',
        fear: 'Страх',
        sad: 'Грусть',
        surprise: 'Удивление',
    }

    return dict[categoryName] || categoryName;
}

export const getStrokeByAttribute = (attribute) => {
    const dict = {
        age: '#8884d8',
        gender: '#2ca02c',
        emotion: '#ff7f0e',
        race: '#1f77b4'
    }

    return dict[attribute] || '#8884d8';
}

export const getStrokeByCategory = (category, add) => {
    const dict = {
        Man: '#8884d8',
        Woman: '#2ca02c',

        '30-40': '#F8AFA6',
        '40-50': '#1f77b4',
        '50-60': '#E1C340',
        '60-70': '#5885AF',

        angry: '#FFA384',
        fear: '#67595E',
        happy: '#FFAEBC',
        neutral: '#74BDCB',
        sad: '#81B622',
        surprise: '#868B8E'
    }
    if (add) {
        debugger;
    }

    return dict[category] || '#8884d8';
}

// const availableActions = [
//     {
//         name: 'remove',
//         description: 'Не анализировать',
//         position: {
//             top: 30,
//             left: 40
//         },
//         icon: <Delete color='primary'/>,
//         enabled: (attribute) => attribute.isUsed
//     }
// ];

//
// const getActions = (attribute) => {
//     if (!attribute.showActions) {
//         return [];
//     }
//
//     return availableActions.filter((action) => {
//         switch (action.name) {
//             case 'remove':
//                 return attribute.isUsed
//             default:
//                 return true
//         }
//     });
// }

// actionsShown &&
// getActions(attribute).map((action) => {
//     return (
//         <Box border={1}
//              borderRadius='50%'
//              borderColor='primary.main'
//              width={27}
//              height={27}
//              display='flex'
//              justifyContent='center'
//              alignItems='center'
//              className={classes.attributeActions}
//         >
//             {action.icon}
//         </Box>
//     )
// })