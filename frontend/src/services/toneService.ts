import axios from 'axios';

const ASSEMBLY_API_KEY = '841f0d56728c491ea9762ba5b01b2519'; // Replace with your env in prod

export const analyzeToneWithAssembly = async (audioBlob: Blob) => {
    try {
      // 1. Upload
      const uploadRes = await axios.post(
        'https://api.assemblyai.com/v2/upload',
        audioBlob,
        {
          headers: {
            authorization: ASSEMBLY_API_KEY,
            'content-type': 'application/octet-stream',
          },
        }
      );
  
      const audioUrl = uploadRes.data.upload_url;
  
      // 2. Transcription request (NO emotion_detection!)
      const transcriptRes = await axios.post(
        'https://api.assemblyai.com/v2/transcript',
        {
          audio_url: audioUrl,
          sentiment_analysis: true,
          entity_detection: false,
          iab_categories: false,
          auto_highlights: false,
          speaker_labels: false,
        },
        {
          headers: {
            authorization: ASSEMBLY_API_KEY,
            'content-type': 'application/json',
          },
        }
      );
  
      const transcriptId = transcriptRes.data.id;
  
      // 3. Poll
      let status = 'queued';
      let result;
      while (status !== 'completed') {
        const pollingRes = await axios.get(
          `https://api.assemblyai.com/v2/transcript/${transcriptId}`,
          {
            headers: { authorization: ASSEMBLY_API_KEY },
          }
        );
        status = pollingRes.data.status;
        result = pollingRes.data;
  
        if (status === 'error') throw new Error(result.error);
        if (status !== 'completed') await new Promise((r) => setTimeout(r, 3000));
      }
  
      return {
        transcript: result.text,
        sentiment: result.sentiment_analysis_results?.[0]?.sentiment ?? 'neutral',
        confidence: result.confidence,
      };
    } catch (error: any) {
      console.error('❌ AssemblyAI error:', error.response?.data || error.message);
      throw error;
    }
  };