import { useEffect, useState } from 'react';
import {
  MyPageReservationType,
  getReservationCount,
  getReservationList,
} from '../../api/myPage';
import { SwitchReservationStatus } from '../../components/SwitchReservationStatus';
import { MyPageReservationCard } from '../../components/MyPageReservationCard';
import { useNavigate } from 'react-router-dom';
import { cancelReservation, completeReservation } from '../../api/reservation';

export const MyPageReservation = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'PENDING' | 'END'>('PENDING');
  const [reservations, setReservations] = useState<MyPageReservationType[]>([]);
  const [reservationCounts, setReservationCounts] = useState({
    pendingCount: 0,
    endCount: 0,
  });

  const handleComplete = async (reservationId: number) => {
    try {
      await completeReservation(reservationId);
      fetchReservations();
      fetchReservationCounts();
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancel = async (reservationId: number) => {
    try {
      await cancelReservation(reservationId);
      fetchReservations();
      fetchReservationCounts();
    } catch (error) {
      console.error(error);
    }
  };

  const fetchReservations = async () => {
    try {
      const response = await getReservationList(status);
      setReservations(response);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchReservationCounts = async () => {
    try {
      const response = await getReservationCount();
      setReservationCounts(response);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, [status]);

  useEffect(() => {
    fetchReservationCounts();
  }, []);

  return (
    <div>
      <div className="flex w-full justify-center">
        <SwitchReservationStatus
          status={status}
          onStatusChange={setStatus}
          pendingCount={reservationCounts.pendingCount}
          endCount={reservationCounts.endCount}
        />
      </div>
      {reservations.length === 0 && (
        <div className="flex h-[400px] w-full flex-col items-center justify-center text-lg font-bold text-gray-900">
          <img src="/images/haenyeo.png"></img>
          예약정보가 없습니다
        </div>
      )}
      <div className="flex flex-col overflow-auto">
        {reservations.map((reservation) => (
          <MyPageReservationCard
            key={reservation.id}
            reservationId={reservation.id}
            imageSrc={reservation.imageUrl}
            title={reservation.name}
            address={reservation.address}
            fullDate={reservation.reservationDate}
            people={reservation.peopleCount}
            status={reservation.status}
            onRegister={() => {
              navigate('/dictionary/registration');
            }}
            onComplete={handleComplete}
            onCancel={handleCancel}
          />
        ))}
      </div>
      <div className="h-[5px] w-full bg-[#F7F7FA]"></div>
    </div>
  );
};
