import {GetObjectCommand, PutObjectCommand, S3Client} from '@aws-sdk/client-s3';
import md5 from 'md5';
import {
	SpeechConfig,
	SpeechSynthesisResult,
	SpeechSynthesizer,
} from 'microsoft-cognitiveservices-speech-sdk';

const voices = {
	ptBRWoman: 'pt-BR-FranciscaNeural',
	ptBRMan: 'pt-BR-AntonioNeural',
	enUSWoman1: 'en-US-JennyNeural',
	enUSWoman2: 'en-US-AriaNeural',
} as const;

export const textToSpeech = async (
	text: string,
	voice: keyof typeof voices
): Promise<string> => {
	const speechConfig = SpeechConfig.fromSubscription(
		'd956e438355546d3acccd6882f0a9949' || '',
		'eastus2' || ''
	);

	if (!voices[voice]) {
		throw new Error('Voice not found');
	}

	const fileName = `${md5(text)}.mp3`;

	const fileExists = await checkIfAudioHasAlreadyBeenSynthesized(fileName);

	if (fileExists) {
		return createS3Url(fileName);
	}

	const synthesizer = new SpeechSynthesizer(speechConfig);

	const ssml = `
                <speak version="1.0" xml:lang="en-US">
                    <voice name="${voices[voice]}">
                        <break time="100ms" /> ${text}
                    </voice>
                </speak>`;

	const result = await new Promise<SpeechSynthesisResult>(
		(resolve, reject) => {
			synthesizer.speakSsmlAsync(
				ssml,
				(res) => {
					resolve(res);
				},
				(error) => {
					reject(error);
					synthesizer.close();
				}
			);
		}
	);
	const {audioData} = result;

	synthesizer.close();

	await uploadTtsToS3(audioData, fileName);

	return createS3Url(fileName);
};

const checkIfAudioHasAlreadyBeenSynthesized = async (fileName: string) => {
	const bucketName = 'ddm-video-transcripts';
	const awsRegion = 'us-east-2';
	const s3 = new S3Client({
		region: awsRegion,
		credentials: {
			accessKeyId: 'AKIA4WL3JFEK2RSYRRBF' || '',
			secretAccessKey: '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' || '',
		},
	});

	try {
		return await s3.send(
			new GetObjectCommand({Bucket: bucketName, Key: fileName})
		);
	} catch {
		return false;
	}
};

const uploadTtsToS3 = async (audioData: ArrayBuffer, fileName: string) => {
	const bucketName = 'ddm-video-transcripts';
	const awsRegion = 'us-east-2';
	const s3 = new S3Client({
		region: awsRegion,
		credentials: {
			accessKeyId: 'AKIA4WL3JFEK2RSYRRBF' || '',
			secretAccessKey: '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' || '',
		},
	});

	return s3.send(
		new PutObjectCommand({
			Bucket: bucketName,
			Key: fileName,
			Body: new Uint8Array(audioData),
		})
	);
};

const createS3Url = (filename: string) => {
	const bucketName = 'ddm-video-transcripts';

	return `https://${bucketName}.s3.amazonaws.com/${filename}`;
};
