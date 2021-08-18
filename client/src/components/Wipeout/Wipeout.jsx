import React from 'react'
import axios from 'axios'

const Wipeout = () => {
    const deleteAllBroadcasters = async () => {
        try {
            let deletedBroadcasters = await axios.delete('api/broadcasters/wipeout')
            console.log(deletedBroadcasters.data.message)
            return deletedBroadcasters
        } catch (err) {
            throw err
        }
    }

    return (
        <div>
            <button onClick={() => deleteAllBroadcasters()}>Clear Database</button>
        </div>
    )
}

export default Wipeout
