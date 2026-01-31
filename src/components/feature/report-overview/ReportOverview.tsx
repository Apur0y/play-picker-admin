"use client"
import { useGetSingleReportQuery } from "../../../redux/api/reports/reportSlice";
import { useParams } from "react-router-dom";
import ReplySection from "./ReplySection";


export default function ReportList() {

    // const [currentIndex, setCurrentIndex] = useState(0);
    // const [loading, setLoading] = useState(false);
    // const [errors, setErrors] = useState({ result: '', recomendation: '', file: '' });

    const { id } = useParams()
    const { data: reports } = useGetSingleReportQuery(id);



  
    const report = reports?.data;

    const calculateAge = (dob: string) => {
        const birthDate = new Date(dob);
        const ageDiff = Date.now() - birthDate.getTime();
        const ageDate = new Date(ageDiff);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    };
    

    // Check if file is PDF
    // const isPDFFile = (file: File): boolean => {
    //     return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    // };

    // const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const selectedFiles = e.target.files ? Array.from(e.target.files) : [];

    //     // Filter only PDF files
    //     const pdfFiles = selectedFiles.filter(file => isPDFFile(file));
    //     const nonPdfFiles = selectedFiles.filter(file => !isPDFFile(file));

    //     // Show error if non-PDF files were selected
    //     if (nonPdfFiles.length > 0) {
    //         setErrors(prev => ({
    //             ...prev,
    //             file: `Only PDF files are allowed. Rejected: ${nonPdfFiles.map(f => f.name).join(', ')}`
    //         }));
    //     } else {
    //         // Clear file error if only PDFs
    //         setErrors(prev => ({ ...prev, file: '' }));
    //     }

    //     // Add only PDF files
    //     if (pdfFiles.length > 0) {
    //         setFiles((prev) => [...prev, ...pdfFiles]);
    //     }
    // };

    // const handleRemoveFile = (indexToRemove: number) => {
    //     setFiles((prevFiles) => prevFiles.filter((_, index) => index !== indexToRemove));

    //     // Clear file error if no files remain
    //     if (files.length === 1) {
    //         setErrors(prev => ({ ...prev, file: '' }));
    //     }
    // };


    // const handleSubmit = async (e: any) => {
    //     e.preventDefault();
    //     const newErrors = { result: '', recomendation: '', file: '' };

    //     // Only validate result field - file upload is now optional
    //     if (!result.trim()) newErrors.result = 'Problem description is required.';

    //     if (newErrors.result) {
    //         setErrors(newErrors);
    //         return;
    //     }
    //     setErrors({ result: '', recomendation: '', file: '' });
    //     setLoading(true)
    //     const getSignedUrl = async (fileType: any, mimeType: any) => {
    //         const response: any = await fetch(
    //             `${import.meta.env.VITE_SERVER_URL}/uploads?fileType=${encodeURIComponent(fileType)}&mimeType=${encodeURIComponent(mimeType)}`,
    //             {
    //                 method: 'GET',
    //                 headers: {
    //                     'Authorization': `Bearer ${token}`,
    //                     'Content-Type': 'application/json',
    //                 },
    //             }
    //         );
    //         if (!response.ok) {
    //             throw new Error('Failed to get signed URL');
    //         }

    //         const data = await response.json();
    //         return data.data.signedUrl;
    //     };

    //     const resultUrls: string[] = [];

    //     // Only process files if there are any (since it's optional now)
    //     if (files?.length > 0) {
    //         await Promise.all(
    //             files.map(async (file: any) => {
    //                 const fileType = file.name.split('.').pop();
    //                 const mimeType = file.type;

    //                 try {
    //                     const signedUrl = await getSignedUrl(fileType, mimeType);

    //                     const uploadResponse = await fetch(signedUrl, {
    //                         method: 'PUT',
    //                         headers: {
    //                             'Content-Type': mimeType,
    //                         },
    //                         body: file,
    //                     });

    //                     if (!uploadResponse.ok) {
    //                         throw new Error(`Upload failed for ${file.name}`);
    //                     }

    //                     const fileUrl = signedUrl.split('?')[0];
    //                     resultUrls.push(fileUrl);
    //                 } catch (error) {
    //                     console.error('Error uploading', file.name, error);

    //                 }
    //             })
    //         );
    //     }

    //     // Now resultUrls is populated (could be empty array if no files)
    //     const data = {
    //         result,
    //         recomendation,
    //         resultUrls,
    //     };

    //     const res = await updateResults({ id, data });
    //     if (res.data) {
    //         toast.success("Result send successfully!");
    //         setFiles([]);
    //         setProblemDescription("");
    //         setSupplementRecommendations("");
    //         setLoading(false)
    //     } else {
    //         toast.error("Result send Fail!")
    //         setLoading(false)
    //     }
    // };




    return (
        <div className="xl:p-6 rounded-lg mx-3 max-w-[1114px] md:mx-auto">
            {/* Header */}
            <h1 className="text-xl font-medium text-primary pb-6 mt-[38px] border-b border-gray-200 mb-6">Report Overview</h1>

            {/* Profile Info */}
            <div className="mb-8">
                <div className="flex flex-wrap justify-between items-center border-b border-gray-300 pb-4">
                    {/* Patient Name */}
                    <div className="flex-1 flex gap-2 items-center">
                        <img src={report?.user.avatar} alt="" className="h-[54px] w-[54px] rounded-full" />
                        <div>

                            <h2 className="md:text-xl font-bold text-neutral-600">{report?.user.name}</h2>
                            <p className="text-neutral-600 mt-1">{report?.user.email}</p>
                        </div>
                    </div>

                    {/* Test Type */}
                    <div className="flex-1 text-center">
                        <p className="text-neutral-600">Test Type</p>
                        <p className="text-lg font-semibold text-gray-800">{report?.tilte}</p>
                    </div>
                    <div className="flex-1 text-center">
                        <p className="text-neutral-600">Age</p>
                        <p className="text-lg font-semibold text-gray-800"> {calculateAge(report?.user?.dateOfBirth)} Years</p>
                    </div>

                    {/* Age and Date */}
                    <div className="flex-1 text-right">
                        <p className="text-neutral-600">Submitted</p>
                        <p className="text-lg font-semibold text-gray-800">{new Date(report?.updatedAt).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                        })}</p>
                    </div>
                </div>
            </div>

            <div className="">
                <p className="block md:text-[16px] font-semibold text-gray-800 mb-2">Description</p>
                <textarea
                    value={report?.type || ''}
                    readOnly
                    className="w-full  text-gray-800 bg-gray-100 rounded-md p-2 resize-none"
                    rows={4} // Adjust number of rows as needed
                />
            </div>

                          <ReplySection/>



            {/* report Image */}
            {/* <div className="mt-12">
                <p className="mb-6 md:text-[22px] text-primary">Patient-Submitted Photos</p>

                <div className="relative">
      
                    <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2  hover:bg-black/20 bg-black/10  cursor-pointer transition-all duration-100 text-white p-2 rounded-full"
                    >
                        <IoIosArrowBack className="size-9" />
                    </button>

    
                    <div className="border-2 border-primary rounded-lg">
                        {isPDF(report?.reportUrls?.[currentIndex]) ? (
                            <iframe
                                src={report?.reportUrls?.[currentIndex]}
                                width="100%"
                                height="764px"
                                frameBorder="0"
                            ></iframe>
                        ) : (
                            <img
                                src={report?.reportUrls?.[currentIndex]}
                                alt="Report"
                                className="h-[764px] w-full object-cover"
                            />
                        )}
                    </div>

                 
                    <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 hover:bg-black/20 bg-black/10  cursor-pointer transition-all duration-100 text-white p-2 rounded-full"
                    >
                        <IoIosArrowForward className="size-9" />
                    </button>
                </div>
            </div>


            <div className=" mx-auto  rounded-lg mt-9">
                <form onSubmit={handleSubmit} className="space-y-6">
              
                    <div>
                        <label className="block md:text-[16px] font-semibold text-gray-800 mb-2">
                            Describe
                        </label>
                        <textarea
                            value={result}
                            onChange={(e) => setProblemDescription(e.target.value)}
                            placeholder="Describe the issue or symptoms..."
                            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2  h-32 bg-white"
                        />
                        {errors.result && <p className="text-red-600 text-sm mt-1">{errors.result}</p>}
                    </div>
      

                    {/* Supplement Recommendations */}
                    {/* <div>
                        <label className="block md:text-[16px] font-semibold text-gray-800 mb-2">
                            Supplement Recommendations
                        </label>
                        <textarea
                            value={recomendation}
                            onChange={(e) => setSupplementRecommendations(e.target.value)}
                            placeholder="List any recommended supplements (optional)..."
                            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2  h-32 bg-white"
                        />

                    </div> */}

                    {/* File Upload */}
                    {/* <div>
                        <label className="block md:text-[16px] font-semibold text-gray-800 mb-2">
                            Upload Report (Optional)
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-neutral-100 h-80 flex  flex-col items-center justify-center">
                            <input
                                type="file"
                                id="file-upload"
                                multiple
                                accept=".pdf,application/pdf"
                                onChange={handleFileUpload}
                                className="hidden"
                            />
                            <label
                                htmlFor="file-upload"
                                className="cursor-pointer  flex flex-col justify-center items-center"
                            >
                                <BiSolidCloudUpload className="size-12 text-center text-primary" />
                                <p className="mt-2 text-sm md:text-[18px] md:font-semibold text-primary">
                                    Drag & drop PDF files or{" "}

                                    click to browse

                                </p>
                            </label>
                            <p className="text-xs text-gray-500 mt-2">
                                Supported format: PDF only
                            </p>
                            <p className="text-xs text-gray-500">
                                Maximum size per file: 10MB
                            </p>
                        </div>
                    </div>
                    <div>

                        {files.length > 0 && (
                            <div>
                                <h3>Selected Files:</h3>
                                <ul>
                                    {files.map((file: any, index) => (
                                        <li key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            📄 {file.name} ({(file.size / 1024).toFixed(2)} KB)
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveFile(index)}
                                                style={{
                                                    background: 'transparent',
                                                    border: 'none',
                                                    color: 'red',
                                                    fontSize: '16px',
                                                    cursor: 'pointer',
                                                }}
                                                aria-label={`Remove ${file.name}`}
                                            >
                                                ✖
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {errors.file && <p className="text-red-600 text-sm mt-1">{errors.file}</p>}
                    </div> */}

                    {/* Submit Button */}
                    {/* <div className="">
                        <button
                            type="submit"
                            className="bg-primary text-white py-3 px-8 rounded-lg font-semibold group  hover:bg-primary/90 transition-colors shadow-md cursor-pointer flex items-center gap-2 hover:"
                        >
                            {!loading ? <>Send to Patient <FaArrowRight className="translate-x-0 group-hover:translate-x-2 transition-all duration-300 mt-1" /></> :

                                <LuLoader
                                    className="animate-spin text-center w-36"
                                />}

                        </button>
                    </div>
                       </form>
            </div> */}
             
        </div>
    )
}