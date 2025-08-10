
import { useTripCreateMutation } from './mutations/useTripCreateMutation';
import { useTripUpdateMutation } from './mutations/useTripUpdateMutation';
import { useTripDeleteMutation } from './mutations/useTripDeleteMutation';

export const useTripMutations = () => {
  const createTrip = useTripCreateMutation();
  const updateTrip = useTripUpdateMutation();
  const deleteTrip = useTripDeleteMutation();

  return {
    createTrip,
    updateTrip,
    deleteTrip,
  };
};
