export const userGrade = { 
    text: 'USER_GRADE' 
}
export const reduxUserGrade = (list) => { 
    return { 
        type: userGrade.text, 
        list 
    } 
}

export const oilCardType = {
    text: 'OIL_CARD_TYPE'
}
export const reduxOilCardType = (list) => {
    return {
        type: oilCardType.text,
        list
    }
}