import { ReservationInfo } from '../../components/ReservationInfo/ReservationInfo';
import { OptionsInput } from '../../components/OptionsInput';
import { useEffect, useState } from 'react';
import { LargeButton } from '../../components/LargeButton';
import {
  PostReservation,
  ReservationHaenyeoPlace,
  getReservationHaenyeoPlace,
  postReservation,
} from '../../api/reservation';
import { useNavigate, useParams } from 'react-router-dom';
import { useModalContext } from '../../contexts/ModalContext';
import { AlertBox } from '../../components/AlertBox';

export const ReservationCreate = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { openModal, closeModal } = useModalContext();
  const [haenyeoPlace, setHaenyeoPlace] =
    useState<ReservationHaenyeoPlace | null>(null);
  const [placeId, setPlaceId] = useState(params.placeValue || '');
  const [personName, setPersonName] = useState('');
  const [selectedAvailableDate, setSelectedAvailableDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [peopleCount, setPeopleCount] = useState('');
  const [phone, setPhone] = useState('');

  const handleReservation = async () => {
    try {
      const form: PostReservation = {
        placeId,
        personName,
        selectedAvailableDate,
        selectedTime,
        peopleCount,
        phone,
      };
      await postReservation(form);
      openModal('reservationSuccess');
      setTimeout(() => {
        navigate('/home');
        closeModal();
      }, 1000);
    } catch (error) {
      openModal('reservationFail');
      setTimeout(() => {
        closeModal();
      }, 1000);
    }
  };

  const fetchHaenyeoPlace = async () => {
    try {
      if (!params.placeValue) return;
      const data = await getReservationHaenyeoPlace(params.placeValue);
      setHaenyeoPlace(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchHaenyeoPlace();
  }, [params.placeValue]);

  return (
    <div>
      <div className="p-[18px]">
        {haenyeoPlace && (
          <ReservationInfo
            imageSrc={haenyeoPlace.imageUrl}
            title={haenyeoPlace.name}
            address={haenyeoPlace.address}
            price={haenyeoPlace.price}
          />
        )}
      </div>
      <div className="h-[5px] w-full bg-[#F7F7FA]"></div>
      <div className="flex h-full flex-col justify-between gap-[12px] p-[18px]">
        <div>
          <div className="flex flex-col gap-[10px]">
            <div className="block text-[14px] font-semibold text-gray-900">
              예약자명
            </div>
            <input
              name="personName"
              value={personName}
              autoComplete="off"
              onChange={(e) => setPersonName(e.target.value)}
              className="h-[40px] w-full rounded-md border border-gray-050 bg-gray-100 px-4 text-[14px] text-gray-700 focus:border-transparent focus:outline-none focus:ring-1 focus:ring-gray-300"
            />
          </div>
          <div className="flex flex-col gap-[10px]">
            <div className="block text-[14px] font-semibold text-gray-900">
              전화번호
            </div>
            <input
              name="phone"
              autoComplete="off"
              value={phone}
              onChange={(e) =>
                setPhone(
                  e.target.value
                    .replace(/[^0-9]/g, '')
                    .replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
                    .replace('--', '-'),
                )
              }
              className="h-[40px] w-full rounded-md border border-gray-050 bg-gray-100 px-4 text-[14px] text-gray-700 focus:border-transparent focus:outline-none focus:ring-1 focus:ring-gray-300"
            />
          </div>

          <OptionsInput
            inputLabel="날짜"
            options={haenyeoPlace?.availableDate || []}
            value={selectedAvailableDate}
            onSelectOption={(option) => setSelectedAvailableDate(option)}
          />
          <OptionsInput
            inputLabel="시간"
            options={['오전 09:00', '오후 12:00', '오후 03:00']}
            value={selectedTime}
            onSelectOption={(option) => setSelectedTime(option)}
          />
          <div className="flex flex-col gap-[10px]">
            <div className="block text-[14px] font-semibold text-gray-900">
              인원
            </div>
            <div className="flex items-center gap-2">
              <input
                name="peopleCount"
                type="number"
                value={peopleCount || ''}
                autoComplete="off"
                onChange={(e) => setPeopleCount(e.target.value)}
                className="h-[40px] w-[80px] rounded-md border border-gray-050 bg-gray-100 px-4 text-[14px] text-gray-700 focus:border-transparent focus:outline-none focus:ring-1 focus:ring-gray-300"
              />

              <p className="text-[14px]">명</p>
            </div>
          </div>
        </div>
        <div className="mt-[50px]">
          <LargeButton
            onClick={handleReservation}
            disabled={
              !personName.trim() ||
              !selectedAvailableDate ||
              !selectedTime ||
              (typeof peopleCount === 'number' && peopleCount <= 0)
            }
          >
            예약하기
          </LargeButton>
        </div>
      </div>
      <AlertBox id="reservationSuccess">
        <div className="flex size-full flex-col items-center justify-center text-center text-lg font-bold text-gray-900">
          <img src="/images/haenyeo.png"></img>
          예약이 완료되었습니다!
        </div>
      </AlertBox>
      <AlertBox id="reservationFail">
        <div className="flex size-full flex-col items-center justify-center text-center text-lg font-bold text-gray-900">
          <img src="/images/haenyeo.png"></img>
          예약이 실패했습니다!
        </div>
      </AlertBox>
    </div>
  );
};
