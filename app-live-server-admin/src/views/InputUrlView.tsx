
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface InputUrlState {
    url: string
}

export default function InputUrlView () {

    const n = useNavigate()

    const [state, setState] = useState<InputUrlState>({ url: '' })

    const onClickWatch = () => {
        n(`/play?url=${encodeURI(state.url)}`)
    }

    return <div  className='w-full'  style={{maxWidth: '600px'}} >
        <div className="flex flex-column gap-2 w-full" >
            <label htmlFor="inputUrl">Informe a url da transmissão</label>
            <InputText id='inputUrl' value={state.url} onChange={(e) => setState({ ...state, url: e.target.value})} />
        </div>
        <div className='w-full' >
            <Button label='Assistir' onClick={onClickWatch} />
        </div>
    </div>
}