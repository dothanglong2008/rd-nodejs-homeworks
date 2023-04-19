import { FC } from 'react';
import './Chat.css';

const Chat: FC = () => {

    return (
        <div className="chat-box">
            <div className='messages-box'>Messages</div>
            <div className='text-box'>
                <input type='text' className='text-input' />
                <button>Send</button>
            </div>
        </div>
    );
}

export default Chat;
