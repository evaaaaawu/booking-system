'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isBetween from 'dayjs/plugin/isBetween';
import type { User as PrismaUser, EventType as PrismaEventType } from '@prisma/client';
import { Button } from '@repo/ui/button';
import { Spinner } from '@repo/ui/spinner';

dayjs.extend(isSameOrBefore);
dayjs.extend(isBetween);

interface TypeClientProps {
  user: PrismaUser;
  eventType: PrismaEventType;
}

export default function TypeClient({ user, eventType }: TypeClientProps): JSX.Element {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(dayjs().month());
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState([]);

  // 處理月份變更
  const incrementMonth = () => {
    setSelectedMonth(prev => prev + 1);
  };

  const decrementMonth = () => {
    setSelectedMonth(prev => prev - 1);
  };

  // 設置日曆
  const daysInMonth = dayjs().month(selectedMonth).daysInMonth();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const calendar = days.map((day) => (
    <Button
      key={day}
      onClick={() => setSelectedDate(dayjs().month(selectedMonth).date(day).format("YYYY-MM-DD"))}
      disabled={
        selectedMonth < dayjs().month() &&
        dayjs().month(selectedMonth).date(day).isBefore(dayjs(), 'day')
      }
      variant={
        dayjs().isSameOrBefore(dayjs().month(selectedMonth).date(day)) ? 'secondary' : 'white'
      }
      size="sm"
      className={`${dayjs(selectedDate).month(selectedMonth).date(day).isSame(dayjs(selectedDate).date(day), 'day') ? 'bg-blue-600 text-white-important' : ''}`}
    >
      {day}
    </Button>
  ));

  // 處理日期變更
  useEffect(() => {
    if (!selectedDate) return;

    const fetchAvailability = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/availability/${user.username}?date=${dayjs(selectedDate).format("YYYY-MM-DD")}`);
        const data = await res.json();
        setBusy(data.primary.busy);
      } catch (error) {
        console.error('Failed to fetch availability:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, [selectedDate, user.username]);

  // 設置時段
  let times: string[] = [];

  if (selectedDate === dayjs().format("YYYY-MM-DD")) {
    var i = dayjs().startOf('hour').diff(dayjs().startOf('day'), 'minute');
  } else {
    var i = 0;
  }

  for (; i < 1440; i += parseInt(eventType.length?.toString() || '30')) {
    const time = dayjs(selectedDate)
      .hour(Math.floor(i / 60))
      .minute(i % 60)
      .add(parseInt(eventType.length?.toString() || '30'), 'minute')
      .format("YYYY-MM-DD HH:mm:ss");
    times.push(time);
  }

  // 檢查衝突
  times = times.filter(time => {
    return !busy.some((busyTime: any) => {
      const startTime = dayjs(busyTime.start);
      const endTime = dayjs(busyTime.end);
      return dayjs(time).isBetween(startTime, endTime, null, '[)');
    });
  });

  // 顯示可用時間
  const availableTimes = times.map((time) => (
    <div key={time}>
      <Link href={`/${user.username}/${eventType.id}/book?date=${selectedDate}T${dayjs(time).format("HH:mm:ss")}`} className="block font-medium mb-4 text-blue-600 border border-blue-600 rounded hover:text-white hover:bg-blue-600 py-4">
        {dayjs(time).format("hh:mma")}
      </Link>
    </div>
  ));

  return (
    <>
      <div className="sm:border-r sm:w-1/3">
        <Image 
          src={user.avatar ?? "/avatar/default-avatar.svg"} 
          alt="Avatar"
          width={96}
          height={96}
          className="rounded-full mb-4"
        />
        <h2 className="font-medium text-gray-500">{user.name}</h2>
        <h1 className="text-3xl font-semibold text-gray-800 mb-4">{eventType.title}</h1>
        <p className="text-gray-500 mb-4">
          <svg className="inline-block w-4 h-4 mr-1 -mt-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          {eventType.length} minutes
        </p>
        <p className="text-gray-600">{eventType.description}</p>
      </div>
      <div className="mt-8 sm:mt-0 sm:w-1/3 border-r sm:px-4">
        <div className="flex text-gray-600 font-light text-xl mb-4 ml-2">
          <span className="w-1/2">{dayjs().month(selectedMonth).format("MMMM YYYY")}</span>
          <div className="w-1/2 text-right">
            <Button 
              onClick={decrementMonth} 
              variant={selectedMonth < dayjs().month() ? 'white' : 'secondary'}
              size="xs"
              className={`mr-4 p-2 border ${selectedMonth < dayjs().month() ? 'border-red-500 text-gray-400 cursor-not-allowed' : 'border-green-500 text-blue-600 hover:text-blue-800'}`}
              disabled={selectedMonth < dayjs().month()}
            >
              <svg 
                className="w-5 h-5" 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path 
                  fillRule="evenodd" 
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" 
                  clipRule="evenodd" 
                />
              </svg>
            </Button>
            <Button 
              onClick={incrementMonth} 
              variant="secondary"
              size="xs"
              className="p-2 border border-green-500 text-blue-600 hover:text-blue-800"
            >
              <svg 
                className="w-5 h-5" 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path 
                  fillRule="evenodd" 
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" 
                  clipRule="evenodd" 
                />
              </svg>
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-y-4 text-center">
          {calendar}
        </div>
      </div>
      <div className="sm:pl-4 mt-8 sm:mt-0 sm:w-1/3 hidden sm:block text-center">
        <div className="text-gray-600 font-light text-xl mb-4 text-left">
          <span>{dayjs(selectedDate).format("dddd DD MMMM YYYY")}</span>
        </div>
        {!loading ? availableTimes : <Spinner />}
      </div>
    </>
  );
}
