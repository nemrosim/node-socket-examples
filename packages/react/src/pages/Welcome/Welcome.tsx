import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './welcome.css';

export const Welcome: React.FC = () => {
    const history = useHistory();
    const [roomId, setRoomId] = useState<string>('');

    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRoomId(event.target.value);
    };

    const handleOnClick = () => {
        history.push(roomId);
    };

    return (
        <div className="welcome">
            <input value={roomId} onChange={handleOnChange} />
            <button type="button" disabled={!roomId} onClick={handleOnClick}>
                {!roomId ? 'Enter room ID' : 'Use this room id'}
            </button>
        </div>
    );
};
