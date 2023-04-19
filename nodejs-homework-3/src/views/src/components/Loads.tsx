import { FC, FormEvent, useCallback, useState } from "react";

const Loads: FC = () => {
    const [formInput, setFormInput] = useState({
        email: '',
        password: '',
        role: ''
    });
    const handleInput = useCallback((event: FormEvent<HTMLInputElement>) => {
        event.preventDefault();
        const name = event.currentTarget.name;
        setFormInput({
            ...formInput,
            [name]: event.currentTarget.value,
        })
    }, [formInput])
    const handleSelect = useCallback((event: FormEvent<HTMLSelectElement>) => {
        event.preventDefault();
        setFormInput({
            ...formInput,
            role: event.currentTarget.value,
        })
    }, [formInput])
    const handleClick = useCallback(async (event) => {
        event.preventDefault();
        console.log(formInput)
        const data = formInput;
        fetch('http://localhost:8080/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(data => console.log(data))
        console.log('re-render')
    }, [formInput])
    return <main>
        <form>
            <h1>Loads</h1>
            <div>
                <input name='email'
                    type='email' placeholder='Email'
                    onChange={handleInput} />
            </div>
            <div>
                <input name='password' type='password' placeholder='Password'
                    onChange={handleInput} />
            </div>
            <div>
                <select name='role' onChange={handleSelect}>
                    <option value=''>Select Role</option>
                    <option value='shipper'>Shipper</option>
                    <option value='driver'>Driver</option>
                </select>
            </div>

            <div>
                <button onClick={handleClick}>Loads</button>
            </div>

        </form>
        <h2>{formInput.email} : {formInput.password} : {formInput.role}</h2>
    </main>
}

export default Loads;