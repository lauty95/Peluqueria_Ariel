import axios from 'axios'

export function postClient(data){
    return function (dispatch) {
        axios.post('/newClient', data)
        .then(r => {
            dispatch(getPost())
            console.log(r)
        })
        .catch(r => console.log(r))
    }
}

function getPost(){
    return {
        type: 'GET_POST'
    }
}