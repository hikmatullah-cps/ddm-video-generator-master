import React, {useEffect,useState} from 'react'
import "./Video.css" 
import { JellyBounceLoader } from 'react-loaders-kit';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';


const  App= ()=> { 
    const [word, setWord] = useState()
    const [definition, setDefinition] = useState()
    const [videoUrl, setVideoUrl] = useState()
    const [formatValue, setFormateValue] = useState('video');
    const [loading, setLoading] = useState(false);
    const [wcolor, setWordColor] = useState('#ffffff');
    const [dcolor, setDefColor] = useState('#2323a1');
    const loaderProps = {
      loading,
      size: 20,
      duration: 1
    }
    const checkHours = (hourValue ) => {
      if( hourValue === "image"){
       const formateValue  =hourValue
       setFormateValue(formateValue)
      } else if ( hourValue === "video"){
        const formateValue  =hourValue
        setFormateValue(formateValue)
      } 
      console.log(formatValue)
    };
     
    const submitForm=()=>{
       setLoading(true)
       console.log('submit') 
        var requestOptions   = {
          mode: 'no-cors',
          method: 'GET',
          redirect: 'follow'
        };  
        fetch(`https://cp-video-generator.herokuapp.com/server/?titleColor=${wcolor.replace('#', '%23')}&wordText=${word}&definitionText=${definition}&bgColor=${dcolor.replace('#', '%23')}&formate=${formatValue}`, requestOptions)
          .then(response => response.json())
          .then((result ) => {
            
                setVideoUrl(result.video_url)
                setLoading(false) 
                 toast.success('File downloaded successfuly!', {
                  position: "bottom-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  }) 
        }).catch(error =>
            { console.log('error', error)
              setLoading(false)
              toast.error('Failed to download.', {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              }); 
           }
        );
     } 
    const wordInput=(event )=>{
      setWord(event.target.value) 
    }
    const defInput=(event )=>{
      setDefinition(event.target.value) 
    }
    const wordColor=(event )=>{
      setWordColor(event.target.value) 
    }
    const definitionColor=(event )=>{
      setDefColor(event.target.value) 
    }
    console.log(wcolor, dcolor)
    useEffect(() => {
      setVideoUrl(videoUrl) 
      console.log(videoUrl, 'url')
    }  , [videoUrl])

    
    // const spaceKeyWord=(e  )=>{
    //   if(e.keyCode == 32){ 
    //       setWord(word.concat(' '))
    //       console.log('just simple')
    //    }
    //  }
    // const spaceKeyDef=(e  )=>{
    //   if(e.keyCode == 32){ 
    //     setDefinition(definition.concat(' '))
    //       console.log('just simple')
    //    }
    //  }
     
    return (
      <>
        <div className="Video-form-container">
            <div className="input-form-box">
                <div className=" dt-checkbox">
                 <FormControl>
                    <FormLabel id="demo-row-radio-buttons-group-label">Formate</FormLabel>
                        <RadioGroup
                          row
                          aria-labelledby="demo-row-radio-buttons-group-label"
                          name="row-radio-buttons-group"
                        >
                          <FormControlLabel value="video" control={<Radio nChange={()=>checkHours('video')} />} label="Video" />
                          <FormControlLabel value="image" control={<Radio onChange={()=>checkHours('image')} />} label="Thumbnail" />
                      </RadioGroup>
                      </FormControl>
                        {/* <label>Thumbnail</label>
                        <input onChange={()=>checkHours('image')} name="formate" type='radio' /> 
                         <label>Video</label>
                         <input  onChange={()=>checkHours('video')} name="formate" type='radio'/>   */}
                     </div>
                    <div>
                     <label >Select word text color: </label>
                      
                     <input type="color" id="favcolor" name="wordColor" onChange ={wordColor} value={wcolor}/>
                    <br/> <br/><label >Select definition text color: </label>
                     <input type="color" id="favcolor" name="defColor"  onChange ={definitionColor} value={dcolor}/>
                   </div> 
                    <br/>
                  <div>
                   <input className='words' id="word"  onChange={wordInput}    value={word}  placeholder="Enter Word" />
                </div>
              <br/>
                <textarea placeholder="Enter Word Definition..." onChange={defInput} value={definition}/>  
             <div className="d-flex">  
               <button onClick={submitForm} className="video-form-apply-btn">{!loading ? "Generate" : <JellyBounceLoader {...loaderProps} />}</button>       
              {videoUrl &&  <a class="btn-download" variant="contained" color="error"   href={`${videoUrl}`} download={`${videoUrl}`}> Download </a>}  
             </div>
           </div>
           <ToastContainer/>
        </div>
        </>
        )
      }
   

export default App;
