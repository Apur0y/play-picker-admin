import React from 'react';
import { Card } from 'antd';
import {
    CalendarOutlined,
    TeamOutlined,
    AppstoreOutlined,
    EnvironmentOutlined
} from '@ant-design/icons';

interface MetricCardsProps {
    bookingCount: string | number;
    cliniciansCount: string | number;
    servicesCount: string | number;
    locationsCount: string | number;
}

const MetricCards: React.FC<MetricCardsProps> = ({
    bookingCount,
    cliniciansCount,
    servicesCount,
    locationsCount
}) => {
    const metrics = [
        { title: 'Total Booking', value: bookingCount, icon: <CalendarOutlined />, color: 'bg-blue-100' },
        { title: 'Total Clinician', value: cliniciansCount, icon: <TeamOutlined />, color: 'bg-green-100' },
        { title: 'Total Services', value: servicesCount, icon: <AppstoreOutlined />, color: 'bg-purple-100' },
        { title: 'Total Location', value: locationsCount, icon: <EnvironmentOutlined />, color: 'bg-orange-100' },
    ];

    return (
        <div className="flex flex-wrap gap-6">
            {metrics.map((metric, index) => (
                <Card key={index} className="flex-1 min-w-[200px] shadow-md">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-gray-500 text-sm">{metric.title}</p>
                            <p className="text-2xl font-semibold mt-2">{metric.value}</p>
                        </div>
                        <div className={`${metric.color} p-3 rounded-full`}>
                            <div className="text-xl" style={{ fontSize: '40px' }}>
                                {React.cloneElement(metric.icon, { style: { fontSize: '40px' } })}
                            </div>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
};

export default MetricCards;