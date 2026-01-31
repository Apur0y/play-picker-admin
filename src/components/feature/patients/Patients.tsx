"use client"

import { useState, useEffect, useMemo } from "react"
import Pagination from "../../shared/Pagination"
import { useGetAllPatientsQuery } from "../../../redux/api/reports/reportSlice"
import { Report } from "../../all-types/types"
import { useUpdateStatusMutation } from "../../../redux/api/getMe/getMeApi"
import { toast } from "sonner"

export default function ReportList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [genderFilter, setGenderFilter] = useState("")
  const [ageRangeFilter, setAgeRangeFilter] = useState("")
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1);
  const [skip, setSkip] = useState(0);

  // Build query parameters based on filters
  const queryParams = useMemo(() => {
    const params: any = {
      skip: (currentPage - 1) * itemsPerPage,
      limit: itemsPerPage,
      sort: 'asc',
      count:true
    }

    if (searchTerm.trim()) {
      params.name = searchTerm.trim()
    }

    if (statusFilter !== "All") {
      params.status = statusFilter.toLowerCase()
    }

    if (genderFilter !== "Gender") {
      params.gender = genderFilter.toLowerCase()
    }
    if (skip !==0) {
      params.skip = skip
    }

    if (ageRangeFilter !== "Age Range") {
      const ageRange = ageRangeFilter.split("-")
      if (ageRange[0]) params.minAge = parseInt(ageRange[0])
      if (ageRange[1] && ageRange[1] !== "+") {
        params.maxAge = parseInt(ageRange[1])
      } else if (ageRange[1] === "+") {
        params.maxAge = 100
      }
    }

    return params
  }, [searchTerm, statusFilter, genderFilter, ageRangeFilter, currentPage, itemsPerPage])

  const { data: allReports, isLoading } = useGetAllPatientsQuery(queryParams)

  const [updateStatus]=useUpdateStatusMutation();

  const reports = allReports?.data || []
  const totalItems = allReports?.meta.total;
  const totalPages = Math.ceil(totalItems / itemsPerPage)


  // Reset to first page when filters changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, statusFilter, genderFilter, ageRangeFilter, itemsPerPage])

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSkip(itemsPerPage*(page-1))
  }

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
   
  }

  // Handle filter changes
  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value)
  }

  const handleGenderFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGenderFilter(e.target.value)
  }

  const handleAgeRangeFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAgeRangeFilter(e.target.value)
  }

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value))
  }

  // Client-side filtering for patient name search (in case API doesn't support patient name search)
  const filteredReports = useMemo(() => {
    if (!searchTerm.trim()) return reports
    
    return reports.filter((report: Report) => 
      report?.user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report?.title?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [reports, searchTerm])
  
    const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const ageDiff = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDiff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const handleStatus=async(id:string, data:any)=>{

    const date ={
      status:data
    }
 
     const res = await updateStatus({id,data:date});

     if(res.data){
      toast.success("Status updated successfully!")
     }else{
      toast.error("Status Update Fail!")
     }
  }

  return (
    <div className="xl:p-6 rounded-lg mx-3 xl:mx-5">
      {/* Header */}
      <h1 className="text-xl font-medium text-primary pb-6 mt-[38px] border-b border-gray-200 mb-6">Patient List</h1>

      {/* Filters and Search */}
      <div className="flex items-center justify-between my-6 gap-4">
        <div className="flex flex-col md:flex-row items-center gap-4 w-full">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search by patient name or report title..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10 pr-4 py-3 w-full md:w-64 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-blue-500 outline-none text-sm"
            />
          </div>

          <div className="flex-1 flex flex-col md:flex-row  gap-4 justify-between">
            <div className="flex gap-2  flex-wrap sm:flex-row">
              {/* Filters */}
              <select
                value={statusFilter}
                onChange={handleStatusFilterChange}
                className="px-3 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm "
              >
                <option>All</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>

              <select
                value={genderFilter}
                onChange={handleGenderFilterChange}
                className="px-3 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm "
              >
                <option>Gender</option>
                <option>Male</option>
                <option>Female</option>
              </select>

              <select
                value={ageRangeFilter}
                onChange={handleAgeRangeFilterChange}
                className="px-3 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm "
              >
                <option>Age Range</option>
                <option>18-30</option>
                <option>31-50</option>
                <option>51+</option>
              </select>
            </div>

            {/* Items per page */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Items per page</span>
              <select
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm bg-neutral-200"
              >
                <option>10</option>
                <option>25</option>
                <option>50</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-500">Loading reports...</div>
        </div>
      )}

      {/* Table */}
       <div className="overflow-auto border border-gray-200 rounded-lg">
      <table className="min-w-[400px] w-full divide-y divide-gray-200">
        <thead className="bg-neutral-100">
          <tr>
            <th className="px-6 md:py-8 text-left text-xs font-medium text-black lg:text-[16px] uppercase tracking-wider">
              Patient Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-black lg:text-[16px] uppercase tracking-wider">
              Age
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-black lg:text-[16px] uppercase tracking-wider">
              Gender
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-black lg:text-[16px] uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-black lg:text-[16px] uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredReports?.map((report:any) => (
            <tr key={report.id} className="hover:bg-gray-50">
              <td className="px-6 py-5 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <img
                      className="h-10 w-10 rounded-full object-cover"
                      src={report.user.avatar || "https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2558760599.jpg"}
                      alt={report.user.name}
                      width={40}
                      height={40}
                    />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{report.user.name}</div>
                    <div className="text-sm text-gray-500">{report.email || "user@gmail.com"}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {calculateAge(report.user.dateOfBirth)} {/* Display Age */}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.user.gender}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${report.user.status === "ACTIVE" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                >
                  {report.user.status === "ACTIVE" ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                    {report.user.status === "ACTIVE" ?  <button onClick={()=>handleStatus(report.userId, "inactive")} className="p-1.5 cursor-pointer rounded bg-green-200">
                  <p className="p-2 rounded bg-green-700"></p>
                </button>:   <button onClick={()=>handleStatus(report.userId, "active")} className="p-1.5 rounded cursor-pointer bg-red-200">
                  <p className="p-2 rounded bg-red-700"></p>
                </button> }
              
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* No results message */}
      {!isLoading && filteredReports?.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No reports found matching your criteria.
        </div>
      )}
    </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
      />
    
    </div>
  )
}