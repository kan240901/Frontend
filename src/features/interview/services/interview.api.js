import axios from "axios"
import { BASE_URL } from '../../../../config.js'

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true
});

export async function generateInterviewReport ({selfDescription,jobDescription,resumeFile}){
    const formData = new FormData()
    formData.append('resume', resumeFile)
    formData.append('selfDescription', selfDescription.trim())
    formData.append('jobDescription', jobDescription.trim())

    const response = await api.post(`/api/interview/generate-report`,formData,{
        headers:{
            "Content-Type":"multipart/form-data",
        }
    });
    return response.data;
}

export async function getInterviewReportById (interviewId){
    const response = await api.get(`/api/interview/report/${interviewId}`);
    return response.data;
}

export async function getAllInterviewReports (){
    const response = await api.get(`/api/interview/getAllReports`);
    return response.data;
}

export async function generateResumePdf (interviewReportId){
    const response = await api.get(`/api/interview/resume/pdf/${interviewReportId}`,{
        responseType:"blob",
    });
    return response.data;
}