 import {interpolate, Sequence, useCurrentFrame, useVideoConfig, Audio} from 'remotion'; 
import {Title} from './Titles/Title';
import audioAccoustic from './../accoustic-30.mp4';
import {Palette} from './Palette';
import {Shade} from './Shade';
export const HelloWorld: React.FC<{
	titleColor: string;
	wordText: string;
	definitionText: string;
	bgColor:string;
	definitionTextSize:number;
}> = ({
	titleColor,
	wordText,
	definitionText,
	bgColor,
	definitionTextSize}) => {
	const frame = useCurrentFrame();
	const videoConfig = useVideoConfig();

	const opacity = interpolate(
		frame,
		[videoConfig.durationInFrames - 25, videoConfig.durationInFrames - 15],
		[1, 0],
		{
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);
	const transitionStart = 25;
	const sceneLength=Math.ceil( (definitionText.length + wordText.length) * 7)
	return (
		<div style={{flex: 1, backgroundColor:bgColor}}>
		<div style={{opacity}}>
			<Sequence name="Background Music" from={0} durationInFrames={Infinity}>
				<Audio src={audioAccoustic} volume={0.5} startFrom={0} /> 
			</Sequence>
			<Sequence
				name="Background Effects"
				from={0}
				durationInFrames={Infinity}>
			<Palette color={bgColor} />
			</Sequence>
				<Sequence name="Word" from={0} durationInFrames={100}> 
				<Title titleText={wordText+" ?"} titleColor={titleColor}  />
				</Sequence>
				<Sequence
					name="Definition"
					from={transitionStart + 100}
					durationInFrames={Infinity -20}> 
					<Title
							titleText={definitionText}
							titleColor={titleColor}  	 
			  	 />
				</Sequence>
				<Sequence
					name="Ending Screen"
					from={sceneLength - 280}
					durationInFrames={Infinity} >
					<Shade color="white" background={bgColor}/> 
				</Sequence> 
		   </div>
		</div> 
	);
};
 
