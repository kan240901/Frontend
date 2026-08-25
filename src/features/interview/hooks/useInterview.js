import {generateResumePdf,generateInterviewReport,getInterviewReportById,getAllInterviewReports} from "../services/interview.api"
import { useCallback, useContext, useState } from "react"
import { InterviewContext } from "../interview.context"

export const useInterview =() => {
    const context = useContext(InterviewContext);
    if(!context){
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const {loading, setLoading, report, setReport, reports, setReports} = context;
    const [downloadLoading, setDownloadLoading] = useState(false)
    const [downloadError, setDownloadError] = useState('')
    const generateReport = async({jobDescription, selfDescription, resumeFile})=>{
        setLoading(true);
        try{
            const response = await generateInterviewReport({jobDescription, selfDescription, resumeFile});
            setReport(response.interviewReport);
            return response.interviewReport;
        }catch(error){
            console.log(error);
            throw error;
        }finally{
            setLoading(false);
        }
    }

    const getReportById = async (interviewId) => {
        setLoading(true);
        try{
            const response = await getInterviewReportById(interviewId);
            setReport(response.interviewReport);
        }catch(error){
            console.log(error);
        }finally{
            setLoading(false);
        }
    }

    const getReports = useCallback(async () => {
        setLoading(true);
        try{
            const response = await getAllInterviewReports();
            setReports(response.interviewReports);
        }catch(error){
            console.log(error);
        }finally{
            setLoading(false);
        }
    }, [setLoading, setReports])

    const getResumePdf = async (interviewReportId) => {
        setDownloadLoading(true);
        setDownloadError('');
        try{
            const response = await generateResumePdf(interviewReportId);
            const url = window.URL.createObjectURL(response)
            const link = document.createElement("a")
            link.href = url
            link.setAttribute("download",`resume${interviewReportId}.pdf`)
            document.body.appendChild(link)
            link.click()
            link.remove()
            window.URL.revokeObjectURL(url)
        }catch(error){
            console.log(error);
            let message = error.response?.data?.message
            if (!message && error.response?.data instanceof Blob) {
                try {
                    const errorData = JSON.parse(await error.response.data.text())
                    message = errorData.message
                } catch {
                    message = ''
                }
            }
            setDownloadError(message || 'Unable to download the resume. Please try again.')
        }finally{
            setDownloadLoading(false);
        }
    }

    return {loading,report, reports,generateReport,getReportById,getReports,getResumePdf,downloadLoading,downloadError}

        
}