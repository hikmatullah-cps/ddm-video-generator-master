import {useState} from 'react'
import {Composition, Still, getInputProps} from 'remotion';
import {HelloWorld} from './Scene';
import { thumbnail } from './thumbnail';
export const RemotionVideo: React.FC = () => {
	const[state, setstate] = useState(300)
	const { wordText, definitionText } = getInputProps();
	const titleLength= wordText.length
	const definitionLength= definitionText.length 
	return (
		<>
			<Composition
				id="CompId"
				component={HelloWorld}
				durationInFrames={Math.ceil(definitionLength+titleLength)*5}
				fps={30} 
				width={1920}
				height={1080}
				defaultProps={{ 
					 titleColor: 'white', 
					 wordText: 'What does ' + 'default word' + ' mean?',
					 definitionText: 'Running default definition text.',
					 bgColor: '#6c6868',
					 definitionTextSize:70  
					 }}
			    />    
		</>
	);
};
