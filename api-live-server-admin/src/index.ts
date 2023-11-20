import ivs from './service/IvsService'
import { LinkMetadata, LiveMetadataType } from './service/IvsServiceTypes'

process.env.IVS_RECORDING_CONFIG_ARN = 'arn:aws:ivs:us-east-1:449466460580:recording-configuration/Gpw3vP8WJ1Xu'

const putMetadata = async () => {
    const meta : LinkMetadata = {
        type: LiveMetadataType.LINK,
        url: 'https://google.com'
    }
    await ivs.putMetadata({
        arn: 'arn:aws:ivs:us-east-1:449466460580:channel/JwcudaCjLEyZ',
        metadata: meta
    })
}

const createAthorizationToken = async () => {
    const token = ivs.createAuthorizationToken({
        channelArn: 'arn:aws:ivs:us-east-1:449466460580:channel/JwcudaCjLEyZ',
        origin: '*',
        viewerId: 'paulo-medeiros-fazendo-testes.com'
    })

    console.log(token)
}

const run  = async () => {
    createAthorizationToken()
    /*
    const newChannel = await ivs.create({
        name: 'pporto-teste-aws-ivs-api',
        latencyMode: 'NORMAL',
        private: false,
        record: false,
        type: 'BASIC',
        //preset: 'CONSTRAINED_BANDWIDTH_DELIVERY'
    })
    console.log(newChannel)
    console.log(JSON.stringify(newChannel))
    /*
    const updateArn = newChannel.channel?.arn || ''

    console.log(await ivs.getChannels([updateArn, 'arn:aws:ivs:us-east-1:449466460580:channel/VzDmtvyuYe5f']))
    /*
    //OBS: Não é possível via SDK alterar o type de ADVANCED_XX para BASIC ou STANDARD
    const updateResponse = await ivs.update({
        arn: updateArn,
        name: 'pporto-teste-aws-ivs-api',
        latencyMode: 'LOW',
        private: false,
        record: false,
        type: 'BASIC',
        preset: 'HIGHER_BANDWIDTH_DELIVERY'
    })
    */

    //const deleteArn = updateArn //updateResponse.channel?.arn || ''
    //await ivs.delete(deleteArn)
}

run()