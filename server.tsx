/**
 * This is an example of a server that returns dynamic video.
 * Run `npm run server` to try it out!
 * If you don't want to render videos on a server, you can safely
 * delete this file.
 */

 import {bundle} from '@remotion/bundler';
 import {
	 getCompositions,
	 renderFrames,
	 stitchFramesToVideo,
 } from '@remotion/renderer';
 import express from 'express';
 import fs from 'fs'; 
 import path from 'path';
 const cors = require('cors')

 const app = express();
 const port = process.env.PORT || 8000;
 const compositionId = 'CompId';
 
 const cache = new Map<string, string>();
 const nodeEnv :any = "local"
if(nodeEnv=="developement"){
 app.use(express.static('client/build'))  
}
const publicDir = path.join(__dirname,'/public'); 
app.use(express.static(publicDir));  
 app.get('/server', async (req, res) => {
	 res.set('Access-Control-Allow-Origin', '*')
	 const sendFile = (file: string) => {
		 fs.createReadStream(file)
			 .pipe(res)
			 .on('close', () => {
				 res.end();
			 });
	 };
	 try {
		 if (cache.get(JSON.stringify(req.query))) {
			 sendFile(cache.get(JSON.stringify(req.query)) as string);
			 return;
		 }
		 console.log(req.query, 'req.query')
		 if(req.query.formate=='image'){ 
					 const thumb_bundled = await bundle(path.join(__dirname, './src/thumbnail-index.tsx'));
					 const thumb_comps = await getCompositions(thumb_bundled, {inputProps: req.query});
				 
				 const thumb_video = thumb_comps.find((c) => c.id === compositionId);
				 if (!thumb_video) {
					 throw new Error(`No thumb_video called ${compositionId}`);
				 } 
				 const thumb_tmpDir = await fs.promises.mkdtemp(
					 path.join(`public/thumbnails/${req.query.wordText}`)
				 );
			 const thumbFinalOutput = path.join(thumb_tmpDir, 'element-0.jpeg'); 
					 await renderFrames({
					 config: thumb_video,
					 webpackBundle: thumb_bundled,
					 onStart: () => console.log('Rendering frames...'),
					 onFrameUpdate: (f) => {
						 if (f % 10 === 0) {
							 console.log(`Rendered frame ${f}`);
						 }
					 },
					 parallelism: null,
					 outputDir: thumb_tmpDir,
					 inputProps: req.query,
					 compositionId,
					 imageFormat: 'jpeg',
				 });
				 cache.set(JSON.stringify(req.query), thumbFinalOutput); 
				 sendFile(thumbFinalOutput); 
				 res.status(200).json({video_url:`/${thumbFinalOutput}`})
				 console.log('thumbnail rendered and sent!'); 
		 } else if(req.query.formate=='video'){
			 console.log('you run video')
				 const bundled = await bundle(path.join(__dirname, './src/index.tsx'));
				 const comps = await getCompositions(bundled, {inputProps: req.query}); 
				 const video = comps.find((c) => c.id === compositionId);
				 if (!video) {
					 throw new Error(`No video called ${compositionId}`);
				 }
				  
				 const tmpDir = await fs.promises.mkdtemp(
					 path.join(`public/videos/${req.query.wordText}`)
				 );
				 const {assetsInfo} = await renderFrames({
					 config: video,
					 webpackBundle: bundled,
					 onStart: () => console.log('Rendering frames...'),
					 onFrameUpdate: (f) => {
						 if (f % 10 === 0) {
							 console.log(`Rendered frame ${f}`);
						 }
					 }, 
					 parallelism: null,
					 outputDir: tmpDir,
					 inputProps: req.query,
					 compositionId,
					 imageFormat: 'jpeg',
				 });
 
				 const finalOutput = path.join(tmpDir, 'out.mp4');
				 await stitchFramesToVideo({
					 dir: tmpDir,
					 force: true,
					 fps: video.fps,
					 height: video.height,
					 width: video.width,
					 outputLocation: finalOutput,
					 imageFormat: 'jpeg',
					 assetsInfo,
				 });
				 cache.set(JSON.stringify(req.query), finalOutput); 
				 sendFile(finalOutput);
				  fs.readdir(tmpDir,(err, folder)=>
				   {
						 folder.forEach((file)=> {  
				     	const fileExtention=path.extname(`${file}`) 
							 if(fileExtention !==".mp4"){ 
								 fs.unlinkSync(`${tmpDir}/${file}`);
							 } 
				     })
				    })
			 //	fs.unlink(tmpDir, (e)=>console.log('remove extra file'))
				 console.log('Video rendered and sent!'); 
				 res.status(200).json({video_url:`${finalOutput}`})
		   }
		 
	 } catch (err) {
		 console.error(err);
		 res.json({
			 error: err,
		 });
	 }
 });
 
 app.listen(port);
 
 console.log(
	 [
		 `The server has started on http://localhost:${port}!`,
		 'You can render a video by passing props as URL parameters.',
		 '',
		 'If you are running Hello World, try this:',
		 '',
		 `http://localhost:${port}?titleText=Hello,+World!&titleColor=red`,
		 '',
	 ].join('\n')
 );




	
 
