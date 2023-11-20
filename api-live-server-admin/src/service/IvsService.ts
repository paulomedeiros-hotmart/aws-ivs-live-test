
import fs from 'fs'
import { Ivs, CreateChannelCommandInput, ChannelType, CreateChannelCommandOutput, UpdateChannelCommandInput, UpdateChannelCommandOutput } from '@aws-sdk/client-ivs'
import jwt from 'jsonwebtoken'
import { CreateAuthorizationTokenRequest, CreateChannelRequest, PutMetadataRequest, UpdateChannelRequest } from './IvsServiceTypes'

const authorizationTokenPrivateKey = fs.readFileSync("./src/private-key.pem", { encoding: "utf8" })
const ivs = new Ivs({
    region: 'us-east-1'
})


/**
 * Retorna o ARN com as configurações de gravação da live. (Provavelmente as configurações serão criadas via TF)
 * DOC TF: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ivs_recording_configuration
 * DOC AWS API: https://docs.aws.amazon.com/ivs/latest/LowLatencyAPIReference/API_CreateRecordingConfiguration.html
 * Caso n seja informado a variável de ambiente, retorna vazio (o que desabilida a gravação no S3).
 * @returns string
 */
function getRecordingConfiguration () {
    return process.env.IVS_RECORDING_CONFIG_ARN || ''
}

/**
 * MIN 0 items,
 * MAX 50 items.
 */
const defaultTags = {

}

/**
 * Ver https://youtu.be/GEUyNIPi5TU?si=Nrq7LD9xDcjTLE6R
 */
class IvsService {

    async getChannel(arn: string) {
        const response = await this.getChannels([arn])
        return response && response.length > 0 ? response[0] : undefined
    }

    /**
     * Retorna as configurações dos canais especificados (obs: nao retorna o streaming key. Necessário consultar outra api. 
     * É recomendado salvar o ARN do stream key para consulta ou delecao)
     * DOC: https://docs.aws.amazon.com/ivs/latest/LowLatencyAPIReference/API_BatchGetChannel.html
     * @param arns lista com os arns dos canais que deseja pesquisar
     */
    async getChannels(arns: Array<string>) {
        const batch = await ivs.batchGetChannel({
            arns
        })
        const avaiableChannels = batch.channels?.filter((channel) => channel.arn)
        console.log(JSON.stringify(avaiableChannels))
        return avaiableChannels
    }

    /**
     * Cria um novo canal para tranmissao ao vivo.
     * DOC: https://docs.aws.amazon.com/ivs/latest/LowLatencyAPIReference/API_CreateChannel.html
     * @param request CreateChannelRequest
     */
    async create(request : CreateChannelRequest) : Promise<CreateChannelCommandOutput> {
        if(request.preset) {
            if(request.type !== ChannelType.AdvancedSDChannelType && request.type !== ChannelType.AdvancedHDChannelType) {
                throw Error(`Invalid channel configuration! preset option is avaiable only for: ${ChannelType.AdvancedHDChannelType} and ${ChannelType.AdvancedSDChannelType}`)
            }
        }

        const args : CreateChannelCommandInput = {
            insecureIngest: false,
            authorized: request.private,
            name: request.name,
            latencyMode: request.latencyMode,
            recordingConfigurationArn: request.record ? getRecordingConfiguration() : '',
            type: request.type,
            preset: request.preset,
            tags: defaultTags
        }

        return await ivs.createChannel(args)
    }

    /**
     * DOC: https://docs.aws.amazon.com/ivs/latest/LowLatencyAPIReference/API_UpdateChannel.html
     * @param request UpdateChannelRequest
     * @returns UpdateChannelCommandOutput
     */
    async update(request : UpdateChannelRequest) : Promise<UpdateChannelCommandOutput> {
        const args : UpdateChannelCommandInput = {
            arn: request.arn,
            authorized: request.private,
            insecureIngest: false,
            name: request.name,
            latencyMode: request.latencyMode,
            recordingConfigurationArn: request.record ? getRecordingConfiguration() : '',
            type: request.type,
            preset: request.preset,
            
        }

        return await ivs.updateChannel(args)
    }

    /**
     * O criar um novo canal, no mesmo processo uma streaming key já é gerada automaticamente.
     * A ideia deste processo é se existir a necessidade de recriar streaming key para o produtor de conteúdo. (Falha de segurança por exemplo.)
     * DOC: https://docs.aws.amazon.com/ivs/latest/LowLatencyAPIReference/API_CreateStreamKey.html,
     *      https://docs.aws.amazon.com/ivs/latest/LowLatencyAPIReference/API_DeleteStreamKey.html
     * @param arn patern ^arn:aws:[is]vs:[a-z0-9-]+:[0-9]+:stream-key/[a-zA-Z0-9-]+$. (ARN da stream key , não da live!)
     */
    renewStreamKey(arn : string) {
        //ivs.deleteStreamKey()
        //ivs.createStreamKey()
    }

    /**
     * DOC: https://docs.aws.amazon.com/ivs/latest/LowLatencyAPIReference/API_DeleteChannel.html
     * @param arn pattern ^arn:aws:[is]vs:[a-z0-9-]+:[0-9]+:channel/[a-zA-Z0-9-]+$
     */
    async delete(arn: string) {
        await ivs.deleteChannel({
            arn
        })
    }
    /**
     * DOC: https://docs.aws.amazon.com/ivs/latest/LowLatencyAPIReference/API_PutMetadata.html
     */
    async putMetadata(request: PutMetadataRequest) {
        await ivs.putMetadata({
            channelArn: request.arn,
            metadata: JSON.stringify(request.metadata)
        })
    }
    /**
     * DOC: https://docs.aws.amazon.com/ivs/latest/LowLatencyUserGuide/private-channels-generate-tokens.html
     * EX: https://3efa4f186030.us-east-1.playback.live-video.net/api/video/v1/us-east-1.449466460580.channel.JwcudaCjLEyZ.m3u8?token=<JWTOKEN>
     * @param request 
     * @returns jwt
     */
    createAuthorizationToken(request: CreateAuthorizationTokenRequest) {
        const payload = {
            "aws:channel-arn": request.channelArn,
            "aws:access-control-allow-origin": request.origin,
            //"aws:strict-origin-enforcement": true,
            //"aws:single-use-uuid": "<UUID>",
            //"aws:viewer-id": request.viewerId,
            //"aws:viewer-session-version": "<viewer_session_version>",
            "exp": Date.now() + (60 * 1000 * 10), // expires in 10 minute
        }
        return jwt.sign(payload, authorizationTokenPrivateKey, { algorithm: 'ES384' })
    }
}

const instance = new IvsService()
export default instance