export const analyzeAudioWithDeepgram = async (audioBlob: Blob) => {
    // const apiKey = process.env.REACT_APP_DEEPGRAM_API_KEY;
    const apiKey = '77a3dc3f657f87560ba86ab6f676b543f0a61915';
    console.log(apiKey)
    
    const arrayBuffer = await audioBlob.arrayBuffer();
  
    const response = await fetch('https://api.deepgram.com/v1/listen?punctuate=true', {
      method: 'POST',
      headers: {
        Authorization: `Token ${apiKey}`,
        'Content-Type': 'audio/wav', // WAV!
      },
      body: arrayBuffer,
    });
  
    if (!response.ok) {
      throw new Error('Deepgram API Error');
    }
  
    const data = await response.json();
    return data;
  };