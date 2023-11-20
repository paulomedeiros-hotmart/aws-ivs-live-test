import { ChannelLatencyMode, ChannelType, TranscodePreset } from '@aws-sdk/client-ivs'

export interface CreateChannelRequest {
    // nome do canal. May include numbers, letters, underscores (_) and hyphens (-).
    name: string 
    // se é uma live privada (Exige authenticação da audiencia)
    private: boolean
    // LOW ou NORMAL
    latencyMode: ChannelLatencyMode
    //determina a resolução e o bitrate. 
    //opts: BASIC STANDARD ADVANCED_SD ADVANCED_HD
    type: ChannelType
    //(Opcional) opção de transcode do canal. 
    //deve ser preenchido somente quando o type for = ADVANCED_SD || ADVANCED_HD. 
    //Opts: HIGHER_BANDWIDTH_DELIVERY (default), CONSTRAINED_BANDWIDTH_DELIVERY
    preset?: TranscodePreset
    //liga ou desliga o record da live
    record: boolean
}

export interface UpdateChannelRequest extends CreateChannelRequest {
    //pattern ^arn:aws:[is]vs:[a-z0-9-]+:[0-9]+:channel/[a-zA-Z0-9-]+$
    arn: string
}

export enum LiveMetadataType {
    LINK = 'LINK',
    QUIZ = 'QUIZ'
}

interface LiveMetadata {
    type: LiveMetadataType
}

export interface QuizAnswer {
    label: string
    value: string
}

export interface LinkMetadata extends LiveMetadata {
    url: string
}

export interface QuizMetadata extends LiveMetadata {
    question: string
    answers: Array<QuizAnswer>
}

export interface PutMetadataRequest {
    // patern: ^arn:aws:[is]vs:[a-z0-9-]+:[0-9]+:channel/[a-zA-Z0-9-]+$
    arn: string,
    metadata: LiveMetadata
}

export interface CreateAuthorizationTokenRequest {
    channelArn: string
    origin: string
    viewerId: string
}