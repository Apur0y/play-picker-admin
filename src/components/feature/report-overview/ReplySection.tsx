"use client";

import { useEffect, useRef, useState } from "react";

import { LuSend, LuPaperclip } from "react-icons/lu";
import { useParams } from "react-router-dom";
import {
  useGetReportRepliesQuery,
  useSendReportReplyMutation,
} from "../../../redux/api/reply/replySlice";
import Cookies from "js-cookie";

export default function ReplySection() {
  const { id } = useParams();
  const token = Cookies.get("adminToken")
  const { data: reports, refetch } = useGetReportRepliesQuery({ id });
  const report = reports?.data;

  const [sendReply] = useSendReportReplyMutation();
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
const [urls, setUrls] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
 const [iframeUrl, setIframeUrl] = useState('');



  const openModalWithUrl = (url: string) => {
    setIframeUrl(url);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setIframeUrl('');
  };

    const isPdf = (url: string | null) => {
    return url?.toLowerCase().endsWith('.pdf');
  };



  // Get replies from the report data
  const replies = Array.isArray(report) ? report : [];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [replies]);
  console.log(attachments);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const getSignedUrl = async (fileType: any, mimeType: any) => {
      const response: any = await fetch(
        `${
          import.meta.env.VITE_SERVER_URL
        }/uploads?fileType=${encodeURIComponent(
          fileType
        )}&mimeType=${encodeURIComponent(mimeType)}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to get signed URL");
      }

      const data = await response.json();
      return data.data.signedUrl;
    };

    const resultUrls: string[] = [];

    // Only process files if there are any (since it's optional now)
    if (attachments?.length > 0) {
      await Promise.all(
        attachments.map(async (file: any) => {
          const fileType = file.name.split(".").pop();
          const mimeType = file.type;

          try {
            const signedUrl = await getSignedUrl(fileType, mimeType);

            const uploadResponse = await fetch(signedUrl, {
              method: "PUT",
              headers: {
                "Content-Type": mimeType,
              },
              body: file,
            });

            if (!uploadResponse.ok) {
              throw new Error(`Upload failed for ${file.name}`);
            }

            const fileUrl = signedUrl.split("?")[0];
            resultUrls.push(fileUrl);
            setUrls((prev) => [...prev, fileUrl]);
          } catch (error) {
            console.error("Error uploading", file.name, error);
          }
        })
      );
    }

    console.log("This the total urls",resultUrls)

      try {
   
      const res = await sendReply({
        reportId: id,
        reply: message,
        files:resultUrls
      });
      console.log(res);
    } catch (error) {}
    setMessage("");
    setAttachments([]);
    setTimeout(() => {
      refetch();
    }, 3000);
  };


  // const handleSend = async () => {
  //   try {
  //      handleSubmit({})
  //     const res = await sendReply({
  //       reportId: id,
  //       reply: message,
  //     });
  //     console.log(res);
  //   } catch (error) {}
  //   setMessage("");
  //   setAttachments([]);
  //   setTimeout(() => {
  //     refetch();
  //   }, 3000);
  // };

  console.log(urls)


  return (
    <div>
      <div className="px-6 py-6 bg-white rounded-xl mt-8">
        {/* Replies Section */}
        {replies.length > 0 && (
          <div className="mt-6">
            <h4 className="text-lg font-semibold text-primary-text mb-3">
              Previous Messages
            </h4>
            <div
              ref={containerRef}
              className="space-y-4 max-h-96 overflow-y-auto scroll-smooth"
            >
              {replies.map((reply) => (
                <div key={reply.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {reply.user?.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-primary-text">
                          {reply.user?.name || "Unknown User"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(reply.createdAt)}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs bg-blue-100 text-primary px-2 py-1 rounded">
                      {reply.user?.role === "ADMIN" ? "Specialist" : "USER"}
                    </span>
                  </div>

                  <div className="bg-white rounded-lg p-3 ml-10">
                    <p className="text-sm text-gray-700">{reply.reply}</p>

                    {/* Show attachments if any */}
                    {reply.files && reply.files.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <p className="text-xs text-gray-500 mb-1">
                          Attachments:
                        </p>
                        {[...reply.files]
                          .reverse()
                          .map((file: any, index: number) => (
                            <div
                              key={index}
                              className="flex items-center gap-1 text-xs text-blue-600"
                            >
                              <LuPaperclip size={12} />
                              <button  onClick={() => openModalWithUrl(file)}>
                              <span>
                                {file.name || `Attachment ${index + 1}`}
                              </span>
                              </button>

                             
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chat Section */}
        <div className="mt-6">
          <h4 className="text-lg font-semibold text-primary-text mb-3">
            Send a Message
          </h4>
          <div className="flex flex-col gap-3">
            <textarea
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Write your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer text-primary hover:underline">
                <LuPaperclip size={18} />
                <span>
                  {attachments.length > 0
                    ? `${attachments.length} file${
                        attachments.length > 1 ? "s" : ""
                      } attached`
                    : "Attach files"}
                </span>
                <input
                  type="file"
                  className="hidden"
                  multiple
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files) {
                      setAttachments(Array.from(files));
                    }
                  }}
                />
              </label>

              <button
                onClick={handleSubmit}
                className="inline-flex items-center cursor-pointer gap-2 px-5 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-200 font-medium"
                disabled={!message.trim()}
              >
                <LuSend size={18} />
                Send
              </button>
            </div>
          </div>
        </div>
      </div>

       {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/20 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white w-full max-w-4xl rounded-lg shadow-lg overflow-hidden relative">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-2xl font-bold"
            >
              &times;
            </button>

            {/* Iframe */}
            {/* Content */}
            <div className="w-full h-[500px]">
              {isPdf(iframeUrl) ? (
                <iframe
                  src={iframeUrl}
                  title="PDF Preview"
                  className="w-full h-full border-0"
                />
              ) : (
                <img
                  src={iframeUrl}
                  alt="Preview"
                  className="w-full h-full object-contain"
                />
              )}
            </div>
             <a
              href={iframeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-400 p-3 flex justify-center text-white"
            >
              View
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
