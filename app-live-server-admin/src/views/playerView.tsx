import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { NativeJsPlayer } from "../components/nativeJsVideo"
import { VideoPlayer } from '../components/videoPlayer'

export default function PlayerView () {

    const n = useNavigate()
    const [searchParams] = useSearchParams()

    useEffect(() => {
        const url = searchParams.get('url')
        if(!url) {
            n('/')
        }
    }, [])
 
    return (<div className="container-fluid">
        <div className="grid">
            <div className="col-6">
                <h3>Quiz Time!</h3>
                <div id="question"></div>
                <div className="card text-white bg-dark mb-3">
                    <div className="card-header">
                        Poll Question
                    </div>
                    <div className="card-body">
                        <p className="card-text" id="question-question"></p>
                        <div id="question-answers"></div>
                    </div>
                </div>
            </div>
            <div className="col-6">
                <h3>Live Video</h3>
                <VideoPlayer hlsSrc={searchParams.get('url') || ''} />
                <pre id="metadata"></pre>
            </div>
        </div>
    </div>)

}