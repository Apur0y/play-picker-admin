
import { CgNotes } from "react-icons/cg";
import { FaNotesMedical } from "react-icons/fa";
import { FaUserDoctor } from "react-icons/fa6";
import { MdOutlinePeopleAlt } from "react-icons/md";
import { useGetAllReportsQuery, useGetAllStatsQuery } from "../../../redux/api/reports/reportSlice";
import { useMemo } from "react";
import { useGetMeQuery } from "../../../redux/api/getMe/getMeApi";
import { Link } from "react-router-dom";
import { LuClipboardList } from "react-icons/lu";
import { formatDistanceToNow } from 'date-fns';


const Overview = () => {


  const { data: stat } = useGetAllStatsQuery({});
  const analytics = stat?.data

  // Stats data
  const stats = [
    { title: 'Total Submissions', value: analytics?.total, text: 'text-blue-500', color: 'bg-blue-500/20', icon: <CgNotes /> },
    { title: 'Pending Consultations', value: analytics?.pending, text: 'text-amber-500', color: 'bg-amber-500/20', icon: <FaUserDoctor /> },
    { title: 'Completed Reports', value: analytics?.completed, text: 'text-green-500', color: 'bg-green-500/20', icon: <FaNotesMedical /> },
    { title: 'Total Members', value: analytics?.totalUsers, text: 'text-indigo-500', color: 'bg-indigo-500/20', icon: <MdOutlinePeopleAlt /> }
  ];

  // Recent activities data
  // const activities = [
  //   {
  //     title: 'New report submitted by John Doe',
  //     time: '2 hours ago',
  //     icon: <FaNotesMedical className="size-7 text-primary p-1" />,
  //     status: 'Completed'
  //   },
  //   {
  //     title: 'Consultation request from Sarah Smith',
  //     time: '3 hours ago',
  //     icon: <FaUserDoctor className="size-7 text-primary p-1" />,
  //     status: 'Pending'
  //   },
  //   {
  //     title: 'Monthly report summary ready',
  //     time: '5 hours ago',
  //     icon: <CgNotes className="size-7 text-primary p-1" />,
  //     status: 'Completed'
  //   },
  //   {
  //     title: 'New patient registration: Michael Brown',
  //     time: '6 hours ago',
  //     icon: <GrUserManager className="size-7 text-primary p-1" />,
  //     status: 'Pending'
  //   }
  // ];

  const queryParams = useMemo(() => {
    const params: any = {
      sort: 'desc',
      count: true
    }


    return params
  }, [])

  const { data: user } = useGetMeQuery({});

  const { data: allReports } = useGetAllReportsQuery(queryParams);


  const reports = allReports?.data;
  const activities = reports?.map((report: any) => ({
    title: report.title,
    time: formatDistanceToNow(new Date(report.createdAt), { addSuffix: true }), // Format the date
    status: report.status,
    icon: (
      <LuClipboardList />
    ),
  }));

  return (
    <div className="min-h-screen bg-gray-50  pt-12">
      <div className="mx-3 md:mx-24">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-[32px] font-bold text-gray-900">Hi, Dr. {user?.data.name}</h1>
          <p className="text-gray-400  md:text-[16px]">Here's your activity overview</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl  p-6 ">
              <div className="flex flex-col gap-2">
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center text-white`}>
                  <span className={`text-xl ${stat.text}  font-bold`}>{stat.icon}</span>
                </div>
                <div className="">
                  <h3 className="text-lg md:text-xl  font-semibold text-primary">{stat.value}</h3>
                  <p className="text-primary md:text-[16px]">{stat.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>


        {/* Recent Activities */}
        <div className="bg-white rounded-xl p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg md:text-xl font-semibold text-primary">Recent Activities</h2>
            <Link to="/dashboard/reports" className="text-primary hover:text-primary text-sm font-medium hover:underline cursor-pointer">
              View All
            </Link>
          </div>

          <div className="space-y-4">
            {activities?.slice(0, 5).map((activity: any, index: any) => (
              <div key={index} className="flex items-start py-2 justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3 text-sm">
                    {activity.icon}
                  </div>
                  <div className="">
                    <p className="text-gray-800">{activity.title}</p>
                    <p className="text-gray-500 text-sm">{activity.time}</p>
                  </div>
                </div>
                <div>
                  <p
                    className={`font- text-[16px] px-3 py-1 rounded-full ${activity.status === 'PENDING'
                        ? 'bg-orange-100 text-amber-600'
                        : 'text-green-700 bg-green-100'
                      }`}
                  >
                    {activity.status === 'PENDING' ? "Pending" : "Completed"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Overview;